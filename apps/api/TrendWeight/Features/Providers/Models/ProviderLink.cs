namespace TrendWeight.Features.Providers.Models;

/// <summary>
/// Provider link information including tokens and status
/// Corresponds to VendorLink in legacy TypeScript code
/// </summary>
public class ProviderLink
{
    public AccessToken Token { get; set; } = new();
    public string UpdateReason { get; set; } = string.Empty;
    public string UpdateTime { get; set; } = string.Empty;
}