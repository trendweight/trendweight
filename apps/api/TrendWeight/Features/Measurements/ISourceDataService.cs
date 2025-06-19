using TrendWeight.Features.Measurements.Models;

namespace TrendWeight.Features.Measurements;

/// <summary>
/// Service for managing source measurement data
/// Based on lib/data/source-data.ts in legacy code
/// </summary>
public interface ISourceDataService
{
    /// <summary>
    /// Updates source data for a user
    /// </summary>
    Task UpdateSourceDataAsync(string uid, List<SourceData> data);
    
    /// <summary>
    /// Gets all source data for a user
    /// </summary>
    Task<List<SourceData>?> GetSourceDataAsync(string uid);
}