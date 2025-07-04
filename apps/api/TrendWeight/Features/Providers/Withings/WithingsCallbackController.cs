using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using TrendWeight.Features.Users.Services;
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
            var scheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? Request.Scheme;
            var host = Request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? Request.Host.ToString();
            var callbackUrl = $"{scheme}://{host}/api/withings/callback";
            
            _logger.LogInformation("Exchanging code for token with callback URL: {CallbackUrl}", callbackUrl);
            
            var accessToken = await _withingsService.ExchangeAuthorizationCodeAsync(code, callbackUrl);

            // Store the token
            await _providerLinkService.StoreProviderLinkAsync(
                user.Uid, 
                "withings", 
                accessToken,
                linkDetails.Reason);

            _logger.LogInformation("Withings link created successfully for user {UserId}", user.Uid);

            // Redirect to frontend success page
            var frontendScheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? Request.Scheme;
            var frontendHost = Request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? Request.Host.ToString();
            var redirectUrl = $"{frontendScheme}://{frontendHost}/oauth/withings/callback?success=true";
            
            _logger.LogInformation("Redirecting to: {RedirectUrl}", redirectUrl);
            _logger.LogInformation("X-Forwarded-Proto: {Proto}, X-Forwarded-Host: {Host}", 
                Request.Headers["X-Forwarded-Proto"].FirstOrDefault(), 
                Request.Headers["X-Forwarded-Host"].FirstOrDefault());
            
            return Redirect(redirectUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling Withings callback");
            
            // Redirect to frontend error page
            var frontendScheme = Request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? Request.Scheme;
            var frontendHost = Request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? Request.Host.ToString();
            return Redirect($"{frontendScheme}://{frontendHost}/oauth/withings/callback?success=false&error={Uri.EscapeDataString(ex.Message)}");
        }
    }
}