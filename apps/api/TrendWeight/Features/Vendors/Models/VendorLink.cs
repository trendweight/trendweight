namespace TrendWeight.Features.Vendors.Models;

/// <summary>
/// Vendor link information including tokens and status
/// Corresponds to VendorLink in legacy TypeScript code
/// </summary>
public class VendorLink
{
    public AccessToken Token { get; set; } = new();
    public string UpdateReason { get; set; } = string.Empty;
    public string UpdateTime { get; set; } = string.Empty;
}