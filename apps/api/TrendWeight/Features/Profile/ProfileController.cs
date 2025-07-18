using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Security.Claims;
using TrendWeight.Features.Profile.Models;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Profile;

[ApiController]
[Route("api/profile")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly ILegacyDbService _legacyDbService;
    private readonly IProviderLinkService _providerLinkService;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(
        IProfileService profileService,
        ILegacyDbService legacyDbService,
        IProviderLinkService providerLinkService,
        ILogger<ProfileController> logger)
    {
        _profileService = profileService;
        _legacyDbService = legacyDbService;
        _providerLinkService = providerLinkService;
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
            var user = await _profileService.GetByIdAsync(userId);
            if (user == null)
            {
                // Check for legacy profile migration
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (!string.IsNullOrEmpty(userEmail))
                {
                    var legacyProfile = await _legacyDbService.FindProfileByEmailAsync(userEmail);
                    if (legacyProfile != null)
                    {
                        _logger.LogInformation("Migrating legacy profile for email {Email}", userEmail);

                        // Create migrated profile
                        var migratedProfile = await MigrateLegacyProfileAsync(userId, userEmail, legacyProfile);

                        return BuildProfileResponse(migratedProfile, isMe: true);
                    }
                }

                _logger.LogWarning("User document not found for Supabase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            return BuildProfileResponse(user, isMe: true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Gets a user's profile/settings via sharing code (no authentication required)
    /// </summary>
    /// <param name="sharingCode">The sharing code</param>
    /// <returns>The user's profile data</returns>
    [HttpGet("{sharingCode}")]
    [AllowAnonymous]
    public async Task<ActionResult<object>> GetProfileBySharingCode(string sharingCode)
    {
        try
        {
            // Get user by sharing code
            var user = await _profileService.GetBySharingTokenAsync(sharingCode);
            if (user == null)
            {
                _logger.LogWarning("User not found for sharing code: {SharingCode}", sharingCode);
                return NotFound(new { error = "User not found" });
            }

            // Check if sharing is actually enabled
            if (!user.Profile.SharingEnabled)
            {
                _logger.LogWarning("Sharing is disabled for sharing code: {SharingCode}", sharingCode);
                return NotFound(new { error = "Sharing is disabled" });
            }

            // Always return isMe = false when using sharing code
            // This allows users to preview how their dashboard appears to others
            return BuildProfileResponse(user, isMe: false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting profile for sharing code");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    private ActionResult<object> BuildProfileResponse(DbProfile user, bool isMe)
    {
        // Map to ProfileData
        var profileData = new ProfileData
        {
            FirstName = user.Profile.FirstName,
            GoalStart = user.Profile.GoalStart,
            GoalWeight = user.Profile.GoalWeight,
            PlannedPoundsPerWeek = user.Profile.PlannedPoundsPerWeek,
            DayStartOffset = user.Profile.DayStartOffset,
            UseMetric = user.Profile.UseMetric,
            ShowCalories = user.Profile.ShowCalories,
            SharingToken = user.Profile.SharingToken,
            SharingEnabled = user.Profile.SharingEnabled,
            IsMigrated = user.Profile.IsMigrated,
            IsNewlyMigrated = user.Profile.IsNewlyMigrated
        };

        // Return profile data with metadata
        return Ok(new
        {
            user = new
            {
                uid = user.Uid.ToString(),
                email = user.Email,
                firstName = profileData.FirstName,
                goalStart = profileData.GoalStart?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                goalWeight = profileData.GoalWeight,
                plannedPoundsPerWeek = profileData.PlannedPoundsPerWeek,
                dayStartOffset = profileData.DayStartOffset,
                useMetric = profileData.UseMetric,
                showCalories = profileData.ShowCalories,
                sharingEnabled = profileData.SharingEnabled,
                isMigrated = profileData.IsMigrated,
                isNewlyMigrated = profileData.IsNewlyMigrated
            },
            isMe = isMe,
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Updates the user's profile/settings or creates a new profile if none exists
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

            // Get user email from authenticated user claim
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(userEmail))
            {
                _logger.LogWarning("User email not found in authenticated user claims");
                return Unauthorized(new { error = "User email not found" });
            }

            // Use the service to update or create the profile
            var profile = await _profileService.UpdateOrCreateProfileAsync(userId, userEmail, request);

            // Return updated profile data in the same format as GET
            return BuildProfileResponse(profile, isMe: true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Generate a new sharing token
    /// </summary>
    /// <returns>Updated sharing data with new token</returns>
    [HttpPost("generate-token")]
    public async Task<ActionResult<object>> GenerateNewToken()
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
            var user = await _profileService.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User document not found for Supabase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Generate a new unique token
            var newToken = await _profileService.GenerateUniqueShareTokenAsync();

            // Update the token
            user.Profile.SharingToken = newToken;
            user.UpdatedAt = DateTime.UtcNow.ToString("o");

            // Save the update
            var updatedUser = await _profileService.UpdateAsync(user);

            return Ok(new
            {
                sharingEnabled = updatedUser.Profile.SharingEnabled,
                sharingToken = updatedUser.Profile.SharingToken
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating new share token for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Complete the migration process by clearing the IsNewlyMigrated flag
    /// </summary>
    /// <returns>Success response</returns>
    [HttpPost("complete-migration")]
    public async Task<ActionResult> CompleteMigration()
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
            var user = await _profileService.GetByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("User document not found for Supabase UID: {UserId}", userId);
                return NotFound(new { error = "User not found" });
            }

            // Clear the IsNewlyMigrated flag
            user.Profile.IsNewlyMigrated = false;
            user.UpdatedAt = DateTime.UtcNow.ToString("o");

            // Save the update
            await _profileService.UpdateAsync(user);

            _logger.LogInformation("Completed migration for user {UserId}", userId);
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing migration for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Deletes the user's account and all associated data
    /// </summary>
    /// <returns>Success or error response</returns>
    [HttpDelete]
    public async Task<ActionResult> DeleteAccount()
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

            // Parse user ID as GUID
            if (!Guid.TryParse(userId, out var userGuid))
            {
                _logger.LogWarning("Invalid user ID format: {UserId}", userId);
                return BadRequest(new { error = "Invalid user ID format" });
            }

            // Delete the account
            var success = await _profileService.DeleteAccountAsync(userGuid);
            if (!success)
            {
                return StatusCode(500, new { error = "Failed to delete account" });
            }

            _logger.LogInformation("Account deleted successfully for user {UserId}", userId);
            return Ok(new { message = "Account deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting account");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Migrate a legacy profile to the new system
    /// </summary>
    private async Task<DbProfile> MigrateLegacyProfileAsync(string userId, string email, LegacyProfile legacyProfile)
    {
        // Create new profile with migrated data
        var userGuid = Guid.Parse(userId);
        var profile = new DbProfile
        {
            Uid = userGuid,
            Email = email,
            Profile = new ProfileData
            {
                FirstName = legacyProfile.FirstName,
                UseMetric = legacyProfile.UseMetric,
                GoalStart = legacyProfile.StartDate,
                GoalWeight = legacyProfile.GoalWeight,
                PlannedPoundsPerWeek = legacyProfile.PlannedPoundsPerWeek,
                DayStartOffset = legacyProfile.DayStartOffset,
                ShowCalories = false, // Default value
                SharingToken = legacyProfile.PrivateUrlKey, // Use existing sharing token
                SharingEnabled = true, // Always enabled in legacy app
                IsMigrated = true,
                IsNewlyMigrated = true
            },
            CreatedAt = DateTime.UtcNow.ToString("o"),
            UpdatedAt = DateTime.UtcNow.ToString("o")
        };

        // Save the profile
        profile = await _profileService.CreateAsync(profile);

        // Create provider links if legacy profile has OAuth tokens
        if (!string.IsNullOrEmpty(legacyProfile.FitbitRefreshToken) && !string.IsNullOrEmpty(legacyProfile.DeviceType))
        {
            var providerName = legacyProfile.DeviceType.ToLowerInvariant();

            // Create an expired token that will trigger refresh on first use
            var expiredToken = new Dictionary<string, object>
            {
                ["refresh_token"] = legacyProfile.FitbitRefreshToken,
                ["access_token"] = "",
                ["token_type"] = "Bearer",
                ["scope"] = "user.metrics",
                ["received_at"] = 0L, // Unix timestamp 0 (1970-01-01)
                ["expires_in"] = 3600 // 1 hour (already expired since received_at is 0)
            };

            await _providerLinkService.StoreProviderLinkAsync(userGuid, providerName, expiredToken);
            _logger.LogInformation("Migrated {Provider} OAuth token for user {UserId}", providerName, userId);
        }

        return profile;
    }
}
