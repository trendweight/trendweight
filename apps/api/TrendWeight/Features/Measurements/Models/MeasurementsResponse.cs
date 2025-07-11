using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.Measurements.Models;

/// <summary>
/// Response model for the measurements endpoint that includes provider sync status
/// </summary>
public class MeasurementsResponse
{
    /// <summary>
    /// The measurement data from all sources
    /// </summary>
    public required List<SourceData> Data { get; init; }

    /// <summary>
    /// Status of provider sync operations
    /// </summary>
    public required Dictionary<string, ProviderSyncStatus> ProviderStatus { get; init; }
}

/// <summary>
/// Status information for a provider sync operation
/// </summary>
public class ProviderSyncStatus
{
    /// <summary>
    /// Whether the sync was successful
    /// </summary>
    public required bool Success { get; init; }

    /// <summary>
    /// Error type if sync failed
    /// </summary>
    public string? Error { get; init; }

    /// <summary>
    /// Human-readable error message
    /// </summary>
    public string? Message { get; init; }
}

