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
            return AuthenticateResult.Fail("Invalid token");
        }

        try
        {
            var firebaseToken = await _firebaseService.VerifyIdTokenAsync(token);
            
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, firebaseToken.Uid),
                new("firebase_uid", firebaseToken.Uid)
            };

            // Add email if present
            if (firebaseToken.Claims.TryGetValue("email", out var email) && email != null)
            {
                claims.Add(new Claim(ClaimTypes.Email, email.ToString()!));
            }

            // Add any custom claims
            foreach (var claim in firebaseToken.Claims)
            {
                if (claim.Key != "email" && claim.Value != null)
                {
                    claims.Add(new Claim($"firebase_{claim.Key}", claim.Value.ToString()!));
                }
            }

            var identity = new ClaimsIdentity(claims, Scheme.Name);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, Scheme.Name);

            return AuthenticateResult.Success(ticket);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Firebase authentication failed");
            return AuthenticateResult.Fail("Invalid token");
        }
    }
}