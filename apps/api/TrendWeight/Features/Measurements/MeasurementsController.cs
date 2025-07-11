using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.Providers;
using TrendWeight.Features.Providers.Models;
using TrendWeight.Features.Measurements.Models;

namespace TrendWeight.Features.Measurements;

/// <summary>
/// Controller for fetching measurement data
/// Based on legacy pages/api/data/index.ts
/// </summary>
[ApiController]
[Route("api/data")]
[Authorize]
public class MeasurementsController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IProviderIntegrationService _providerIntegrationService;
    private readonly ISourceDataService _sourceDataService;
    private readonly ILogger<MeasurementsController> _logger;

    // Data is considered fresh for 5 minutes (matching legacy behavior)
    private const int CACHE_DURATION_SECONDS = 300;

    public MeasurementsController(
        IUserService userService,
        IProviderIntegrationService providerIntegrationService,
        ISourceDataService sourceDataService,
        ILogger<MeasurementsController> logger)
    {
        _userService = userService;
        _providerIntegrationService = providerIntegrationService;
        _sourceDataService = sourceDataService;
        _logger = logger;
    }

    /// <summary>
    /// Gets measurement data, refreshing from providers if needed
    /// Matches legacy /api/data endpoint behavior
    /// </summary>
    /// <returns>MeasurementsResponse with data and provider status</returns>
    [HttpGet]
    public async Task<IActionResult> GetMeasurements()
    {
        try
        {
            // Get Supabase UID from JWT
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { error = "User ID not found in token" });
            }

            _logger.LogInformation("Getting measurements for user ID: {UserId}", userId);

            // Get user by Supabase UID
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Get active providers
            var activeProviders = await _providerIntegrationService.GetActiveProvidersAsync(user.Uid);

            // Track provider sync status
            var providerStatus = new Dictionary<string, ProviderSyncStatus>();

            // For each active provider, check if refresh is needed
            var refreshTasks = new List<Task<ProviderSyncResult>>();
            var now = DateTime.UtcNow;

            // Check each provider's last sync time directly from the database
            foreach (var provider in activeProviders)
            {
                // Check last sync time for this provider
                var lastSync = await _sourceDataService.GetLastSyncTimeAsync(user.Uid, provider);
                var needsRefresh = lastSync == null || (now - lastSync.Value).TotalSeconds > CACHE_DURATION_SECONDS;

                if (lastSync != null)
                {
                    _logger.LogInformation("Provider {Provider} - Now: {Now}, LastSync: {LastSync}, Age: {Age}s, CacheDuration: {CacheDuration}s",
                        provider, now.ToString("o"), lastSync.Value.ToString("o"), (now - lastSync.Value).TotalSeconds, CACHE_DURATION_SECONDS);
                }

                if (needsRefresh)
                {
                    _logger.LogInformation("Provider {Provider} needs refresh (last sync: {LastSync})",
                        provider, lastSync?.ToString("o") ?? "never");

                    // Add refresh task
                    refreshTasks.Add(RefreshProviderAsync(user.Uid, provider, user.Profile.UseMetric));
                }
                else
                {
                    _logger.LogInformation("Provider {Provider} data is fresh (last sync: {LastSync})",
                        provider, lastSync!.Value.ToString("o"));

                    // Mark provider as successful since we have fresh data
                    providerStatus[provider] = new ProviderSyncStatus
                    {
                        Success = true
                    };
                }
            }

            // Wait for all refresh tasks to complete
            if (refreshTasks.Count > 0)
            {
                var refreshResults = await Task.WhenAll(refreshTasks);
                foreach (var result in refreshResults)
                {
                    providerStatus[result.Provider] = new ProviderSyncStatus
                    {
                        Success = result.Success,
                        Error = result.Error?.ToString().ToLowerInvariant(),
                        Message = result.Message
                    };

                    if (!result.Success)
                    {
                        _logger.LogWarning("Failed to refresh data for provider {Provider}: {Error}",
                            result.Provider, result.Message);
                    }
                }
            }

            // Get the current data (whether refreshed or cached)
            var currentData = await _sourceDataService.GetSourceDataAsync(user.Uid) ?? new List<SourceData>();

            // Return the enhanced response
            var response = new MeasurementsResponse
            {
                Data = currentData,
                ProviderStatus = providerStatus
            };

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting measurements");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    private async Task<ProviderSyncResult> RefreshProviderAsync(Guid userId, string provider, bool useMetric)
    {
        try
        {
            var providerService = _providerIntegrationService.GetProviderService(provider);
            if (providerService == null)
            {
                return new ProviderSyncResult
                {
                    Provider = provider,
                    Success = false,
                    Error = ProviderSyncError.Unknown,
                    Message = $"Provider service not found for {provider}"
                };
            }

            var result = await providerService.SyncMeasurementsAsync(userId, useMetric);
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing {Provider} data", provider);
            return new ProviderSyncResult
            {
                Provider = provider,
                Success = false,
                Error = ProviderSyncError.Unknown,
                Message = $"Unexpected error refreshing {provider} data"
            };
        }
    }
}
