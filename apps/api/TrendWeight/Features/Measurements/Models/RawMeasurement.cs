namespace TrendWeight.Features.Measurements.Models;

/// <summary>
/// Raw measurement data stored with local date/time to avoid timezone complexity
/// </summary>
public record RawMeasurement
{
    /// <summary>
    /// Date in user's local timezone (yyyy-MM-dd format)
    /// </summary>
    public string Date { get; init; } = string.Empty;

    /// <summary>
    /// Time in user's local timezone (HH:mm:ss format)
    /// </summary>
    public string Time { get; init; } = string.Empty;

    /// <summary>
    /// Weight in kilograms (using decimal to avoid floating point issues)
    /// </summary>
    public decimal Weight { get; init; }

    /// <summary>
    /// Fat ratio as decimal (0.0 to 1.0) matching provider format
    /// Legacy uses ratio, not percentage
    /// </summary>
    public decimal? FatRatio { get; init; }
}
