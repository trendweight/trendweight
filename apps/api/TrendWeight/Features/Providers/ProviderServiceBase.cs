using TrendWeight.Features.Measurements;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Providers.Models;
using TrendWeight.Features.Users.Services;
using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Providers;

/// <summary>
/// Base class for provider service implementations
/// </summary>
public abstract class ProviderServiceBase : IProviderService
{
    protected readonly IProviderLinkService _providerLinkService;
    protected readonly ISourceDataService _sourceDataService;
    protected readonly IUserService _userService;
    protected readonly ILogger _logger;

    protected ProviderServiceBase(
        IProviderLinkService providerLinkService,
        ISourceDataService sourceDataService,
        IUserService userService,
        ILogger logger)
    {
        _providerLinkService = providerLinkService;
        _sourceDataService = sourceDataService;
        _userService = userService;
        _logger = logger;
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
            // Get provider-specific access token
            var accessToken = await ExchangeCodeForTokenAsync(code, callbackUrl);

            // Store the token using ProviderLinkService
            await _providerLinkService.StoreProviderLinkAsync(userId, ProviderName, accessToken);

            _logger.LogDebug("Successfully stored {Provider} link for user {UserId}", ProviderName, userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to exchange authorization code for {Provider}", ProviderName);
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
                _logger.LogWarning("No active {Provider} link found for user {UserId}", ProviderName, userId);
                return null;
            }

            // Get measurements from provider
            var startTimestamp = startDate.HasValue ? ToUnixTimeSeconds(startDate.Value) : 1; // 1 = all time
            var measurements = await FetchMeasurementsAsync(providerLink.Token, metric, startTimestamp);

            return measurements;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get {Provider} measurements for user {UserId}", ProviderName, userId);
            return null;
        }
    }

    /// <inheritdoc />
    public async Task<bool> SyncMeasurementsAsync(Guid userId, bool metric)
    {
        try
        {
            // Get the last sync time to determine fetch window
            var lastSyncTime = await _sourceDataService.GetLastSyncTimeAsync(userId, ProviderName);

            // Calculate start date: 90 days before last sync, or all time if no previous sync
            DateTime startDate;
            if (lastSyncTime.HasValue)
            {
                // Fetch from 90 days before last sync to catch any late-arriving or edited measurements
                startDate = lastSyncTime.Value.AddDays(-90);
                _logger.LogDebug("Fetching {Provider} measurements from {StartDate} (90 days before last sync)",
                    ProviderName, startDate.ToString("o"));
            }
            else
            {
                // No previous sync - fetch all data
                startDate = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                _logger.LogDebug("No previous sync for {Provider}, fetching all measurements", ProviderName);
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
            await _sourceDataService.UpdateSourceDataAsync(userId, new List<SourceData> { sourceData });

            _logger.LogDebug("Successfully synced {Count} {Provider} measurements for user {UserId}",
                measurements.Count, ProviderName, userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to sync {Provider} measurements for user {UserId}", ProviderName, userId);
            return false;
        }
    }

    /// <inheritdoc />
    public async Task<bool> HasActiveProviderLinkAsync(Guid userId)
    {
        var providerLink = await _providerLinkService.GetProviderLinkAsync(userId, ProviderName);
        return providerLink != null;
    }

    /// <inheritdoc />
    public async Task<bool> RemoveProviderLinkAsync(Guid userId)
    {
        try
        {
            await _providerLinkService.RemoveProviderLinkAsync(userId, ProviderName);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to remove {Provider} link for user {UserId}", ProviderName, userId);
            return false;
        }
    }

    /// <summary>
    /// Gets the active provider link, automatically refreshing token if needed
    /// </summary>
    protected async Task<DbProviderLink?> GetActiveProviderLinkAsync(Guid userId)
    {
        var providerLink = await _providerLinkService.GetProviderLinkAsync(userId, ProviderName);
        if (providerLink == null)
        {
            return null;
        }

        // Check if token needs refresh
        if (IsTokenExpired(providerLink.Token))
        {
            _logger.LogDebug("Token expired for {Provider} user {UserId}, refreshing", ProviderName, userId);

            try
            {
                var refreshedToken = await RefreshTokenAsync(providerLink.Token);
                await _providerLinkService.StoreProviderLinkAsync(userId, ProviderName, refreshedToken);
                providerLink.Token = refreshedToken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to refresh token for {Provider} user {UserId}", ProviderName, userId);
                throw;
            }
        }

        return providerLink;
    }

    /// <summary>
    /// Checks if a token is expired
    /// </summary>
    protected bool IsTokenExpired(AccessToken token)
    {
        if (string.IsNullOrEmpty(token.Expires_At))
        {
            return true;
        }

        if (DateTimeOffset.TryParse(token.Expires_At, out var expiresAt))
        {
            // Consider token expired if it expires in less than 5 minutes
            return expiresAt <= DateTimeOffset.UtcNow.AddMinutes(5);
        }

        return true;
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
    protected abstract Task<AccessToken> ExchangeCodeForTokenAsync(string code, string callbackUrl);

    /// <summary>
    /// Refreshes an expired access token (provider-specific)
    /// </summary>
    protected abstract Task<AccessToken> RefreshTokenAsync(AccessToken token);

    /// <summary>
    /// Fetches measurements from the provider API (provider-specific)
    /// </summary>
    protected abstract Task<List<RawMeasurement>> FetchMeasurementsAsync(AccessToken token, bool metric, long startTimestamp);
}
