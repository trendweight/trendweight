using Microsoft.AspNetCore.Authorization;
using TrendWeight.Infrastructure.Auth;
using TrendWeight.Infrastructure.Middleware;
using TrendWeight.Features.Providers;
using TrendWeight.Features.Providers.Withings;
using TrendWeight.Infrastructure.DataAccess;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Measurements;

namespace TrendWeight.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{

    public static IServiceCollection AddSupabaseAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Get Supabase config (already registered in AddTrendWeightServices)
        var supabaseConfig = new SupabaseConfig();
        configuration.GetSection("Supabase").Bind(supabaseConfig);

        // Configure authentication - Supabase only
        services.AddAuthentication("Supabase")
            .AddScheme<SupabaseAuthenticationSchemeOptions, SupabaseAuthenticationHandler>("Supabase", null);

        // Configure authorization
        services.AddAuthorization(options =>
        {
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
        });

        return services;
    }

    public static IServiceCollection AddTrendWeightServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register Supabase services
        var supabaseConfig = new SupabaseConfig();
        configuration.GetSection("Supabase").Bind(supabaseConfig);
        services.AddSingleton(supabaseConfig);
        services.AddSingleton<ISupabaseService, SupabaseService>();

        // Register feature services
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IProviderLinkService, ProviderLinkService>();
        services.AddScoped<ISourceDataService, SourceDataService>();

        // Register Withings service
        var withingsConfig = new WithingsConfig();
        configuration.GetSection("Withings").Bind(withingsConfig);
        services.AddSingleton(withingsConfig);
        services.AddHttpClient<IWithingsService, WithingsService>();
        services.AddHttpClient<IProviderService, WithingsService>();

        // Register provider integration orchestrator
        services.AddScoped<IProviderIntegrationService, ProviderIntegrationService>();

        // Add feature services as we implement them
        // services.AddScoped<IMeasurementService, MeasurementService>();
        // services.AddScoped<IProfileService, ProfileService>();
        // services.AddScoped<ISettingsService, SettingsService>();

        return services;
    }
}
