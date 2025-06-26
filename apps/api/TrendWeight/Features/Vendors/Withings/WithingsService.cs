using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Extensions.Logging;
using TrendWeight.Features.Data.Models;
using TrendWeight.Features.Vendors.Models;
using TrendWeight.Features.Vendors.Withings.Models;

namespace TrendWeight.Features.Vendors.Withings;

/// <summary>
/// Service for interacting with the Withings API
/// </summary>
public class WithingsService : IWithingsService
{
    private readonly HttpClient _httpClient;
    private readonly WithingsConfig _config;
    private readonly ILogger<WithingsService> _logger;
    
    /// <summary>
    /// Constructor
    /// </summary>
    public WithingsService(HttpClient httpClient, WithingsConfig config, ILogger<WithingsService> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
    }
    
    /// <inheritdoc />
    public string GetAuthorizationUrl(string state, string callbackUrl)
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
    public async Task<AccessToken> ExchangeAuthorizationCodeAsync(string code, string callbackUrl)
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
        _logger.LogInformation("Withings authorization code exchange response: {Content}", responseContent);
        
        // Define options to handle both string and numeric userid
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false
        };
        
        // Use a strongly-typed response model
        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsTokenResponse>>(responseContent, options);
        
        if (withingsResponse?.Status != 0)
        {
            _logger.LogError("Withings API error: {Status} {Error}", 
                withingsResponse?.Status, withingsResponse?.Error);
            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }
        
        var tokenData = withingsResponse!.Body!;
        
        // Convert userid to string if it's a number
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
    public async Task<AccessToken> RefreshTokenAsync(AccessToken token)
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
        _logger.LogInformation("Withings token refresh response: {Content}", responseContent);
        
        // Define options to handle both string and numeric userid
        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = false
        };
        
        // Use a strongly-typed response model
        var withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsTokenResponse>>(responseContent, options);
        
        if (withingsResponse?.Status != 0)
        {
            _logger.LogError("Withings API error: {Status} {Error}", 
                withingsResponse?.Status, withingsResponse?.Error);
            throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
        }
        
        var tokenData = withingsResponse!.Body!;
        
        // Convert userid to string if it's a number
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
    public async Task<(List<RawMeasurement> measurements, bool more, object? offset, string timezone)> 
        GetMeasurementsAsync(AccessToken token, bool metric, long start, object? offset = null)
    {
        _logger.LogInformation("Starting GetMeasurementsAsync with token: Access_Token={AccessTokenLength}, Refresh_Token={RefreshTokenLength}, Expires_At={ExpiresAt}", 
            token.Access_Token?.Length ?? 0, 
            token.Refresh_Token?.Length ?? 0, 
            token.Expires_At);

        // Create a request following the official API documentation
        var request = new HttpRequestMessage(HttpMethod.Get, "https://wbsapi.withings.net/measure");
        
        // Add Authorization header as required by the API documentation
        request.Headers.Add("Authorization", $"Bearer {token.Access_Token}");
        _logger.LogInformation("Added Authorization header: Bearer {AccessTokenPrefix}...", 
            token.Access_Token?.Substring(0, Math.Min(10, token.Access_Token?.Length ?? 0)));
        
        // Build query parameters
        var uriBuilder = new UriBuilder(request.RequestUri!);
        var query = HttpUtility.ParseQueryString(uriBuilder.Query);
        
        // Add required parameters
        query["action"] = "getmeas";
        query["category"] = "1"; // 1 for real measures, 2 for user objectives
        query["meastypes"] = "1,6"; // 1 for Weight (kg), 6 for Fat Ratio (%)
        query["startdate"] = start.ToString();
        _logger.LogInformation("Using startdate={StartDate}", start);
        
        // Add offset if provided
        if (offset != null)
        {
            query["offset"] = offset.ToString() ?? string.Empty;
        }
        
        // Set the updated query string
        uriBuilder.Query = query.ToString();
        request.RequestUri = uriBuilder.Uri;
        
        _logger.LogInformation("Withings API request: {Uri}", request.RequestUri);
        
        // Send the request
        _logger.LogInformation("Sending request to Withings API: {Uri}", request.RequestUri);
        var response = await _httpClient.SendAsync(request);
        
        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            _logger.LogError("Withings HTTP error: {StatusCode} {ReasonPhrase}. Response content: {Content}", 
                response.StatusCode, response.ReasonPhrase, errorContent);
            throw new Exception($"Withings HTTP error: {response.StatusCode} {response.ReasonPhrase}. Response content: {errorContent}");
        }
        
        var responseContent = await response.Content.ReadAsStringAsync();
        _logger.LogInformation("Withings API response: {Content}", responseContent);
        
        WithingsResponse<WithingsGetMeasuresResponse>? withingsResponse;
        try
        {
            withingsResponse = JsonSerializer.Deserialize<WithingsResponse<WithingsGetMeasuresResponse>>(responseContent);
            
            if (withingsResponse?.Status != 0)
            {
                _logger.LogError("Withings API error: {Status} {Error}", 
                    withingsResponse?.Status, withingsResponse?.Error);
                throw new Exception($"Withings API error: {withingsResponse?.Status} {withingsResponse?.Error}");
            }
            
            _logger.LogInformation("Successfully parsed Withings API response with status: {Status}", withingsResponse?.Status);
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize Withings API response: {Content}", responseContent);
            throw new Exception($"Failed to deserialize Withings API response: {ex.Message}", ex);
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
                
                var measurement = new RawMeasurement
                {
                    Timestamp = timestamp,
                    Weight = metric ? weight : weight * 2.20462262185 // Convert kg to lbs if not metric
                };
                
                if (fatMeasure != null)
                {
                    var fatPercent = MeasureToDecimal(fatMeasure);
                    measurement.FatRatio = fatPercent / 100; // Convert percentage to ratio
                }
                
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
    private static double MeasureToDecimal(WithingsMeasure measure)
    {
        return measure.Value * Math.Pow(10, measure.Unit);
    }
}
