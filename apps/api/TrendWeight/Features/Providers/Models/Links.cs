namespace TrendWeight.Features.Providers.Models;

/// <summary>
/// User's provider links
/// Corresponds to Links in legacy TypeScript code
/// </summary>
public class Links
{
    public string Uid { get; set; } = string.Empty;
    public ProviderLink? Withings { get; set; }
    public ProviderLink? Fitbit { get; set; }
}