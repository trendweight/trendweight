using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Withings.Models;

/// <summary>
/// Base response structure from Withings API
/// </summary>
public class WithingsResponse<T>
{
    /// <summary>
    /// Status code from the Withings API (0 = success)
    /// </summary>
    [JsonPropertyName("status")]
    public int Status { get; set; }
    
    /// <summary>
    /// Response body containing the actual data
    /// </summary>
    [JsonPropertyName("body")]
    public T? Body { get; set; }
    
    /// <summary>
    /// Error message if status is not 0
    /// </summary>
    [JsonPropertyName("error")]
    public string? Error { get; set; }
}
