using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace TrendWeight.Infrastructure.Firebase;

public class FirebaseAuthenticationSchemeOptions : AuthenticationSchemeOptions { }

public class FirebaseAuthenticationHandler : AuthenticationHandler<FirebaseAuthenticationSchemeOptions>
{
    private readonly IFirebaseService _firebaseService;

    public FirebaseAuthenticationHandler(
        IOptionsMonitor<FirebaseAuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IFirebaseService firebaseService)
        : base(options, logger, encoder)
    {
        _firebaseService = firebaseService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return AuthenticateResult.NoResult();
        }

        var authHeader = Request.Headers.Authorization.ToString();
        if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return AuthenticateResult.NoResult();
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();
        if (string.IsNullOrEmpty(token))
        {
            return AuthenticateResult.Fail("Token is empty");
        }

        try
        {
            var firebaseToken = await _firebaseService.VerifyIdTokenAsync(token);
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, firebaseToken.Uid),
                new("firebase:uid", firebaseToken.Uid)
            };

            if (firebaseToken.Claims.TryGetValue("email", out var email) && email != null)
            {
                claims.Add(new Claim(ClaimTypes.Email, email.ToString() ?? string.Empty));
            }

            if (firebaseToken.Claims.TryGetValue("name", out var name) && name != null)
            {
                claims.Add(new Claim(ClaimTypes.Name, name.ToString() ?? string.Empty));
            }

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Firebase authentication failed");
            return AuthenticateResult.Fail(ex);
        }
    }
}