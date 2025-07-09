using System.Text.Json;
using System.Web;
using TrendWeight.Features.Measurements;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Providers.Models;
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
    protected override async Task<AccessToken> ExchangeCodeForTokenAsync(string code, string callbackUrl)
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
            _logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}",
                response.StatusCode, response.ReasonPhrase);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogDebug("Withings authorization code exchange completed");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false
        };

        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsTokenResponse>>(responseContent, options);

        if (withingsResponse?.Status != 0)
        {
            _logger.LogError("Withings API error: {Status} {Error}",
                withingsResponse?.Status, withingsResponse?.Error);
            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }

        var tokenData = withingsResponse!.Body!;
        string userid = tokenData.Userid?.ToString() ?? string.Empty;

        return new AccessToken
        {
            Userid = userid,
            Access_Token = tokenData.AccessToken ?? string.Empty,
            Refresh_Token = tokenData.RefreshToken ?? string.Empty,
            Token_Type = tokenData.TokenType ?? string.Empty,
            Scope = tokenData.Scope ?? string.Empty,
            Expires_At = DateTimeOffset.UtcNow.AddSeconds(tokenData.ExpiresIn).ToString("o")
        };
    }

    /// <inheritdoc />
    protected override async Task<AccessToken> RefreshTokenAsync(AccessToken token)
    {
        var parameters = new Dictionary<string, string>
        {
            ["action"] = "requesttoken",
            ["grant_type"] = "refresh_token",
            ["client_id"] = _config.ClientId,
            ["client_secret"] = _config.ClientSecret,
            ["refresh_token"] = token.Refresh_Token
        };

        var content = new FormUrlEncodedContent(parameters);
        var response = await _httpClient.PostAsync("https://wbsapi.withings.net/v2/oauth2", content);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}",
                response.StatusCode, response.ReasonPhrase);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogDebug("Withings token refresh completed");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false
        };

        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsTokenResponse>>(responseContent, options);

        if (withingsResponse?.Status != 0)
        {
            _logger.LogError("Withings API error: {Status} {Error}",
                withingsResponse?.Status, withingsResponse?.Error);
            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }

        var tokenData = withingsResponse!.Body!;
        string userid = tokenData.Userid?.ToString() ?? string.Empty;

        return new AccessToken
        {
            Userid = userid,
            Access_Token = tokenData.AccessToken ?? string.Empty,
            Refresh_Token = tokenData.RefreshToken ?? string.Empty,
            Token_Type = tokenData.TokenType ?? string.Empty,
            Scope = tokenData.Scope ?? string.Empty,
            Expires_At = DateTimeOffset.UtcNow.AddSeconds(tokenData.ExpiresIn).ToString("o")
        };
    }

    /// <inheritdoc />
    protected override async Task<List<RawMeasurement>> FetchMeasurementsAsync(AccessToken token, bool metric, long startTimestamp)
    {
        var allMeasurements = new List<RawMeasurement>();
        bool hasMore = true;
        object? offset = null;

        while (hasMore)
        {
            var (measurements, more, newOffset, timezone) = await GetMeasurementPageAsync(token, metric, startTimestamp, offset);
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
        GetMeasurementPageAsync(AccessToken token, bool metric, long start, object? offset = null)
    {
        _logger.LogDebug("Fetching Withings measurements page with offset: {Offset}", offset);

        var request = new HttpRequestMessage(HttpMethod.Get, "https://wbsapi.withings.net/measure");
        request.Headers.Add("Authorization", $"Bearer {token.Access_Token}");

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

        _logger.LogDebug("Withings API request: {Uri}", request.RequestUri);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}. Response content: {Content}",
                response.StatusCode, response.ReasonPhrase, errorContent);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogDebug("Withings API response received for measurements");

        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsGetMeasuresResponse>>(responseContent);

        if (withingsResponse?.Status != 0)
        {
            _logger.LogError("Withings API error: {Status} {Error}",
                withingsResponse?.Status, withingsResponse?.Error);
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
                    Weight = metric ? weight : weight * 2.20462262185m, // Convert kg to lbs if not metric
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

    // IWithingsService legacy methods - these delegate to the base class methods

    public Task<AccessToken> ExchangeAuthorizationCodeAsync(string code, string callbackUrl)
    {
        return ExchangeCodeForTokenAsync(code, callbackUrl);
    }


    public async Task<(List<RawMeasurement> measurements, bool more, object? offset, string timezone)>
        GetMeasurementsAsync(AccessToken token, bool metric, long start, object? offset = null)
    {
        return await GetMeasurementPageAsync(token, metric, start, offset);
    }
}
