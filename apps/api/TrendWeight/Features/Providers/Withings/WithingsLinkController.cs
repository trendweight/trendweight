using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.Providers.Withings;

/// <summary>
/// Controller for Withings OAuth flow
/// </summary>
[ApiController]
[Route("api/withings")]
[Authorize]
public class WithingsLinkController : ControllerBase
{
    private readonly IWithingsService _withingsService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WithingsLinkController> _logger;

    public WithingsLinkController(
        IWithingsService withingsService,
        IConfiguration configuration,
        ILogger<WithingsLinkController> logger)
    {
        _withingsService = withingsService;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Gets the Withings authorization URL for linking
    /// </summary>
    /// <returns>Authorization URL and state</returns>
    [HttpGet("link")]
    public IActionResult GetAuthorizationUrl()
    {
        try
        {
            // Get Firebase UID from JWT
            var firebaseUid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(firebaseUid))
            {
                return Unauthorized(new { error = "User ID not found in token" });
            }

            // Get JWT signing key
            var jwtSigningKey = _configuration["Jwt:SigningKey"];
            if (string.IsNullOrEmpty(jwtSigningKey))
            {
                _logger.LogError("JWT signing key not configured");
                return StatusCode(500, new { error = "JWT signing key not configured" });
            }

            // Create OAuth state
            var state = new OAuthState
            {
                Uid = firebaseUid,
                Reason = "link"
            };

            // Sign the state with JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtSigningKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("uid", state.Uid),
                    new Claim("reason", state.Reason)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var signedState = tokenHandler.WriteToken(token);

            // Get callback URL
            var callbackUrl = $"{Request.Scheme}://{Request.Host}/api/withings/callback";
            
            // Get authorization URL
            var authorizationUrl = _withingsService.GetAuthorizationUrl(signedState, callbackUrl);

            return Ok(new
            {
                authorizationUrl = authorizationUrl,
                state = state
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating Withings authorization URL");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}