using System.Text.Json.Serialization;

namespace TrendWeight.Features.Vendors.Models;

/// <summary>
/// OAuth access token data for vendor integrations
/// Corresponds to AccessToken in legacy TypeScript code
/// </summary>
public class AccessToken
{
    // Withings API returns userid as a number, but we store it as a string for consistency
    [JsonPropertyName("userid")]
    public string Userid { get; set; } = string.Empty;
    
    [JsonPropertyName("access_token")]
    public string Access_Token { get; set; } = string.Empty;
    
    [JsonPropertyName("refresh_token")]
    public string Refresh_Token { get; set; } = string.Empty;
    
    [JsonPropertyName("token_type")]
    public string Token_Type { get; set; } = string.Empty;
    
    [JsonPropertyName("scope")]
    public string Scope { get; set; } = string.Empty;
    
    [JsonPropertyName("expires_at")]
    public string? Expires_At { get; set; }
}