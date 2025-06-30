using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Withings.Models;

/// <summary>
/// Represents a group of measurements from the Withings API
/// </summary>
public class WithingsMeasureGroup
{
    /// <summary>
    /// Group ID
    /// </summary>
    [JsonPropertyName("grpid")]
    public long GroupId { get; set; }
    
    /// <summary>
    /// Attribute (not used in our implementation)
    /// </summary>
    [JsonPropertyName("attrib")]
    public int Attribute { get; set; }
    
    /// <summary>
    /// Date of the measurement as a Unix timestamp
    /// </summary>
    [JsonPropertyName("date")]
    public long Date { get; set; }
    
    /// <summary>
    /// Created timestamp
    /// </summary>
    [JsonPropertyName("created")]
    public long Created { get; set; }
    
    /// <summary>
    /// Category of the measurement (1 = weight measurements)
    /// </summary>
    [JsonPropertyName("category")]
    public int Category { get; set; }
    
    /// <summary>
    /// Device ID that took the measurement
    /// </summary>
    [JsonPropertyName("deviceid")]
    public string DeviceId { get; set; } = string.Empty;
    
    /// <summary>
    /// Collection of measures in this group
    /// </summary>
    [JsonPropertyName("measures")]
    public List<WithingsMeasure> Measures { get; set; } = new();
}
