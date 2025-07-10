using System.Text.Json.Serialization;

namespace TrendWeight.Features.Providers.Fitbit.Models;

/// <summary>
/// Error response from Fitbit API
/// </summary>
public class FitbitApiError
{
    /// <summary>
    /// List of errors
    /// </summary>
    [JsonPropertyName("errors")]
    public List<FitbitError> Errors { get; set; } = new();

    /// <summary>
    /// Success flag (false for errors)
    /// </summary>
    [JsonPropertyName("success")]
    public bool Success { get; set; }
}

/// <summary>
/// Individual error details
/// </summary>
public class FitbitError
{
    /// <summary>
    /// Error type
    /// </summary>
    [JsonPropertyName("errorType")]
    public string ErrorType { get; set; } = string.Empty;

    /// <summary>
    /// Error message
    /// </summary>
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}
