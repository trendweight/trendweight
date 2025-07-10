using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TrendWeight.Infrastructure.Auth;

namespace TrendWeight.Features.Providers.Fitbit;

/// <summary>
/// Controller for handling Fitbit OAuth callbacks
/// </summary>
[ApiController]
[Route("api/fitbit")]
[AllowAnonymous]
public class FitbitCallbackController : ControllerBase
{
    private readonly IFitbitService _fitbitService;
    private readonly FitbitConfig _config;
    private readonly IConfiguration _configuration;
    private readonly ILogger<FitbitCallbackController> _logger;

    /// <summary>
    /// Constructor
    /// </summary>
    public FitbitCallbackController(
        IFitbitService fitbitService,
        FitbitConfig config,
        IConfiguration configuration,
        ILogger<FitbitCallbackController> logger)
    {
        _fitbitService = fitbitService;
        _config = config;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Handles OAuth callback from Fitbit
    /// </summary>
    [HttpGet("callback")]
    public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
    {
        try
        {
            // Get JWT signing key
            var jwtSigningKey = _configuration["Jwt:SigningKey"];
            if (string.IsNullOrEmpty(jwtSigningKey))
            {
                _logger.LogError("JWT signing key not configured");
                return StatusCode(500, new { error = "JWT signing key not configured" });
            }

            // Validate state token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtSigningKey);

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(state, validationParameters, out var validatedToken);

            var uid = principal.FindFirst("uid")?.Value;
            var reason = principal.FindFirst("reason")?.Value;

            if (string.IsNullOrEmpty(uid) || string.IsNullOrEmpty(reason))
            {
                throw new SecurityTokenException("Invalid state token");
            }

            if (!Guid.TryParse(uid, out var userId))
            {
                _logger.LogWarning("Invalid user ID in state token");
                return BadRequest("Invalid user ID");
            }

            // Exchange code for tokens
            // ForwardedHeaders middleware has already updated Request.Scheme and Request.Host
            var callbackUrl = $"{Request.Scheme}://{Request.Host}/api/fitbit/callback";

            _logger.LogDebug("Exchanging code for token with callback URL: {CallbackUrl}", callbackUrl);

            var success = await _fitbitService.ExchangeAuthorizationCodeAsync(code, callbackUrl, userId);

            if (!success)
            {
                _logger.LogError("Failed to exchange Fitbit authorization code");
                return BadRequest("Failed to complete authorization");
            }

            // Redirect to frontend success page
            var redirectUrl = $"{Request.Scheme}://{Request.Host}/oauth/fitbit/callback?success=true";

            _logger.LogDebug("Redirecting to: {RedirectUrl}", redirectUrl);

            return Redirect(redirectUrl);
        }
        catch (SecurityTokenExpiredException)
        {
            _logger.LogWarning("State token expired");
            return BadRequest("Authorization expired. Please try again.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling Fitbit callback");

            // Redirect to frontend error page
            return Redirect($"{Request.Scheme}://{Request.Host}/oauth/fitbit/callback?success=false&error={Uri.EscapeDataString(ex.Message)}");
        }
    }
}
