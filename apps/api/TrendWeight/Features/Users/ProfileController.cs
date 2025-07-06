using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.Common;
using TrendWeight.Features.Users.Models;
using TrendWeight.Features.Users.Services;

namespace TrendWeight.Features.Users;

/// <summary>
/// Controller for user profile data.
/// Provides a subset of settings data needed for dashboard rendering.
/// This endpoint is separate from settings to support future dashboard sharing.
/// </summary>
[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : BaseAuthController
{
    private readonly IUserService _userService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(
        IUserService userService,
        ILogger<ProfileController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Gets the authenticated user's profile data.
    /// Returns only the data needed for dashboard rendering, excluding sensitive information like email.
    /// </summary>
    /// <returns>The user's profile data</returns>
    [HttpGet]
    public async Task<ActionResult<ProfileData>> GetProfile()
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

            _logger.LogInformation("Getting profile for user ID: {UserId}", userId);

            // Get user from Supabase by UID
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User document not found for Supabase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Map to ProfileData (subset of SettingsData, excluding email and uid)
            var profileData = new ProfileData
            {
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

            return Ok(profileData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
