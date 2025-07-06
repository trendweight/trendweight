namespace TrendWeight.Features.Users.Models;

/// <summary>
/// User profile data needed for dashboard rendering.
/// This is a subset of SettingsData that excludes sensitive information like email and uid.
/// Used for the profile endpoint and future dashboard sharing features.
/// </summary>
public class ProfileData
{
    public string FirstName { get; set; } = string.Empty;
    public string Timezone { get; set; } = "America/New_York";
    public string? GoalStart { get; set; }
    public double? GoalWeight { get; set; }
    public double? PlannedPoundsPerWeek { get; set; }
    public int? DayStartOffset { get; set; }
    public bool UseMetric { get; set; }
    public bool? ShowCalories { get; set; }
    public string? SharingToken { get; set; }
}
