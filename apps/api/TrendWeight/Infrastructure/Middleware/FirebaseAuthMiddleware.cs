using System.Security.Claims;
using FirebaseAdmin.Auth;
using TrendWeight.Infrastructure.Firebase;

namespace TrendWeight.Infrastructure.Middleware;

public class FirebaseAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IFirebaseService _firebaseService;
    private readonly ILogger<FirebaseAuthMiddleware> _logger;

    public FirebaseAuthMiddleware(
        RequestDelegate next,
        IFirebaseService firebaseService,
        ILogger<FirebaseAuthMiddleware> logger)
    {
        _next = next;
        _firebaseService = firebaseService;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = GetTokenFromHeader(context);
        
        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var firebaseToken = await _firebaseService.VerifyIdTokenAsync(token);
                
                var claims = new List<Claim>
                {
                    new(ClaimTypes.NameIdentifier, firebaseToken.Uid),
                    new(ClaimTypes.Email, firebaseToken.Claims.GetValueOrDefault("email")?.ToString() ?? ""),
                    new("firebase_uid", firebaseToken.Uid)
                };

                // Add any custom claims from Firebase
                foreach (var claim in firebaseToken.Claims)
                {
                    if (claim.Key != "email" && claim.Value != null)
                    {
                        claims.Add(new Claim($"firebase_{claim.Key}", claim.Value.ToString()!));
                    }
                }

                var identity = new ClaimsIdentity(claims, "Firebase");
                context.User = new ClaimsPrincipal(identity);
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogWarning(ex, "Invalid Firebase token");
                // Don't set user, let authorization policies handle it
            }
        }

        await _next(context);
    }

    private static string? GetTokenFromHeader(HttpContext context)
    {
        var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
        
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return authHeader.Substring("Bearer ".Length).Trim();
    }
}