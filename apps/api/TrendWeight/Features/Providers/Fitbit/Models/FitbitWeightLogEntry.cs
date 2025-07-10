using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Fitbit.Models;

/// <summary>
/// Individual weight log entry from Fitbit
/// </summary>
public class FitbitWeightLogEntry
{
    /// <summary>
    /// BMI value (not used by TrendWeight)
    /// </summary>
    [JsonPropertyName("bmi")]
    public decimal Bmi { get; set; }

    /// <summary>
    /// Date of the measurement (YYYY-MM-DD format)
    /// </summary>
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;

    /// <summary>
    /// Unique log ID for this measurement
    /// Divide by 1000 to get GroupId for daily grouping
    /// </summary>
    [JsonPropertyName("logId")]
    public long LogId { get; set; }

    /// <summary>
    /// Time of the measurement (HH:mm:ss format)
    /// </summary>
    [JsonPropertyName("time")]
    public string Time { get; set; } = string.Empty;

    /// <summary>
    /// Weight value (in pounds when using en_US locale)
    /// </summary>
    [JsonPropertyName("weight")]
    public decimal Weight { get; set; }

    /// <summary>
    /// Body fat percentage (optional, only if recorded)
    /// </summary>
    [JsonPropertyName("fat")]
    public decimal? Fat { get; set; }
}
