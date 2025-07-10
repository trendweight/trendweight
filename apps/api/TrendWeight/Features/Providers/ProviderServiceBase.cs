using System.Text.Json;
using TrendWeight.Features.Measurements;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Providers;

/// <summary>
/// Base class for provider service implementations
/// </summary>
public abstract class ProviderServiceBase : IProviderService
{
    protected IProviderLinkService ProviderLinkService { get; }
    protected ISourceDataService SourceDataService { get; }
    protected IUserService UserService { get; }
    protected ILogger Logger { get; }

    protected ProviderServiceBase(
        IProviderLinkService providerLinkService,
        ISourceDataService sourceDataService,
        IUserService userService,
        ILogger logger)
    {
        ProviderLinkService = providerLinkService;
        SourceDataService = sourceDataService;
        UserService = userService;
        Logger = logger;
    }

    /// <inheritdoc />
    public abstract string ProviderName { get; }

    /// <inheritdoc />
    public abstract string GetAuthorizationUrl(string state, string callbackUrl);

    /// <inheritdoc />
    public async Task<bool> ExchangeAuthorizationCodeAsync(string code, string callbackUrl, Guid userId)
    {
        try
        {
            // Get provider-specific token as dictionary
            var token = await ExchangeCodeForTokenAsync(code, callbackUrl);

            // Store the token using ProviderLinkService
            await ProviderLinkService.StoreProviderLinkAsync(userId, ProviderName, token);

            Logger.LogDebug("Successfully stored {Provider} link for user {UserId}", ProviderName, userId);
            return true;
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Failed to exchange authorization code for {Provider}", ProviderName);
            return false;
        }
    }

    /// <inheritdoc />
    public async Task<List<RawMeasurement>?> GetMeasurementsAsync(Guid userId, bool metric, DateTime? startDate = null)
    {
        try
        {
            // Get provider link with automatic token refresh
            var providerLink = await GetActiveProviderLinkAsync(userId);
            if (providerLink == null)
            {
                Logger.LogWarning("No active {Provider} link found for user {UserId}", ProviderName, userId);
                return null;
            }

            // Get measurements from provider
            var startTimestamp = startDate.HasValue ? ToUnixTimeSeconds(startDate.Value) : 1; // 1 = all time
            var measurements = await FetchMeasurementsAsync(providerLink.Token, metric, startTimestamp);

            return measurements;
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Failed to get {Provider} measurements for user {UserId}", ProviderName, userId);
            return null;
        }
    }

    /// <inheritdoc />
    public async Task<bool> SyncMeasurementsAsync(Guid userId, bool metric)
    {
        try
        {
            // Get the last sync time to determine fetch window
            var lastSyncTime = await SourceDataService.GetLastSyncTimeAsync(userId, ProviderName);

            // Calculate start date: 90 days before last sync, or all time if no previous sync
            DateTime startDate;
            if (lastSyncTime.HasValue)
            {
                // Fetch from 90 days before last sync to catch any late-arriving or edited measurements
                startDate = lastSyncTime.Value.AddDays(-90);
                Logger.LogDebug("Fetching {Provider} measurements from {StartDate} (90 days before last sync)",
                    ProviderName, startDate.ToString("o"));
            }
            else
            {
                // No previous sync - fetch all data
                startDate = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                Logger.LogDebug("No previous sync for {Provider}, fetching all measurements", ProviderName);
            }

            // Get measurements from the provider
            var measurements = await GetMeasurementsAsync(userId, metric, startDate);
            if (measurements == null)
            {
                return false;
            }

            // Update source data
            var sourceData = new SourceData
            {
                Source = ProviderName,
                LastUpdate = DateTime.UtcNow,
                Measurements = measurements
            };

            // Store in database (UpdateSourceDataAsync will handle merging)
            await SourceDataService.UpdateSourceDataAsync(userId, new List<SourceData> { sourceData });

            Logger.LogDebug("Successfully synced {Count} {Provider} measurements for user {UserId}",
                measurements.Count, ProviderName, userId);
            return true;
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Failed to sync {Provider} measurements for user {UserId}", ProviderName, userId);
            return false;
        }
    }

    /// <inheritdoc />
    public async Task<bool> HasActiveProviderLinkAsync(Guid userId)
    {
        var providerLink = await ProviderLinkService.GetProviderLinkAsync(userId, ProviderName);
        return providerLink != null;
    }

    /// <inheritdoc />
    public async Task<bool> RemoveProviderLinkAsync(Guid userId)
    {
        try
        {
            // Remove the provider link
            await ProviderLinkService.RemoveProviderLinkAsync(userId, ProviderName);

            // Also delete the source data row for this provider
            await SourceDataService.DeleteSourceDataAsync(userId, ProviderName);

            Logger.LogInformation("Removed {Provider} link and deleted source data for user {UserId}", ProviderName, userId);
            return true;
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Failed to remove {Provider} link for user {UserId}", ProviderName, userId);
            return false;
        }
    }

    /// <summary>
    /// Gets the active provider link, automatically refreshing token if needed
    /// </summary>
    protected async Task<DbProviderLink?> GetActiveProviderLinkAsync(Guid userId)
    {
        var providerLink = await ProviderLinkService.GetProviderLinkAsync(userId, ProviderName);
        if (providerLink == null)
        {
            return null;
        }

        // Check if token needs refresh (provider-specific logic)
        if (IsTokenExpired(providerLink.Token))
        {
            Logger.LogDebug("Token expired for {Provider} user {UserId}, attempting refresh", ProviderName, userId);

            try
            {
                var refreshedToken = await RefreshTokenAsync(providerLink.Token);
                await ProviderLinkService.StoreProviderLinkAsync(userId, ProviderName, refreshedToken);
                // Update the local copy with the new token
                providerLink.Token = refreshedToken;
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("null or undefined"))
            {
                Logger.LogWarning("Token for {Provider} user {UserId} is invalid and cannot be refreshed. User needs to re-link account.", ProviderName, userId);
                // Return null to indicate no valid provider link
                return null;
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Failed to refresh token for {Provider} user {UserId}", ProviderName, userId);
                throw;
            }
        }

        return providerLink;
    }

    /// <summary>
    /// Extension point to convert Unix timestamp to DateTime
    /// </summary>
    protected static long ToUnixTimeSeconds(DateTime dateTime)
    {
        return ((DateTimeOffset)dateTime).ToUnixTimeSeconds();
    }


    // Abstract methods that provider-specific implementations must provide

    /// <summary>
    /// Exchanges authorization code for access token (provider-specific)
    /// </summary>
    protected abstract Task<Dictionary<string, object>> ExchangeCodeForTokenAsync(string code, string callbackUrl);

    /// <summary>
    /// Checks if a token is expired (provider-specific)
    /// </summary>
    protected abstract bool IsTokenExpired(Dictionary<string, object> token);

    /// <summary>
    /// Refreshes an expired access token (provider-specific)
    /// </summary>
    protected abstract Task<Dictionary<string, object>> RefreshTokenAsync(Dictionary<string, object> token);

    /// <summary>
    /// Fetches measurements from the provider API (provider-specific)
    /// </summary>
    protected abstract Task<List<RawMeasurement>> FetchMeasurementsAsync(Dictionary<string, object> token, bool metric, long startTimestamp);
}
