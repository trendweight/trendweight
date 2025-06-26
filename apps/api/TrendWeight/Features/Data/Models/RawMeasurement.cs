namespace TrendWeight.Features.Data.Models;

/// <summary>
/// Represents a raw measurement from a device (Withings, Fitbit, etc.)
/// </summary>
public class RawMeasurement
{
    /// <summary>
    /// Unix timestamp of the measurement
    /// </summary>
    public long Timestamp { get; set; }
    
    /// <summary>
    /// Weight measurement in kg (metric) or lbs (imperial)
    /// </summary>
    public double Weight { get; set; }
    
    /// <summary>
    /// Fat ratio as a decimal (e.g., 0.25 for 25%)
    /// </summary>
    public double? FatRatio { get; set; }
}
