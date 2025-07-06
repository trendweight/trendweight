using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Withings.Models;

/// <summary>
/// Response model for Withings token endpoints
/// </summary>
public class WithingsTokenResponse
{
    /// <summary>
    /// User ID from Withings
    /// </summary>
    [JsonPropertyName("userid")]
    public object? Userid { get; set; }

    /// <summary>
    /// Access token for API calls
    /// </summary>
    [JsonPropertyName("access_token")]
    public string? AccessToken { get; set; }

    /// <summary>
    /// Refresh token for getting new access tokens
    /// </summary>
    [JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; set; }

    /// <summary>
    /// Token type (usually "Bearer")
    /// </summary>
    [JsonPropertyName("token_type")]
    public string? TokenType { get; set; }

    /// <summary>
    /// Scope of the token
    /// </summary>
    [JsonPropertyName("scope")]
    public string? Scope { get; set; }

    /// <summary>
    /// Number of seconds until the token expires
    /// </summary>
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}
