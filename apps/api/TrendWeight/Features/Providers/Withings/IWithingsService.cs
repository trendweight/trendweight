using System.Threading.Tasks;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.Providers.Withings;

/// <summary>
/// Interface for Withings API service
/// </summary>
public interface IWithingsService : IProviderService
{
    /// <summary>
    /// Exchanges an authorization code for an access token
    /// </summary>
    /// <param name="code">Authorization code from OAuth redirect</param>
    /// <param name="callbackUrl">Callback URL used in the authorization request</param>
    /// <returns>Access token information</returns>
    Task<AccessToken> ExchangeAuthorizationCodeAsync(string code, string callbackUrl);
    
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
