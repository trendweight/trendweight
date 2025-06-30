namespace TrendWeight.Features.Providers.Models;

/// <summary>
/// OAuth state object passed through the OAuth flow
/// </summary>
public class OAuthState
{
    /// <summary>
    /// User ID (Firebase UID)
    /// </summary>
    public string Uid { get; set; } = string.Empty;
    
    /// <summary>
    /// Reason for the OAuth flow (e.g., "link", "refresh")
    /// </summary>
    public string Reason { get; set; } = string.Empty;
}