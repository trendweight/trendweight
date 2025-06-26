using System.Threading.Tasks;
using TrendWeight.Features.Data.Models;
using TrendWeight.Features.Vendors.Models;

namespace TrendWeight.Features.Vendors.Withings;

/// <summary>
/// Interface for Withings API service
/// </summary>
public interface IWithingsService
{
    /// <summary>
    /// Gets the authorization URL for Withings OAuth flow
    /// </summary>
    /// <param name="state">State parameter for OAuth security</param>
    /// <param name="callbackUrl">Callback URL for OAuth redirect</param>
    /// <returns>The authorization URL</returns>
    string GetAuthorizationUrl(string state, string callbackUrl);
    
    /// <summary>
    /// Exchanges an authorization code for an access token
    /// </summary>
    /// <param name="code">Authorization code from OAuth redirect</param>
    /// <param name="callbackUrl">Callback URL used in the authorization request</param>
    /// <returns>Access token information</returns>
    Task<AccessToken> ExchangeAuthorizationCodeAsync(string code, string callbackUrl);
    
    /// <summary>
    /// Refreshes an access token
    /// </summary>
    /// <param name="token">The token to refresh</param>
    /// <returns>Updated access token information</returns>
    Task<AccessToken> RefreshTokenAsync(AccessToken token);
    
    /// <summary>
    /// Gets measurements from the Withings API
    /// </summary>
    /// <param name="token">Access token for authentication</param>
    /// <param name="metric">Whether to return measurements in metric units</param>
    /// <param name="start">Start timestamp for measurements</param>
    /// <param name="offset">Pagination offset</param>
    /// <returns>Measurement data and pagination information</returns>
    Task<(System.Collections.Generic.List<RawMeasurement> measurements, bool more, object? offset, string timezone)> 
        GetMeasurementsAsync(AccessToken token, bool metric, long start, object? offset = null);
}
