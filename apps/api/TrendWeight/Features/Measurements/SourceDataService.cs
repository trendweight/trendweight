using System.Text.Json;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Infrastructure.DataAccess;
using TrendWeight.Infrastructure.DataAccess.Models;
// Import database models directly
using FeatureSourceData = TrendWeight.Features.Measurements.Models.SourceData;

namespace TrendWeight.Features.Measurements;

/// <summary>
/// Service for managing source measurement data
/// Based on lib/data/source-data.ts in legacy code
/// </summary>
public class SourceDataService : ISourceDataService
{
    private readonly ISupabaseService _supabaseService;
    private readonly ILogger<SourceDataService> _logger;

    public SourceDataService(ISupabaseService supabaseService, ILogger<SourceDataService> logger)
    {
        _supabaseService = supabaseService;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task UpdateSourceDataAsync(string uid, List<FeatureSourceData> data)
    {
        try
        {
            // First, get the user to find their Supabase UID from Firebase UID
            var users = await _supabaseService.QueryAsync<DbUser>(q => q.Where(u => u.FirebaseUid == uid));
            var user = users.FirstOrDefault();
            
            if (user == null)
            {
                _logger.LogWarning("User not found for Firebase UID: {FirebaseUid}", uid);
                throw new InvalidOperationException($"User not found for Firebase UID: {uid}");
            }

            // Update each source data
            foreach (var sourceData in data)
            {
                // Check if source data already exists
                var existingData = await _supabaseService.QueryAsync<DbSourceData>(q => 
                    q.Where(sd => sd.Uid == user.Uid && sd.Provider == sourceData.Source));
                
                var dbSourceData = existingData.FirstOrDefault();
                
                if (dbSourceData == null)
                {
                    // Create new source data
                    dbSourceData = new DbSourceData
                    {
                        Uid = user.Uid,
                        Provider = sourceData.Source,
                        Measurements = JsonDocument.Parse(JsonSerializer.Serialize(sourceData.Measurements ?? new List<RawMeasurement>())),
                        LastSync = DateTime.Parse(sourceData.LastUpdate),
                        UpdatedAt = DateTime.UtcNow
                    };
                    
                    await _supabaseService.InsertAsync(dbSourceData);
                    _logger.LogInformation("Created new source data for user {Uid} provider {Provider}", user.Uid, sourceData.Source);
                }
                else
                {
                    // Update existing source data
                    dbSourceData.Measurements = JsonDocument.Parse(JsonSerializer.Serialize(sourceData.Measurements ?? new List<RawMeasurement>()));
                    dbSourceData.LastSync = DateTime.Parse(sourceData.LastUpdate);
                    dbSourceData.UpdatedAt = DateTime.UtcNow;
                    
                    await _supabaseService.UpdateAsync(dbSourceData);
                    _logger.LogInformation("Updated source data for user {Uid} provider {Provider}", user.Uid, sourceData.Source);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating source data for user {Uid}", uid);
            throw;
        }
    }

    /// <inheritdoc />
    public async Task<List<FeatureSourceData>?> GetSourceDataAsync(string uid)
    {
        try
        {
            // First, get the user to find their Supabase UID from Firebase UID
            var users = await _supabaseService.QueryAsync<DbUser>(q => q.Where(u => u.FirebaseUid == uid));
            var user = users.FirstOrDefault();
            
            if (user == null)
            {
                _logger.LogWarning("User not found for Firebase UID: {FirebaseUid}", uid);
                return null;
            }

            // Get all source data for the user
            var sourceDataList = await _supabaseService.QueryAsync<DbSourceData>(q => 
                q.Where(sd => sd.Uid == user.Uid));

            if (!sourceDataList.Any())
            {
                return new List<FeatureSourceData>();
            }

            // Convert to feature models
            var result = new List<FeatureSourceData>();
            foreach (var dbSourceData in sourceDataList)
            {
                var measurements = JsonSerializer.Deserialize<List<RawMeasurement>>(
                    dbSourceData.Measurements.RootElement.GetRawText());
                
                result.Add(new FeatureSourceData
                {
                    Source = dbSourceData.Provider,
                    LastUpdate = dbSourceData.LastSync?.ToString("o") ?? DateTime.UtcNow.ToString("o"),
                    Measurements = measurements
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting source data for user {Uid}", uid);
            throw;
        }
    }
}