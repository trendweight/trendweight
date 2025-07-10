using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Web;
using TrendWeight.Features.Measurements;
using TrendWeight.Features.Measurements.Models;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Providers.Fitbit.Models;

namespace TrendWeight.Features.Providers.Fitbit;

/// <summary>
/// Service for interacting with the Fitbit API
/// </summary>
public class FitbitService : ProviderServiceBase, IFitbitService
{
    private readonly HttpClient _httpClient;
    private readonly FitbitConfig _config;
    private const decimal PoundsToKgFactor = 2.20462m;
    private int _remainingApiCalls = int.MaxValue;
    private DateTimeOffset _rateLimitResetTime = DateTimeOffset.UtcNow;

    /// <summary>
    /// Constructor
    /// </summary>
    public FitbitService(
        HttpClient httpClient,
        FitbitConfig config,
        IProviderLinkService providerLinkService,
        ISourceDataService sourceDataService,
        IUserService userService,
        ILogger<FitbitService> logger)
        : base(providerLinkService, sourceDataService, userService, logger)
    {
        _httpClient = httpClient;
        _config = config;
    }

    /// <inheritdoc />
    public override string ProviderName => "fitbit";

    /// <inheritdoc />
    public override string GetAuthorizationUrl(string state, string callbackUrl)
    {
        var url = new UriBuilder("https://www.fitbit.com/oauth2/authorize");
        var query = HttpUtility.ParseQueryString(string.Empty);
        query["client_id"] = _config.ClientId;
        query["response_type"] = "code";
        query["scope"] = "weight";
        query["state"] = state;
        query["redirect_uri"] = callbackUrl;
        url.Query = query.ToString();

        Logger.LogDebug("Generated Fitbit authorization URL");
        return url.ToString();
    }

    /// <inheritdoc />
    protected override async Task<Dictionary<string, object>> ExchangeCodeForTokenAsync(string code, string callbackUrl)
    {
        var parameters = new Dictionary<string, string>
        {
            ["code"] = code,
            ["grant_type"] = "authorization_code",
            ["redirect_uri"] = callbackUrl
        };

        var content = new FormUrlEncodedContent(parameters);

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.fitbit.com/oauth2/token")
        {
            Content = content
        };

        // Use Basic Auth with client credentials
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_config.ClientId}:{_config.ClientSecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            Logger.LogError("Fitbit token exchange failed: {StatusCode} {Content}",
                response.StatusCode, errorContent);
            throw new HttpRequestException($"Fitbit token exchange failed: {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var tokenData = JsonSerializer.Deserialize<FitbitTokenResponse>(responseContent);

        if (tokenData == null)
        {
            throw new JsonException("Failed to parse Fitbit token response");
        }

        Logger.LogDebug("Successfully exchanged Fitbit authorization code for tokens");

        // Create token dictionary
        return new Dictionary<string, object>
        {
            ["user_id"] = tokenData.UserId,
            ["access_token"] = tokenData.AccessToken,
            ["refresh_token"] = tokenData.RefreshToken,
            ["token_type"] = tokenData.TokenType,
            ["scope"] = tokenData.Scope,
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
            ["grant_type"] = "refresh_token",
            ["refresh_token"] = refreshToken!
        };

        var content = new FormUrlEncodedContent(parameters);

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.fitbit.com/oauth2/token")
        {
            Content = content
        };

        // Use Basic Auth with client credentials
        var credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_config.ClientId}:{_config.ClientSecret}"));
        request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            Logger.LogError("Fitbit token refresh failed: {StatusCode} {Content}",
                response.StatusCode, errorContent);
            throw new HttpRequestException($"Fitbit token refresh failed: {response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();
        var tokenData = JsonSerializer.Deserialize<FitbitTokenResponse>(responseContent);

        if (tokenData == null)
        {
            throw new JsonException("Failed to parse Fitbit token refresh response");
        }

        Logger.LogDebug("Successfully refreshed Fitbit access token");

        // Create refreshed token dictionary
        return new Dictionary<string, object>
        {
            ["user_id"] = tokenData.UserId,
            ["access_token"] = tokenData.AccessToken,
            ["refresh_token"] = tokenData.RefreshToken,
            ["token_type"] = tokenData.TokenType,
            ["scope"] = tokenData.Scope,
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

        // Determine date range
        DateTime startDate;
        DateTime endDate = DateTime.UtcNow.Date;

        if (startTimestamp > 1)
        {
            // Convert Unix timestamp to DateTime
            startDate = DateTimeOffset.FromUnixTimeSeconds(startTimestamp).UtcDateTime.Date;
        }
        else
        {
            // For initial sync, use Fitbit's earliest allowed date
            // The API doesn't allow requests before 2009-01-01
            startDate = new DateTime(2009, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            Logger.LogInformation("Starting Fitbit sync from earliest allowed date: {StartDate}", startDate.ToString("yyyy-MM-dd"));
        }

        Logger.LogInformation("Fetching Fitbit measurements from {StartDate} to {EndDate}",
            startDate.ToString("yyyy-MM-dd"), endDate.ToString("yyyy-MM-dd"));

        // Calculate total days and chunks needed
        var totalDays = (endDate - startDate).TotalDays;
        var estimatedChunks = Math.Ceiling(totalDays / 32);
        Logger.LogInformation("Total days to fetch: {TotalDays}, estimated API calls: {Chunks}", totalDays, estimatedChunks);

        // Fetch data in 32-day chunks (Fitbit's maximum allowed range)
        var currentStart = startDate;
        while (currentStart <= endDate)
        {
            var currentEnd = currentStart.AddDays(31); // 32 days total
            if (currentEnd > endDate)
            {
                currentEnd = endDate;
            }

            var measurements = await GetWeightLogAsync(accessToken!, currentStart, currentEnd);
            allMeasurements.AddRange(measurements);

            currentStart = currentEnd.AddDays(1);
        }

        Logger.LogInformation("Fetched {Count} measurements from Fitbit spanning {StartDate} to {EndDate}",
            allMeasurements.Count,
            startDate.ToString("yyyy-MM-dd"),
            endDate.ToString("yyyy-MM-dd"));

        if (allMeasurements.Count > 0)
        {
            var earliestMeasurement = allMeasurements.OrderBy(m => m.Timestamp).First();
            var latestMeasurement = allMeasurements.OrderBy(m => m.Timestamp).Last();
            var earliestDate = DateTimeOffset.FromUnixTimeSeconds(earliestMeasurement.Timestamp).DateTime;
            var latestDate = DateTimeOffset.FromUnixTimeSeconds(latestMeasurement.Timestamp).DateTime;

            Logger.LogInformation("Actual measurement dates: {EarliestDate} to {LatestDate}",
                earliestDate.ToString("yyyy-MM-dd"),
                latestDate.ToString("yyyy-MM-dd"));
        }

        return allMeasurements;
    }

    /// <summary>
    /// Sends an HTTP request with rate limiting
    /// </summary>
    private async Task<HttpResponseMessage> SendRateLimitedRequestAsync(HttpRequestMessage request)
    {
        // Check if we need to wait before making the request
        if (_remainingApiCalls < 5 && DateTimeOffset.UtcNow < _rateLimitResetTime)
        {
            var waitTime = _rateLimitResetTime - DateTimeOffset.UtcNow;
            Logger.LogWarning("Rate limit nearly exhausted. Waiting {WaitTime} seconds before next request", waitTime.TotalSeconds);
            await Task.Delay(waitTime);
        }

        var response = await _httpClient.SendAsync(request);

        // Update rate limit tracking from response headers
        UpdateRateLimitTracking(response);

        return response;
    }

    /// <summary>
    /// Updates rate limit tracking from Fitbit response headers
    /// </summary>
    private void UpdateRateLimitTracking(HttpResponseMessage response)
    {
        if (response.Headers.TryGetValues("fitbit-rate-limit-limit", out var limitValues))
        {
            var limit = limitValues.FirstOrDefault();
            if (response.Headers.TryGetValues("fitbit-rate-limit-remaining", out var remainingValues) &&
                response.Headers.TryGetValues("fitbit-rate-limit-reset", out var resetValues))
            {
                var remaining = remainingValues.FirstOrDefault();
                var reset = resetValues.FirstOrDefault();

                if (int.TryParse(remaining, out var remainingCalls))
                {
                    _remainingApiCalls = remainingCalls;
                }

                if (int.TryParse(reset, out var resetSeconds))
                {
                    _rateLimitResetTime = DateTimeOffset.UtcNow.AddSeconds(resetSeconds);
                }

                Logger.LogDebug("Fitbit rate limit: {Remaining}/{Limit} (resets in {Reset}s)",
                    remaining, limit, reset);

                // Log warning if approaching limit
                if (_remainingApiCalls < 10)
                {
                    Logger.LogWarning("Approaching Fitbit rate limit: {Remaining} calls remaining", _remainingApiCalls);
                }
            }
        }
    }

    /// <summary>
    /// Gets weight log for a date range
    /// </summary>
    private async Task<List<RawMeasurement>> GetWeightLogAsync(string accessToken, DateTime startDate, DateTime endDate)
    {
        var measurements = new List<RawMeasurement>();

        var startStr = startDate.ToString("yyyy-MM-dd");
        var endStr = endDate.ToString("yyyy-MM-dd");

        Logger.LogDebug("Fetching Fitbit weight log from {StartDate} to {EndDate}", startStr, endStr);

        var request = new HttpRequestMessage(HttpMethod.Get,
            $"https://api.fitbit.com/1/user/-/body/log/weight/date/{startStr}/{endStr}.json");

        // Always request in US locale to get pounds (avoids Fitbit rounding error)
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.Add("Accept-Language", "en_US");

        Logger.LogDebug("Fitbit API request: {Method} {Uri}", request.Method, request.RequestUri);

        var response = await SendRateLimitedRequestAsync(request);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            Logger.LogWarning("Fitbit token expired");
            throw new UnauthorizedException("Fitbit authorization expired. Please reconnect your account.");
        }

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            Logger.LogError("Failed to get weight log: {StatusCode} {Content}", response.StatusCode, errorContent);
            return measurements;
        }

        var content = await response.Content.ReadAsStringAsync();
        var debugContent = TruncateJsonArrays(content, 3);
        Logger.LogDebug("Fitbit weight log response for {StartDate} to {EndDate}: {Content}", startStr, endStr, debugContent);

        var weightLog = JsonSerializer.Deserialize<FitbitWeightLog>(content);

        if (weightLog?.Weight == null)
        {
            Logger.LogWarning("No weight data in Fitbit response");
            return measurements;
        }

        Logger.LogDebug("Found {Count} weight entries in Fitbit response", weightLog.Weight.Count);

        if (weightLog.Weight.Count == 0)
        {
            Logger.LogDebug("Weight array is empty for date range {StartDate} to {EndDate}", startStr, endStr);
            return measurements;
        }

        foreach (var entry in weightLog.Weight)
        {
            // Parse date and time to create timestamp
            if (DateTime.TryParse($"{entry.Date} {entry.Time}", out var dateTime))
            {
                var timestamp = new DateTimeOffset(dateTime, TimeSpan.Zero).ToUnixTimeSeconds();

                // Convert pounds to kg for storage
                var weightInKg = entry.Weight / PoundsToKgFactor;

                Logger.LogDebug("Processing weight entry: Date={Date}, Time={Time}, Weight={Weight}lbs ({WeightKg}kg)",
                    entry.Date, entry.Time, entry.Weight, weightInKg);

                var measurement = new RawMeasurement
                {
                    Timestamp = timestamp,
                    Weight = weightInKg,
                    FatRatio = entry.Fat.HasValue ? entry.Fat.Value / 100m : null // Convert percentage to ratio
                };

                measurements.Add(measurement);
            }
            else
            {
                Logger.LogWarning("Failed to parse date/time: {Date} {Time}", entry.Date, entry.Time);
            }
        }

        Logger.LogDebug("Processed {Count} measurements from Fitbit", measurements.Count);
        return measurements;
    }

    /// <summary>
    /// Truncates JSON arrays in a string to show only first and last few elements
    /// </summary>
    private string TruncateJsonArrays(string json, int keepCount)
    {
        try
        {
            using var doc = JsonDocument.Parse(json);
            return TruncateJsonElement(doc.RootElement, keepCount);
        }
        catch
        {
            // If we can't parse it, return a truncated version
            return json.Length > 500 ? json.Substring(0, 500) + "..." : json;
        }
    }

    /// <summary>
    /// Recursively truncates arrays in a JsonElement
    /// </summary>
    private string TruncateJsonElement(JsonElement element, int keepCount)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Object:
                var obj = new StringBuilder("{");
                var objFirst = true;
                foreach (var prop in element.EnumerateObject())
                {
                    if (!objFirst) obj.Append(",");
                    objFirst = false;
                    obj.Append($"\"{prop.Name}\":");
                    obj.Append(TruncateJsonElement(prop.Value, keepCount));
                }
                obj.Append("}");
                return obj.ToString();

            case JsonValueKind.Array:
                var arr = new StringBuilder("[");
                var items = element.EnumerateArray().ToList();
                if (items.Count <= keepCount * 2)
                {
                    // Array is small enough, include all items
                    arr.Append(string.Join(",", items.Select(item => TruncateJsonElement(item, keepCount))));
                }
                else
                {
                    // Show first few and last few items
                    var firstItems = items.Take(keepCount).Select(item => TruncateJsonElement(item, keepCount));
                    var lastItems = items.Skip(items.Count - keepCount).Select(item => TruncateJsonElement(item, keepCount));
                    arr.Append(string.Join(",", firstItems));
                    arr.Append($",...({items.Count - keepCount * 2} more items)...,");
                    arr.Append(string.Join(",", lastItems));
                }
                arr.Append("]");
                return arr.ToString();

            case JsonValueKind.String:
                return JsonSerializer.Serialize(element.GetString());

            case JsonValueKind.Number:
                return element.GetRawText();

            case JsonValueKind.True:
                return "true";

            case JsonValueKind.False:
                return "false";

            case JsonValueKind.Null:
                return "null";

            default:
                return element.GetRawText();
        }
    }
}
