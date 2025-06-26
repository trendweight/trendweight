using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace TrendWeight.Features.Vendors.Withings.Models;

/// <summary>
/// Response body for the Withings getMeasures API call
/// </summary>
public class WithingsGetMeasuresResponse
{
    /// <summary>
    /// Update time from the Withings API
    /// </summary>
    [JsonPropertyName("updatetime")]
    public string UpdateTime { get; set; } = string.Empty;
    
    /// <summary>
    /// Timezone information from the Withings API
    /// </summary>
    [JsonPropertyName("timezone")]
    public string Timezone { get; set; } = string.Empty;
    
    /// <summary>
    /// Collection of measurement groups
    /// </summary>
    [JsonPropertyName("measuregrps")]
    public List<WithingsMeasureGroup> MeasureGroups { get; set; } = new();
    
    /// <summary>
    /// Indicates if there are more measurements to fetch (pagination)
    /// </summary>
    [JsonPropertyName("more")]
    public int More { get; set; }
    
    /// <summary>
    /// Offset for pagination
    /// </summary>
    [JsonPropertyName("offset")]
    public int? Offset { get; set; }
}
