namespace TrendWeight.Features.Vendors.Models;

/// <summary>
/// OAuth access token data for vendor integrations
/// Corresponds to AccessToken in legacy TypeScript code
/// </summary>
public class AccessToken
{
    public string Userid { get; set; } = string.Empty;
    public string Access_Token { get; set; } = string.Empty;
    public string Refresh_Token { get; set; } = string.Empty;
    public string Token_Type { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
    public string? Expires_At { get; set; }
}