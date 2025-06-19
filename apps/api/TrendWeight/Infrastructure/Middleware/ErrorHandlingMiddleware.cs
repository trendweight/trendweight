using System.Net;
using System.Text.Json;
using FirebaseAdmin.Auth;

namespace TrendWeight.Infrastructure.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new ErrorResponse();

        switch (exception)
        {
            case FirebaseAuthException:
                response.Message = "Authentication failed";
                response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;
                
            case ArgumentNullException:
            case ArgumentException:
                response.Message = exception.Message;
                response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;
                
            case KeyNotFoundException:
                response.Message = "Resource not found";
                response.StatusCode = (int)HttpStatusCode.NotFound;
                break;
                
            case UnauthorizedAccessException:
                response.Message = "Access denied";
                response.StatusCode = (int)HttpStatusCode.Forbidden;
                break;
                
            default:
                response.Message = "An error occurred while processing your request";
                response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        context.Response.StatusCode = response.StatusCode;
        
        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
        
        await context.Response.WriteAsync(jsonResponse);
    }
}

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public string? Details { get; set; }
}