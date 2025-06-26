using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TrendWeight.Features.Vendors.Models;
using TrendWeight.Infrastructure.Firebase;
using System.Security.Claims;

namespace TrendWeight.Features.Vendors.Withings;

/// <summary>
/// Controller for testing Withings API integration
/// This is a temporary controller for development/testing purposes only
/// </summary>
[ApiController]
[Route("api/withings")]
[Authorize]
public class WithingsTestController : ControllerBase
{
    private readonly IWithingsService _withingsService;
    private readonly IFirestoreService _firestoreService;
    private readonly ILogger<WithingsTestController> _logger;
    
    /// <summary>
    /// Constructor
    /// </summary>
    public WithingsTestController(
        IWithingsService withingsService, 
        IFirestoreService firestoreService,
        ILogger<WithingsTestController> logger)
    {
        _withingsService = withingsService;
        _firestoreService = firestoreService;
        _logger = logger;
    }
    
    /// <summary>
    /// Test endpoint to fetch measurements from Withings API
    /// </summary>
    /// <param name="metric">Whether to return measurements in metric units (default: true)</param>
    /// <param name="start">Start timestamp for measurements (default: 30 days ago)</param>
    /// <returns>Raw measurements from Withings API</returns>
    [HttpGet("test")]
    public async Task<IActionResult> TestGetMeasurements([FromQuery] bool metric = true, [FromQuery] long? start = null)
    {
        try
        {
            // Get the user ID from the authenticated user's claims
            var uid = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(uid))
            {
                return Unauthorized(new { Error = "User ID not found in token" });
            }
            
            // Fetch the user's vendor links from Firestore
            var linksDoc = await _firestoreService.GetDocumentAsync<Links>("links", uid);
            if (linksDoc?.Withings?.Token == null)
            {
                return NotFound("No Withings link found for this user");
            }
            
            var token = linksDoc.Withings.Token;
            
            // Log the raw token data from Firestore
            _logger.LogInformation("Raw token data from Firestore: {Token}", 
                System.Text.Json.JsonSerializer.Serialize(token));
            
            _logger.LogInformation("Token properties: Access_Token={AccessToken}, Refresh_Token={RefreshToken}, Expires_At={ExpiresAt}", 
                token.Access_Token, token.Refresh_Token, token.Expires_At);
            
            // Check if the token is expired and refresh it if needed
            bool tokenRefreshed = false;
            DateTimeOffset expiresAt = DateTimeOffset.MaxValue;
            DateTimeOffset now = DateTimeOffset.UtcNow;
            
            if (!string.IsNullOrEmpty(token.Expires_At))
            {
                expiresAt = DateTimeOffset.Parse(token.Expires_At);
                
                _logger.LogInformation("Token expires at {ExpiresAt}, current time is {Now}", expiresAt, now);
                
                // Check if token is expired or expires soon (within 5 minutes)
                // This matches the legacy implementation in access-token.ts expiresSoon function
                var cutoff = now.AddMinutes(-5); // 5 minutes before now
                if (cutoff > expiresAt) // if cutoff is after expiresAt, token has expired or expires soon
                {
                    _logger.LogInformation("Token expires soon or has expired. Refreshing Withings token for user {UserId}", uid);
                    _logger.LogInformation("Old token: Access_Token={AccessTokenLength}, Refresh_Token={RefreshTokenLength}, Expires_At={ExpiresAt}", 
                        token.Access_Token?.Length ?? 0, 
                        token.Refresh_Token?.Length ?? 0, 
                        token.Expires_At);
                    
                    token = await _withingsService.RefreshTokenAsync(token);
                    tokenRefreshed = true;
                    
                    _logger.LogInformation("Token refreshed successfully. New token: Access_Token={AccessTokenLength}, Refresh_Token={RefreshTokenLength}, Expires_At={ExpiresAt}", 
                        token.Access_Token?.Length ?? 0, 
                        token.Refresh_Token?.Length ?? 0, 
                        token.Expires_At);
                    
                    // Create a fresh Links object to avoid any JsonElement objects from the deserialized document
                    var newLinksDoc = new Links
                    {
                        Uid = uid,
                        Withings = new VendorLink
                        {
                            Token = token,
                            UpdateTime = DateTimeOffset.UtcNow.ToString("o"),
                            UpdateReason = "Token refreshed by test endpoint"
                        }
                    };
                    
                    // If there are any other vendor links, preserve them
                    if (linksDoc?.Fitbit != null)
                    {
                        newLinksDoc.Fitbit = new VendorLink
                        {
                            Token = new AccessToken
                            {
                                Access_Token = linksDoc.Fitbit.Token.Access_Token,
                                Refresh_Token = linksDoc.Fitbit.Token.Refresh_Token,
                                Token_Type = linksDoc.Fitbit.Token.Token_Type,
                                Scope = linksDoc.Fitbit.Token.Scope,
                                Expires_At = linksDoc.Fitbit.Token.Expires_At
                            },
                            UpdateTime = linksDoc.Fitbit.UpdateTime,
                            UpdateReason = linksDoc.Fitbit.UpdateReason
                        };
                    }
                    
                    await _firestoreService.SetDocumentAsync("links", uid, newLinksDoc);
                    _logger.LogInformation("Updated token in Firestore for user {UserId}", uid);
                }
                else
                {
                    _logger.LogInformation("Token is still valid, no refresh needed");
                }
            }
            
            // If start is not provided, use 1 (epoch start) to get all historical data
            // This matches the legacy implementation in refresh-data.ts where start = 1 when there's no existing data
            var startTimestamp = start ?? 1;
            
            // Call the Withings API
            var (measurements, more, offset, timezone) = await _withingsService.GetMeasurementsAsync(token, metric, startTimestamp);
            
            // Return the raw measurements and metadata
            return Ok(new
            {
                Measurements = measurements,
                More = more,
                Offset = offset,
                Timezone = timezone,
                TokenInfo = new
                {
                    UserId = token.Userid,
                    ExpiresAt = token.Expires_At,
                    IsRefreshed = tokenRefreshed
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error testing Withings API");
            return StatusCode(500, new { Error = ex.Message });
        }
    }
}
