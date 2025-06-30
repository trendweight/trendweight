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
    /// ISO 8601 timestamp of last update from this source
    /// </summary>
    public string LastUpdate { get; set; } = string.Empty;
    
    /// <summary>
    /// Array of measurements from this source
    /// </summary>
    public List<RawMeasurement>? Measurements { get; set; }
}