using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.Providers.Withings;

/// <summary>
/// Controller for handling Withings OAuth callback
/// </summary>
[ApiController]
[Route("api/withings")]
public class WithingsCallbackController : ControllerBase
{
    private readonly IWithingsService _withingsService;
    private readonly IUserService _userService;
    private readonly IProviderLinkService _providerLinkService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WithingsCallbackController> _logger;

    public WithingsCallbackController(
        IWithingsService withingsService,
        IUserService userService,
        IProviderLinkService providerLinkService,
        IConfiguration configuration,
        ILogger<WithingsCallbackController> logger)
    {
        _withingsService = withingsService;
        _userService = userService;
        _providerLinkService = providerLinkService;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Handles the OAuth callback from Withings
    /// </summary>
    /// <param name="code">Authorization code from Withings</param>
    /// <param name="state">Signed state token</param>
    /// <returns>Link details and access token</returns>
    [HttpGet("callback")]
    public async Task<IActionResult> HandleCallback([FromQuery] string code, [FromQuery] string state)
    {
        try
        {
            if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
            {
                return BadRequest(new { error = "Missing code or state parameter" });
            }

            // Get JWT signing key
            var jwtSigningKey = _configuration["Jwt:SigningKey"];
            if (string.IsNullOrEmpty(jwtSigningKey))
            {
                _logger.LogError("JWT signing key not configured");
                return StatusCode(500, new { error = "JWT signing key not configured" });
            }

            // Verify and decode the state
            OAuthState? linkDetails;
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(jwtSigningKey);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(state, validationParameters, out var validatedToken);

                var uid = principal.FindFirst("uid")?.Value;
                var reason = principal.FindFirst("reason")?.Value;

                if (string.IsNullOrEmpty(uid) || string.IsNullOrEmpty(reason))
                {
                    throw new SecurityTokenException("Invalid state token");
                }

                linkDetails = new OAuthState { Uid = uid, Reason = reason };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Invalid state token");
                return StatusCode(500, new { error = "Invalid state" });
            }

            // Get user by Supabase UID
            var user = await _userService.GetByIdAsync(linkDetails.Uid);
            if (user == null)
            {
                _logger.LogError("User not found for user ID: {UserId}", linkDetails.Uid);
                return NotFound(new { error = "User not found" });
            }

            // Exchange authorization code for access token
            // ForwardedHeaders middleware has already updated Request.Scheme and Request.Host
            var callbackUrl = $"{Request.Scheme}://{Request.Host}/api/withings/callback";

            _logger.LogDebug("Exchanging code for token with callback URL: {CallbackUrl}", callbackUrl);

            // Use the base class method that handles everything
            var success = await _withingsService.ExchangeAuthorizationCodeAsync(code, callbackUrl, user.Uid);

            if (!success)
            {
                _logger.LogError("Failed to exchange Withings authorization code");
                return BadRequest("Failed to complete authorization");
            }

            _logger.LogDebug("Withings link created successfully for user {UserId}", user.Uid);

            // Redirect to frontend success page
            var redirectUrl = $"{Request.Scheme}://{Request.Host}/oauth/withings/callback?success=true";

            _logger.LogDebug("Redirecting to: {RedirectUrl}", redirectUrl);

            return Redirect(redirectUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling Withings callback");

            // Redirect to frontend error page
            return Redirect($"{Request.Scheme}://{Request.Host}/oauth/withings/callback?success=false&error={Uri.EscapeDataString(ex.Message)}");
        }
    }
}
