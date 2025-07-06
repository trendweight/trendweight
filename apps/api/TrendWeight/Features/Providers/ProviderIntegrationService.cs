using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.Users.Services;

namespace TrendWeight.Features.Providers;

/// <summary>
/// Service that orchestrates provider integrations
/// </summary>
public interface IProviderIntegrationService
{
    /// <summary>
    /// Gets a specific provider service by name
    /// </summary>
    IProviderService? GetProviderService(string providerName);

    /// <summary>
    /// Gets all available provider services
    /// </summary>
    IEnumerable<IProviderService> GetAllProviderServices();

    /// <summary>
    /// Syncs measurements from all active providers for a user
    /// </summary>
    Task<Dictionary<string, bool>> SyncAllProvidersAsync(Guid userId, bool metric);

    /// <summary>
    /// Gets all active provider names for a user
    /// </summary>
    Task<List<string>> GetActiveProvidersAsync(Guid userId);
}

/// <summary>
/// Implementation of provider integration orchestrator
/// </summary>
public class ProviderIntegrationService : IProviderIntegrationService
{
    private readonly Dictionary<string, IProviderService> _providerServices;
    private readonly ILogger<ProviderIntegrationService> _logger;

    public ProviderIntegrationService(
        IEnumerable<IProviderService> providerServices,
        ILogger<ProviderIntegrationService> logger)
    {
        _providerServices = providerServices.ToDictionary(
            v => v.ProviderName.ToLowerInvariant(),
            v => v);
        _logger = logger;
    }

    /// <inheritdoc />
    public IProviderService? GetProviderService(string providerName)
    {
        return _providerServices.TryGetValue(providerName.ToLowerInvariant(), out var service)
            ? service
            : null;
    }

    /// <inheritdoc />
    public IEnumerable<IProviderService> GetAllProviderServices()
    {
        return _providerServices.Values;
    }

    /// <inheritdoc />
    public async Task<Dictionary<string, bool>> SyncAllProvidersAsync(Guid userId, bool metric)
    {
        var results = new Dictionary<string, bool>();

        foreach (var (providerName, providerService) in _providerServices)
        {
            try
            {
                // Check if user has an active link for this provider
                if (await providerService.HasActiveProviderLinkAsync(userId))
                {
                    _logger.LogInformation("Syncing {Provider} measurements for user {UserId}",
                        providerName, userId);

                    var success = await providerService.SyncMeasurementsAsync(userId, metric);
                    results[providerName] = success;

                    if (success)
                    {
                        _logger.LogInformation("Successfully synced {Provider} measurements for user {UserId}",
                            providerName, userId);
                    }
                    else
                    {
                        _logger.LogWarning("Failed to sync {Provider} measurements for user {UserId}",
                            providerName, userId);
                    }
                }
                else
                {
                    _logger.LogDebug("User {UserId} has no active {Provider} link, skipping sync",
                        userId, providerName);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error syncing {Provider} measurements for user {UserId}",
                    providerName, userId);
                results[providerName] = false;
            }
        }

        return results;
    }

    /// <inheritdoc />
    public async Task<List<string>> GetActiveProvidersAsync(Guid userId)
    {
        var activeProviders = new List<string>();

        foreach (var (providerName, providerService) in _providerServices)
        {
            if (await providerService.HasActiveProviderLinkAsync(userId))
            {
                activeProviders.Add(providerName);
            }
        }

        return activeProviders;
    }
}
