using System.Text.Json;
using System.Web;
using TrendWeight.Features.Measurements;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Providers.Exceptions;
using TrendWeight.Features.Providers.Withings.Models;

namespace TrendWeight.Features.Providers.Withings;

/// <summary>
/// Service for interacting with the Withings API
/// </summary>
public class WithingsService : ProviderServiceBase, IWithingsService
{
    private readonly HttpClient _httpClient;
    private readonly WithingsConfig _config;

    /// <summary>
    /// Constructor
    /// </summary>
    public WithingsService(
        HttpClient httpClient,
        WithingsConfig config,
        IProviderLinkService providerLinkService,
        ISourceDataService sourceDataService,
        IUserService userService,
        ILogger<WithingsService> logger)
        : base(providerLinkService, sourceDataService, userService, logger)
    {
        _httpClient = httpClient;
        _config = config;
    }

    /// <inheritdoc />
    public override string ProviderName => "withings";

    /// <inheritdoc />
    public override string GetAuthorizationUrl(string state, string callbackUrl)
    {
        var url = new UriBuilder("https://account.withings.com/oauth2_user/authorize2");
        var query = HttpUtility.ParseQueryString(string.Empty);
        query["client_id"] = _config.ClientId;
        query["response_type"] = "code";
        query["scope"] = "user.metrics";
        query["state"] = state;
        query["redirect_uri"] = callbackUrl;
        url.Query = query.ToString();

        return url.ToString();
    }

    /// <inheritdoc />
    protected override async Task<Dictionary<string, object>> ExchangeCodeForTokenAsync(string code, string callbackUrl)
    {
        var parameters = new Dictionary<string, string>
        {
            ["action"] = "requesttoken",
            ["grant_type"] = "authorization_code",
            ["client_id"] = _config.ClientId,
            ["client_secret"] = _config.ClientSecret,
            ["code"] = code,
            ["redirect_uri"] = callbackUrl
        };

        var content = new FormUrlEncodedContent(parameters);
        var response = await _httpClient.PostAsync("https://wbsapi.withings.net/v2/oauth2", content);

        if (!response.IsSuccessStatusCode)
        {
            Logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}",
                response.StatusCode, response.ReasonPhrase);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        Logger.LogDebug("Withings authorization code exchange completed. Response: {Response}", responseContent);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false
        };

        WithingsResponse<WithingsTokenResponse>? withingsResponse;
        try
        {
            withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsTokenResponse>>(responseContent, options);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Failed to deserialize Withings response: {Response}", responseContent);
            throw;
        }

        if (withingsResponse?.Status != 0)
        {
            Logger.LogError("Withings API error: {Status} {Error}",
                withingsResponse?.Status, withingsResponse?.Error);

            // Check for auth-related errors
            // Withings uses status 401 for invalid token
            if (withingsResponse?.Status == 401 ||
                withingsResponse?.Error?.Contains("invalid_token", StringComparison.OrdinalIgnoreCase) == true ||
                withingsResponse?.Error?.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) == true)
            {
                throw new ProviderAuthException(
                    "withings",
                    $"Withings authentication failed: {withingsResponse.Error}",
                    withingsResponse.Status.ToString());
            }

            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }

        var tokenData = withingsResponse!.Body!;

        // Create token dictionary
        return new Dictionary<string, object>
        {
            ["userid"] = tokenData.Userid,
            ["access_token"] = tokenData.AccessToken ?? string.Empty,
            ["refresh_token"] = tokenData.RefreshToken ?? string.Empty,
            ["token_type"] = tokenData.TokenType ?? string.Empty,
            ["scope"] = tokenData.Scope ?? string.Empty,
            ["expires_at"] = DateTimeOffset.UtcNow.AddSeconds(tokenData.ExpiresIn).ToString("o"),
            ["expires_in"] = tokenData.ExpiresIn
        };
    }

    /// <inheritdoc />
    protected override bool IsTokenExpired(Dictionary<string, object> token)
    {
        // Check if token has expiration
        if (!token.TryGetValue("expires_at", out var expiresAtObj))
        {
            return true;
        }

        var expiresAtStr = expiresAtObj?.ToString();
        if (string.IsNullOrEmpty(expiresAtStr))
        {
            return true;
        }

        if (DateTimeOffset.TryParse(expiresAtStr, out var expiresAt))
        {
            // Consider token expired if it expires in less than 5 minutes
            return expiresAt <= DateTimeOffset.UtcNow.AddMinutes(5);
        }

        return true;
    }

    /// <inheritdoc />
    protected override async Task<Dictionary<string, object>> RefreshTokenAsync(Dictionary<string, object> token)
    {
        // Get refresh token
        if (!token.TryGetValue("refresh_token", out var refreshTokenObj) || refreshTokenObj == null)
        {
            throw new InvalidOperationException("No refresh token found");
        }

        var refreshToken = refreshTokenObj.ToString();

        var parameters = new Dictionary<string, string>
        {
            ["action"] = "requesttoken",
            ["grant_type"] = "refresh_token",
            ["client_id"] = _config.ClientId,
            ["client_secret"] = _config.ClientSecret,
            ["refresh_token"] = refreshToken!
        };

        var content = new FormUrlEncodedContent(parameters);
        var response = await _httpClient.PostAsync("https://wbsapi.withings.net/v2/oauth2", content);

        if (!response.IsSuccessStatusCode)
        {
            Logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}",
                response.StatusCode, response.ReasonPhrase);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        Logger.LogDebug("Withings token refresh completed");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false
        };

        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsTokenResponse>>(responseContent, options);

        if (withingsResponse?.Status != 0)
        {
            Logger.LogError("Withings API error: {Status} {Error}",
                withingsResponse?.Status, withingsResponse?.Error);

            // Check for auth-related errors
            // Withings uses status 401 for invalid token
            if (withingsResponse?.Status == 401 ||
                withingsResponse?.Error?.Contains("invalid_token", StringComparison.OrdinalIgnoreCase) == true ||
                withingsResponse?.Error?.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) == true)
            {
                throw new ProviderAuthException(
                    "withings",
                    $"Withings authentication failed: {withingsResponse.Error}",
                    withingsResponse.Status.ToString());
            }

            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }

        var tokenData = withingsResponse!.Body!;

        // Create refreshed token dictionary
        return new Dictionary<string, object>
        {
            ["userid"] = tokenData.Userid,
            ["access_token"] = tokenData.AccessToken ?? string.Empty,
            ["refresh_token"] = tokenData.RefreshToken ?? string.Empty,
            ["token_type"] = tokenData.TokenType ?? string.Empty,
            ["scope"] = tokenData.Scope ?? string.Empty,
            ["expires_at"] = DateTimeOffset.UtcNow.AddSeconds(tokenData.ExpiresIn).ToString("o"),
            ["expires_in"] = tokenData.ExpiresIn
        };
    }

    /// <inheritdoc />
    protected override async Task<List<RawMeasurement>> FetchMeasurementsAsync(Dictionary<string, object> token, bool metric, long startTimestamp)
    {
        // Get access token
        if (!token.TryGetValue("access_token", out var accessTokenObj) || accessTokenObj == null)
        {
            throw new InvalidOperationException("No access token found");
        }

        var accessToken = accessTokenObj.ToString();

        var allMeasurements = new List<RawMeasurement>();
        bool hasMore = true;
        object? offset = null;

        while (hasMore)
        {
            var (measurements, more, newOffset, timezone) = await GetMeasurementPageAsync(accessToken!, startTimestamp, offset);
            allMeasurements.AddRange(measurements);
            hasMore = more;
            offset = newOffset;
        }

        return allMeasurements;
    }

    /// <summary>
    /// Gets a single page of measurements from Withings API
    /// </summary>
    private async Task<(List<RawMeasurement> measurements, bool more, object? offset, string timezone)>
        GetMeasurementPageAsync(string accessToken, long start, object? offset = null)
    {
        Logger.LogDebug("Fetching Withings measurements page with offset: {Offset}", offset);

        var request = new HttpRequestMessage(HttpMethod.Get, "https://wbsapi.withings.net/measure");
        request.Headers.Add("Authorization", $"Bearer {accessToken}");

        var uriBuilder = new UriBuilder(request.RequestUri!);
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);

        query["action"] = "getmeas";
        query["category"] = "1"; // 1 for real measures
        query["meastypes"] = "1,6"; // 1 for Weight (kg), 6 for Fat Ratio (%)
        query["startdate"] = start.ToString();

        if (offset != null)
        {
            query["offset"] = offset.ToString() ?? string.Empty;
        }

        uriBuilder.Query = query.ToString();
        request.RequestUri = uriBuilder.Uri;

        Logger.LogDebug("Withings API request: {Uri}", request.RequestUri);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            Logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}. Response content: {Content}",
                response.StatusCode, response.ReasonPhrase, errorContent);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        Logger.LogDebug("Withings API response received for measurements");

        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsGetMeasuresResponse>>(responseContent);

        if (withingsResponse?.Status != 0)
        {
            Logger.LogError("Withings API error: {Status} {Error}",
                withingsResponse?.Status, withingsResponse?.Error);

            // Check for auth-related errors
            // Withings uses status 401 for invalid token
            if (withingsResponse?.Status == 401 ||
                withingsResponse?.Error?.Contains("invalid_token", StringComparison.OrdinalIgnoreCase) == true ||
                withingsResponse?.Error?.Contains("unauthorized", StringComparison.OrdinalIgnoreCase) == true)
            {
                throw new ProviderAuthException(
                    "withings",
                    $"Withings authentication failed: {withingsResponse.Error}",
                    withingsResponse.Status.ToString());
            }

            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }

        var body = withingsResponse!.Body!;
        var timezone = body.Timezone;

        var measurements = new List<RawMeasurement>();
        foreach (var group in body.MeasureGroups)
        {
            var timestamp = group.Date;
            var weightMeasure = group.Measures.Find(m => m.Type == 1); // Type 1 = Weight
            var fatMeasure = group.Measures.Find(m => m.Type == 6);    // Type 6 = Fat Percentage

            if (weightMeasure != null)
            {
                var weight = MeasureToDecimal(weightMeasure);

                decimal? fatRatio = null;
                if (fatMeasure != null)
                {
                    var fatPercent = MeasureToDecimal(fatMeasure);
                    fatRatio = fatPercent / 100m; // Convert percentage to ratio
                }

                var measurement = new RawMeasurement
                {
                    Timestamp = timestamp,
                    Weight = weight, // Always store in kg
                    FatRatio = fatRatio
                };

                measurements.Add(measurement);
            }
        }

        // Sort measurements in descending order by timestamp
        measurements.Sort((a, b) => b.Timestamp.CompareTo(a.Timestamp));

        return (measurements, body.More > 0, body.Offset, timezone);
    }

    /// <summary>
    /// Converts a Withings measure to a decimal value
    /// </summary>
    private static decimal MeasureToDecimal(WithingsMeasure measure)
    {
        return (decimal)(measure.Value * Math.Pow(10, measure.Unit));
    }

}
