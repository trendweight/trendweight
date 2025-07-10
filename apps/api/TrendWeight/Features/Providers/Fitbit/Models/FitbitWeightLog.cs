using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Fitbit.Models;

/// <summary>
/// Response model for Fitbit weight log API
/// </summary>
public class FitbitWeightLog
{
    /// <summary>
    /// List of weight log entries
    /// </summary>
    [JsonPropertyName("weight")]
    public List<FitbitWeightLogEntry> Weight { get; set; } = new();
}
