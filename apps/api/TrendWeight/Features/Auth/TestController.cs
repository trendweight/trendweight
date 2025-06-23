using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.Common;

namespace TrendWeight.Features.Auth;

public class TestController : BaseAuthController
{
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Authenticated request received from user: {UserId}", UserId);
        
        var claims = User.Claims.Select(c => new
        {
            Type = c.Type,
            Value = c.Value
        }).ToList();

        return Ok(new
        {
            UserId,
            Email = UserEmail,
            Claims = claims,
            Message = "Authentication successful!"
        });
    }
}
