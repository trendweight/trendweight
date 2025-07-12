using TrendWeight.Infrastructure.DataAccess;
using TrendWeight.Infrastructure.DataAccess.Models;
using TrendWeight.Features.Profile.Models;

namespace TrendWeight.Features.Profile.Services;

public class ProfileService : IProfileService
{
    private readonly ISupabaseService _supabaseService;
    private readonly ILogger<ProfileService> _logger;

    public ProfileService(ISupabaseService supabaseService, ILogger<ProfileService> logger)
    {
        _supabaseService = supabaseService;
        _logger = logger;
    }


    public async Task<DbProfile?> GetByIdAsync(Guid id)
    {
        return await _supabaseService.GetByIdAsync<DbProfile>(id);
    }

    public async Task<DbProfile?> GetByIdAsync(string id)
    {
        // Parse as GUID (Supabase UIDs are UUIDs)
        if (Guid.TryParse(id, out var guid))
        {
            return await GetByIdAsync(guid);
        }

        _logger.LogWarning("Invalid user ID format: {Id}", id);
        return null;
    }


    public async Task<DbProfile> CreateAsync(DbProfile profile)
    {
        return await _supabaseService.InsertAsync(profile);
    }

    public async Task<DbProfile> UpdateAsync(DbProfile profile)
    {
        return await _supabaseService.UpdateAsync(profile);
    }

    public async Task<DbProfile> UpdateOrCreateProfileAsync(string userId, string email, UpdateProfileRequest request)
    {
        // Try to get existing profile by ID
        var profile = await GetByIdAsync(userId);

        if (profile == null)
        {
            _logger.LogInformation("Creating new profile for user {UserId}", userId);

            // Create new profile with only provided values
            var userGuid = Guid.Parse(userId);
            profile = new DbProfile
            {
                Uid = userGuid,
                Email = email,
                Profile = new ProfileData
                {
                    FirstName = request.FirstName ?? "",
                    Timezone = request.Timezone ?? "America/New_York",
                    UseMetric = request.UseMetric ?? false,
                    GoalStart = request.GoalStart,
                    GoalWeight = request.GoalWeight,
                    PlannedPoundsPerWeek = request.PlannedPoundsPerWeek,
                    DayStartOffset = request.DayStartOffset,
                    ShowCalories = request.ShowCalories,
                    SharingToken = Guid.NewGuid().ToString()
                },
                CreatedAt = DateTime.UtcNow.ToString("o"),
                UpdatedAt = DateTime.UtcNow.ToString("o")
            };

            _logger.LogInformation("Creating profile with UID: {Uid}, Email: {Email}", profile.Uid, profile.Email);
            profile = await CreateAsync(profile);
        }
        else
        {
            _logger.LogInformation("Updating existing profile for user {UserId}", userId);

            // Update only the fields that were provided
            if (request.FirstName != null)
                profile.Profile.FirstName = request.FirstName;
            if (request.Timezone != null)
                profile.Profile.Timezone = request.Timezone;
            if (request.GoalStart.HasValue)
                profile.Profile.GoalStart = request.GoalStart.Value;
            if (request.GoalWeight.HasValue)
                profile.Profile.GoalWeight = request.GoalWeight.Value;
            if (request.PlannedPoundsPerWeek.HasValue)
                profile.Profile.PlannedPoundsPerWeek = request.PlannedPoundsPerWeek.Value;
            if (request.DayStartOffset.HasValue)
                profile.Profile.DayStartOffset = request.DayStartOffset.Value;
            if (request.UseMetric.HasValue)
                profile.Profile.UseMetric = request.UseMetric.Value;
            if (request.ShowCalories.HasValue)
                profile.Profile.ShowCalories = request.ShowCalories.Value;

            // Update timestamp
            profile.UpdatedAt = DateTime.UtcNow.ToString("o");

            profile = await UpdateAsync(profile);
        }

        return profile;
    }
}
