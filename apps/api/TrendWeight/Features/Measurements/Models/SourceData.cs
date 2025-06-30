namespace TrendWeight.Features.Measurements.Models;

/// <summary>
/// Data from a specific provider source (Withings or Fitbit)
/// Corresponds to SourceData in legacy TypeScript code
/// </summary>
public class SourceData
{
    /// <summary>
    /// Source provider: "withings" or "fitbit"
    /// </summary>
    public string Source { get; set; } = string.Empty;
    
    /// <summary>
    /// Last update timestamp from this source (UTC)
    /// </summary>
    public DateTime LastUpdate { get; set; }
    
    /// <summary>
    /// Array of measurements from this source
    /// </summary>
    public List<RawMeasurement>? Measurements { get; set; }
}