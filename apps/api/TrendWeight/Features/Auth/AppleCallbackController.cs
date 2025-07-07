using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TrendWeight.Features.Auth;

[ApiController]
[Route("api/auth/apple")]
[AllowAnonymous]
public class AppleCallbackController : ControllerBase
{
    [HttpPost("callback")]
    public IActionResult Callback(ILogger<AppleCallbackController> logger)
    {
        // Log the incoming request details (ForwardedHeaders middleware has already updated these)
        logger.LogInformation("Apple callback received - Method: {Method}, Scheme: {Scheme}, Host: {Host}, Path: {Path}",
            Request.Method, Request.Scheme, Request.Host, Request.Path);

        // Log all form data received
        foreach (var kvp in Request.Form)
        {
            // Don't log sensitive data in production, but for debugging this is helpful
            var value = kvp.Key.Contains("token", StringComparison.OrdinalIgnoreCase)
                ? $"[REDACTED-{kvp.Value.ToString().Length}-chars]"
                : kvp.Value.ToString();
            logger.LogInformation("Apple form data - {Key}: {Value}", kvp.Key, value);
        }

        // Convert form data to query string
        var queryString = string.Join("&", Request.Form.Select(kvp =>
            $"{Uri.EscapeDataString(kvp.Key)}={Uri.EscapeDataString(kvp.Value.ToString())}"));

        // Redirect to frontend with all the form data as query parameters
        // The ForwardedHeaders middleware has already updated Request.Scheme and Request.Host
        var redirectUrl = $"{Request.Scheme}://{Request.Host}/auth/apple/callback?{queryString}";

        logger.LogInformation("Redirecting to: {RedirectUrl}", redirectUrl);

        return Redirect(redirectUrl);
    }
}
