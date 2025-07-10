using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Fitbit.Models;

/// <summary>
/// Response model for Fitbit token endpoints
/// </summary>
public class FitbitTokenResponse
{
    /// <summary>
    /// Access token for API calls
    /// </summary>
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;

    /// <summary>
    /// Refresh token for getting new access tokens
    /// </summary>
    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; } = string.Empty;

    /// <summary>
    /// Token type (usually "Bearer")
    /// </summary>
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;

    /// <summary>
    /// Number of seconds until the token expires (28800 = 8 hours)
    /// </summary>
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    /// <summary>
    /// Scope of the token
    /// </summary>
    [JsonPropertyName("scope")]
    public string Scope { get; set; } = string.Empty;

    /// <summary>
    /// Fitbit user ID
    /// </summary>
    [JsonPropertyName("user_id")]
    public string UserId { get; set; } = string.Empty;
}
