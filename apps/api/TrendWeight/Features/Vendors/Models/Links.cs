namespace TrendWeight.Features.Vendors.Models;

/// <summary>
/// User's vendor links
/// Corresponds to Links in legacy TypeScript code
/// </summary>
public class Links
{
    public string Uid { get; set; } = string.Empty;
    public VendorLink? Withings { get; set; }
    public VendorLink? Fitbit { get; set; }
}