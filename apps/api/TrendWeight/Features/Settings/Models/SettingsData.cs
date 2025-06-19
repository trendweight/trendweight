using TrendWeight.Features.Profile.Models;

namespace TrendWeight.Features.Settings.Models;

/// <summary>
/// User settings data (extends ProfileData with auth info)
/// Corresponds to SettingsData in legacy TypeScript code
/// </summary>
public class SettingsData : ProfileData
{
    public string Uid { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}