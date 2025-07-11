using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Security.Claims;
using TrendWeight.Features.Profile.Models;
using TrendWeight.Features.Profile.Services;

namespace TrendWeight.Features.Profile;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
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
    /// Gets the user's profile/settings
    /// </summary>
    /// <returns>The user's profile data</returns>
    [HttpGet]
    public async Task<ActionResult<object>> GetProfile()
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

            // Get user from Supabase by UID
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User document not found for Supabase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Map to ProfileData
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

            // Return profile data with metadata
            return Ok(new
            {
                user = new
                {
                    uid = userId,
                    email = user.Email,
                    firstName = profileData.FirstName,
                    timezone = profileData.Timezone,
                    goalStart = profileData.GoalStart?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                    goalWeight = profileData.GoalWeight,
                    plannedPoundsPerWeek = profileData.PlannedPoundsPerWeek,
                    dayStartOffset = profileData.DayStartOffset,
                    useMetric = profileData.UseMetric,
                    showCalories = profileData.ShowCalories,
                    sharingToken = profileData.SharingToken
                },
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Updates the user's profile/settings
    /// </summary>
    /// <param name="request">The profile fields to update</param>
    /// <returns>The updated profile data</returns>
    [HttpPut]
    public async Task<ActionResult<object>> UpdateProfile([FromBody] UpdateProfileRequest request)
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

            // Get user from database
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User document not found for Supabase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Update only the fields that were provided
            if (request.FirstName != null)
                user.Profile.FirstName = request.FirstName;
            if (request.Timezone != null)
                user.Profile.Timezone = request.Timezone;
            if (request.GoalStart.HasValue)
                user.Profile.GoalStart = request.GoalStart.Value;
            if (request.GoalWeight.HasValue)
                user.Profile.GoalWeight = request.GoalWeight.Value;
            if (request.PlannedPoundsPerWeek.HasValue)
                user.Profile.PlannedPoundsPerWeek = request.PlannedPoundsPerWeek.Value;
            if (request.DayStartOffset.HasValue)
                user.Profile.DayStartOffset = request.DayStartOffset.Value;
            if (request.UseMetric.HasValue)
                user.Profile.UseMetric = request.UseMetric.Value;
            if (request.ShowCalories.HasValue)
                user.Profile.ShowCalories = request.ShowCalories.Value;

            // Update timestamp
            user.UpdatedAt = DateTime.UtcNow.ToString("o");

            // Save to database
            await _userService.UpdateAsync(user);

            // Return updated profile data
            return await GetProfile();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
