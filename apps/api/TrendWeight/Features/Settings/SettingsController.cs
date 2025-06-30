using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.Settings.Models;
using TrendWeight.Infrastructure.DataAccess;
using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Settings;

[ApiController]
[Route("api/settings")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly ISupabaseService _supabaseService;
    private readonly ILogger<SettingsController> _logger;

    public SettingsController(
        ISupabaseService supabaseService,
        ILogger<SettingsController> logger)
    {
        _supabaseService = supabaseService;
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

            // Get user from Supabase by Firebase UID
            var users = await _supabaseService.QueryAsync<DbUser>(query => 
                query.Where(u => u.FirebaseUid == userId));
            
            var user = users.FirstOrDefault();
            if (user == null)
            {
                _logger.LogWarning("User document not found for Firebase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Map to SettingsData (matching legacy behavior)
            var userSettings = new SettingsData
            {
                Uid = userId, // Firebase UID for compatibility
                Email = user.Email,
                FirstName = user.Profile.FirstName,
                Timezone = user.Profile.Timezone,
                GoalStart = user.Profile.GoalStart,
                GoalWeight = user.Profile.GoalWeight,
                PlannedPoundsPerWeek = user.Profile.PlannedPoundsPerWeek,
                DayStartOffset = user.Profile.DayStartOffset,
                UseMetric = user.Profile.UseMetric,
                ShowCalories = user.Profile.ShowCalories,
                SharingToken = user.Profile.SharingToken
            };

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
