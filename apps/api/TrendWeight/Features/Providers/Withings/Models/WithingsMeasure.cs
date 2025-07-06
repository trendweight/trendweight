using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Withings.Models;

/// <summary>
/// Represents a single measure from the Withings API
/// </summary>
public class WithingsMeasure
{
    /// <summary>
    /// The value of the measurement (needs to be converted using the unit)
    /// </summary>
    [JsonPropertyName("value")]
    public int Value { get; set; }

    /// <summary>
    /// The type of measurement:
    /// 1 = Weight
    /// 6 = Fat Percentage
    /// </summary>
    [JsonPropertyName("type")]
    public int Type { get; set; }

    /// <summary>
    /// The unit of the measurement (power of 10 to convert value)
    /// </summary>
    [JsonPropertyName("unit")]
    public int Unit { get; set; }
}
