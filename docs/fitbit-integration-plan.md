# Fitbit Integration Implementation Plan

## Overview
This document outlines the implementation plan for adding Fitbit support to TrendWeight, following the existing Withings integration pattern while accommodating Fitbit's specific API requirements.

## Key Requirements
- Match the existing Withings integration architecture
- Always request weights in pounds to avoid Fitbit's metric rounding error
- Use 90-day lookback period for incremental syncs (matching Withings)
- Automatically refresh expired tokens using the base class infrastructure
- Fetch all available historical data on initial sync

## 1. File Structure

Following the exact pattern as Withings, create these files:

```
/Features/Providers/Fitbit/
├── IFitbitService.cs           # Interface extending IProviderService
├── FitbitService.cs            # Main service implementation
├── FitbitConfig.cs             # Configuration class
├── FitbitLinkController.cs     # OAuth initiation controller
├── FitbitCallbackController.cs # OAuth callback controller
└── Models/
    ├── FitbitTokenResponse.cs
    ├── FitbitWeightLog.cs
    ├── FitbitWeightLogEntry.cs
    └── FitbitApiError.cs
```

## 2. FitbitService Implementation

### Key Methods

#### `GetAuthorizationUrl(string state, string callbackUrl)`
Build Fitbit OAuth2 authorization URL with:
- `client_id`
- `response_type=code`
- `scope=weight`
- `redirect_uri` (callback URL)
- `state` (signed JWT)

#### `ExchangeCodeForTokenAsync(string code, string callbackUrl)`
Exchange authorization code for tokens:
- Use Basic Auth with client credentials
- Parse token response
- Return `AccessToken` object

#### `RefreshTokenAsync(AccessToken token)`
Refresh expired access tokens using Fitbit's standard OAuth2 refresh flow:
- Use Basic Auth with client credentials
- Send refresh_token grant type
- Return new AccessToken with updated expiration

#### `FetchMeasurementsAsync(AccessToken token, bool metric, long startTimestamp)`
Main data fetching logic:
1. Find earliest data using `/1/user/-/body/weight/date/today/max.json`
2. Fetch in 31-day chunks using `/1/user/-/body/log/weight/date/{start}/{end}.json`
3. Always request in pounds (use `Accept-Language: en_US` header)
4. Convert to kg for storage
5. Handle fat percentage data

## 3. Data Fetching Strategy

### Initial Full Sync
1. Call `/1/user/-/body/weight/date/today/max.json` to find earliest weight date
2. Starting from earliest date, fetch data in 31-day chunks
3. Continue until reaching current date
4. Process and store all measurements

### Incremental Sync
1. Start from 90 days before last sync date (to catch edits)
2. Fetch up to current date in 31-day chunks
3. Update/delete changed measurements based on `logId`

### Data Processing
- **Weight**: Always request in pounds, convert to kg (`kg = lbs / 2.20462`)
- **Fat**: Convert percentage to ratio (divide by 100)
- **Timestamp**: Combine date and time to Unix timestamp
- **Unique ID**: Use `logId` for updates/deletions
- **Grouping**: Use `logId / 1000` for daily grouping

## 4. Weight Unit Handling (Critical)

### The Fitbit Rounding Problem
Fitbit rounds metric weights to 1 decimal place when converting between units, causing 0.1-0.2 lb errors.

### Solution
```csharp
// Always use en_US locale to get pounds
request.Headers.Add("Accept-Language", "en_US");

// Convert to kg for storage with full precision
var weightInKg = weightInPounds / 2.20462m;
```

## 5. OAuth Flow

### FitbitLinkController
```csharp
[HttpGet("link/fitbit")]
public IActionResult InitiateFitbitLink()
{
    // Generate signed JWT state token
    var state = GenerateStateToken(userId);
    
    // Get authorization URL
    var authUrl = _fitbitService.GetAuthorizationUrl(state, callbackUrl);
    
    // Return URL to frontend
    return Ok(new { url = authUrl });
}
```

### FitbitCallbackController
```csharp
[HttpGet("oauth/fitbit/callback")]
public async Task<IActionResult> HandleCallback(string code, string state)
{
    // Validate JWT state token
    var userId = ValidateStateToken(state);
    
    // Exchange code for tokens
    await _fitbitService.ExchangeAuthorizationCodeAsync(code, callbackUrl, userId);
    
    // Redirect to frontend success page
    return Redirect($"{frontendUrl}/link?provider=fitbit&success=true");
}
```

## 6. Error Handling

### Token Expiry
When Fitbit returns 401:
```csharp
if (response.StatusCode == HttpStatusCode.Unauthorized)
{
    _logger.LogWarning("Fitbit token expired for user {UserId}", userId);
    throw new UnauthorizedException("Fitbit authorization expired. Please reconnect your account.");
}
```

Frontend will need to handle this and prompt for reauthorization.

## 7. Configuration

### appsettings.json
```json
{
  "Fitbit": {
    "ClientId": "[client-id]",
    "ClientSecret": "[client-secret]",
    "RedirectUri": "http://localhost:5173/oauth/fitbit/callback"
  }
}
```

### ServiceCollectionExtensions.cs
```csharp
// Bind configuration
services.Configure<FitbitConfig>(configuration.GetSection("Fitbit"));
services.AddSingleton(sp => sp.GetRequiredService<IOptions<FitbitConfig>>().Value);

// Register services
services.AddScoped<IFitbitService, FitbitService>();
services.AddScoped<IProviderService, FitbitService>();

// Add HttpClient
services.AddHttpClient<FitbitService>();
```

## 8. API Response Models

### FitbitTokenResponse
```csharp
public class FitbitTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
    
    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; } = string.Empty;
    
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
    
    [JsonPropertyName("scope")]
    public string Scope { get; set; } = string.Empty;
    
    [JsonPropertyName("user_id")]
    public string UserId { get; set; } = string.Empty;
}
```

### FitbitWeightLog
```csharp
public class FitbitWeightLog
{
    [JsonPropertyName("weight")]
    public List<FitbitWeightLogEntry> Weight { get; set; } = new();
}

public class FitbitWeightLogEntry
{
    [JsonPropertyName("bmi")]
    public decimal Bmi { get; set; }
    
    [JsonPropertyName("date")]
    public string Date { get; set; } = string.Empty;
    
    [JsonPropertyName("logId")]
    public long LogId { get; set; }
    
    [JsonPropertyName("time")]
    public string Time { get; set; } = string.Empty;
    
    [JsonPropertyName("weight")]
    public decimal Weight { get; set; }
    
    [JsonPropertyName("fat")]
    public decimal? Fat { get; set; }
}
```

## 9. Frontend Integration

### Add OAuth Callback Route
Create `/oauth/fitbit/callback` route to handle OAuth callbacks.

### Provider UI
No changes needed - the existing ProvidersController will automatically discover Fitbit through the IProviderService interface.

## 10. Testing Strategy

1. **OAuth Flow**: Test authorization and callback end-to-end
2. **Initial Sync**: Verify full historical data fetch
3. **Incremental Sync**: Test 90-day lookback with data updates
4. **Weight Conversion**: Confirm no rounding errors (pounds to kg)
5. **Error Handling**: Test 401 responses without token refresh
6. **Data Integrity**: Verify updates and deletions work correctly

## Implementation Notes

### API Differences from Withings
- Date range based fetching (not pagination)
- 31-day maximum range per request
- Combined weight/fat data in single response
- 8-hour token expiry (vs 3 hours for Withings)
- Basic Auth for token exchange

### Critical Implementation Details
1. **Always** request weights in pounds to avoid rounding errors
2. Use 90-day lookback to match Withings behavior
3. Store weights in kg, fat as ratio (0-1)
4. Handle 401 errors clearly for frontend
5. Use `logId` as unique identifier for measurements

## References
- [Fitbit Web API Documentation](https://dev.fitbit.com/build/reference/web-api/)
- [Fitbit OAuth 2.0 Tutorial](https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/)
- [Fitbit Rounding Error Blog Post](https://blog.trendweight.com/fitbit-rounding-error/)