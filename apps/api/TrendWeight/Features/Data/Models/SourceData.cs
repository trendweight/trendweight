using System.Collections.Generic;

namespace TrendWeight.Features.Data.Models;

/// <summary>
/// Represents data from a specific source (Withings, Fitbit, etc.)
/// </summary>
public class SourceData
{
    /// <summary>
    /// The data source (e.g., "withings", "fitbit")
    /// </summary>
    public string Source { get; set; } = null!;
    
    /// <summary>
    /// ISO string timestamp of the last update
    /// </summary>
    public string LastUpdate { get; set; } = null!;
    
    /// <summary>
    /// Collection of measurements from this source
    /// </summary>
    public List<RawMeasurement>? Measurements { get; set; }
}
