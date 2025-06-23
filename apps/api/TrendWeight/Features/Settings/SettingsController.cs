using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.Settings.Models;
using TrendWeight.Infrastructure.Firebase;

namespace TrendWeight.Features.Settings;

[ApiController]
[Route("api/settings")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly IFirestoreService _firestoreDb;
    private readonly ILogger<SettingsController> _logger;

    public SettingsController(
        IFirestoreService firestoreDb,
        ILogger<SettingsController> logger)
    {
        _firestoreDb = firestoreDb;
        _logger = logger;
    }

    /// <summary>
    /// Gets the user's settings
    /// </summary>
    /// <returns>The user's settings</returns>
    [HttpGet]
    public async Task<ActionResult<object>> GetSettings()
    {
        try
        {
            // Get user ID from authenticated user claim
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                _logger.LogWarning("User ID not found in authenticated user claims");
                return Unauthorized(new { error = "User ID not found" });
            }

            // Get user from Firestore
            var userSettings = await _firestoreDb.GetDocumentAsync<SettingsData>("users", userId);
            if (userSettings == null)
            {
                _logger.LogWarning("User document not found for user ID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Add user ID and timestamp to response (matching legacy behavior)
            userSettings.Uid = userId;

            // Return user settings with current timestamp
            return Ok(new
            {
                user = userSettings,
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting settings for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
