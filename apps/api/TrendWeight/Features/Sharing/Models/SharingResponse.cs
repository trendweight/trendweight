namespace TrendWeight.Features.Sharing.Models;

/// <summary>
/// Response containing sharing settings and token
/// </summary>
public class SharingResponse
{
    public bool SharingEnabled { get; set; }
    public string? SharingToken { get; set; }
}

/// <summary>
/// Request to toggle sharing enabled state
/// </summary>
public class ToggleSharingRequest
{
    public bool Enabled { get; set; }
}
