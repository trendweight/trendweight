using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.HostFiltering;
using Microsoft.AspNetCore.HttpOverrides;
using TrendWeight.Infrastructure.Extensions;
using TrendWeight.Infrastructure.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Disable ASP.NET Core's built-in host filtering since we have custom validation
builder.Services.Configure<HostFilteringOptions>(options =>
{
    options.AllowedHosts = new List<string> { "*" };
});

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Use camelCase for all JSON property names
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;

        // Ensure DateTime values are serialized with timezone info (as UTC)
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.WriteIndented = false;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Supabase authentication
builder.Services.AddSupabaseAuthentication(builder.Configuration);

// Add TrendWeight services
builder.Services.AddTrendWeightServices(builder.Configuration);

// Add CORS for development
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentCors", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000") // Vite and Next.js ports
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add HTTP logging
builder.Services.AddHttpLogging(options =>
{
    options.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.RequestPath |
                          Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.RequestMethod |
                          Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.ResponseStatusCode |
                          Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.Duration;
});

// Configure forwarded headers for proxy scenarios
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;

    // Clear default networks/proxies to trust headers from load balancers
    // Security Note: Host header validation is performed later in the pipeline
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();

    // Limit proxy chain depth to prevent spoofing
    options.ForwardLimit = 2; // Allows for Cloudflare -> DigitalOcean chain
    options.RequireHeaderSymmetry = false;
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseMiddleware<ErrorHandlingMiddleware>();

// Enable HTTP request logging
app.UseHttpLogging();

// Use forwarded headers from proxies
app.UseForwardedHeaders();

// Validate host header for security (prevent host header injection)
if (app.Environment.IsProduction())
{
    app.Use(async (context, next) =>
    {
        var allowedHostsConfig = app.Configuration["AllowedHosts"];

        if (!string.IsNullOrEmpty(allowedHostsConfig) && allowedHostsConfig != "*")
        {
            var allowedHosts = allowedHostsConfig.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var requestHost = context.Request.Host.Host;

            // Check both with and without port
            var hostMatches = allowedHosts.Any(h =>
                h.Equals(requestHost, StringComparison.OrdinalIgnoreCase) ||
                h.Equals(context.Request.Host.Value, StringComparison.OrdinalIgnoreCase));

            if (!hostMatches)
            {
                app.Logger.LogWarning("Rejected request with invalid host header: {Host}", context.Request.Host.Value);
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("Bad Request: Invalid Host header");
                return;
            }
        }
        await next();
    });
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevelopmentCors");
}

app.UseHttpsRedirection();

// Serve static files from wwwroot (for production container)
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoint for container health checks
app.MapGet("/api/health", () => Results.Ok(new { status = "healthy", service = "TrendWeight API", timestamp = DateTime.UtcNow }));

// For production, serve the SPA for any non-API routes
if (!app.Environment.IsDevelopment())
{
    app.MapFallbackToFile("index.html");
}

app.Run();
