using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TrendWeight.Features.Common;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public abstract class BaseAuthController : ControllerBase
{
    protected string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
        ?? throw new UnauthorizedAccessException("User ID not found");
        
    protected string? UserEmail => User.FindFirst(ClaimTypes.Email)?.Value;
    
    protected string? GetClaim(string claimType)
    {
        return User.FindFirst(claimType)?.Value;
    }
    
    protected bool HasClaim(string claimType)
    {
        return User.HasClaim(c => c.Type == claimType);
    }
}