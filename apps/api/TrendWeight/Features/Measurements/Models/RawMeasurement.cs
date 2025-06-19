namespace TrendWeight.Features.Measurements.Models;

/// <summary>
/// Raw measurement data matching legacy RawMeasurement interface
/// Stored exactly as received from vendors
/// </summary>
public record RawMeasurement
{
    /// <summary>
    /// Unix timestamp in seconds (as provided by vendors)
    /// Will be converted to user's local date on client
    /// </summary>
    public long Timestamp { get; init; }
    
    /// <summary>
    /// Weight in kilograms (using decimal to avoid floating point issues)
    /// </summary>
    public decimal Weight { get; init; }
    
    /// <summary>
    /// Fat ratio as decimal (0.0 to 1.0) matching vendor format
    /// Legacy uses ratio, not percentage
    /// </summary>
    public decimal? FatRatio { get; init; }
}