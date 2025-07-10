using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using TrendWeight.Features.Common;

namespace TrendWeight.Features.Providers.Fitbit;

/// <summary>
/// Controller for initiating Fitbit OAuth flow
/// </summary>
[ApiController]
[Route("api/fitbit")]
public class FitbitLinkController : BaseAuthController
{
    private readonly IFitbitService _fitbitService;
    private readonly FitbitConfig _config;
    private readonly IConfiguration _configuration;
    private readonly ILogger<FitbitLinkController> _logger;

    /// <summary>
    /// Constructor
    /// </summary>
    public FitbitLinkController(
        IFitbitService fitbitService,
        FitbitConfig config,
        IConfiguration configuration,
        ILogger<FitbitLinkController> logger)
    {
        _fitbitService = fitbitService;
        _config = config;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Initiates Fitbit OAuth flow
    /// </summary>
    [HttpGet("link")]
    public IActionResult LinkFitbit()
    {
        // Get JWT signing key
        var jwtSigningKey = _configuration["Jwt:SigningKey"];
        if (string.IsNullOrEmpty(jwtSigningKey))
        {
            _logger.LogError("JWT signing key not configured");
            return StatusCode(500, new { error = "JWT signing key not configured" });
        }

        // Generate state token with user ID and expiration
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(jwtSigningKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("uid", UserId),
                new Claim("reason", "link")
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var state = tokenHandler.WriteToken(token);

        // Get callback URL - ForwardedHeaders middleware has already updated Request.Scheme and Request.Host
        var callbackUrl = $"{Request.Scheme}://{Request.Host}/api/fitbit/callback";

        _logger.LogInformation("Using callback URL: {CallbackUrl}", callbackUrl);

        // Get authorization URL
        var authUrl = _fitbitService.GetAuthorizationUrl(state, callbackUrl);

        _logger.LogInformation("Generated authorization URL: {AuthorizationUrl}", authUrl);

        return Ok(new { url = authUrl });
    }
}
