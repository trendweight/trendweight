using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.Measurements;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Profile.Services;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.Providers;

[ApiController]
[Route("api/providers")]
[Authorize]
public class ProvidersController : ControllerBase
{
    private readonly IProviderLinkService _providerLinkService;
    private readonly ISourceDataService _sourceDataService;
    private readonly IProviderIntegrationService _providerIntegrationService;
    private readonly IUserService _userService;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(
        IProviderLinkService providerLinkService,
        ISourceDataService sourceDataService,
        IProviderIntegrationService providerIntegrationService,
        IUserService userService,
        ILogger<ProvidersController> logger)
    {
        _providerLinkService = providerLinkService;
        _sourceDataService = sourceDataService;
        _providerIntegrationService = providerIntegrationService;
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Gets all provider links for the authenticated user
    /// </summary>
    /// <returns>List of provider links</returns>
    [HttpGet("links")]
    public async Task<ActionResult<List<object>>> GetProviderLinks()
    {
        try
        {
            // Get user ID from authenticated user claim
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                _logger.LogWarning("User ID not found or invalid in authenticated user claims");
                return Unauthorized(new { error = "User ID not found" });
            }

            // Get all provider links for the user
            var providerLinks = await _providerLinkService.GetAllForUserAsync(userGuid);

            // Transform to response format
            var response = providerLinks.Select(link => new
            {
                provider = link.Provider,
                connectedAt = link.UpdatedAt,
                updateReason = link.UpdateReason,
                hasToken = link.Token != null && !string.IsNullOrEmpty(link.Token.Access_Token)
            }).ToList();

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider links for user");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Disconnects a provider from the user's account
    /// </summary>
    /// <param name="provider">The provider to disconnect (withings, fitbit)</param>
    /// <returns>Success or error response</returns>
    [HttpDelete("{provider}")]
    public async Task<ActionResult> DisconnectProvider(string provider)
    {
        try
        {
            // Validate provider
            provider = provider.ToLowerInvariant();
            if (provider != "withings" && provider != "fitbit")
            {
                return BadRequest(new { error = "Invalid provider. Must be 'withings' or 'fitbit'" });
            }

            // Get user ID from authenticated user claim
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                _logger.LogWarning("User ID not found or invalid in authenticated user claims");
                return Unauthorized(new { error = "User ID not found" });
            }

            // Check if the provider link exists
            var existingLink = await _providerLinkService.GetAsync(userGuid, provider);
            if (existingLink == null)
            {
                return NotFound(new { error = $"No {provider} connection found" });
            }

            // Delete the provider link
            await _providerLinkService.DeleteAsync(userGuid, provider);

            _logger.LogInformation("Disconnected {Provider} for user {UserId}", provider, userId);
            return Ok(new { message = $"{provider} disconnected successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error disconnecting provider {Provider} for user", provider);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Triggers a data resync for a specific provider
    /// </summary>
    /// <param name="provider">The provider to resync (withings, fitbit)</param>
    /// <returns>Success or error response</returns>
    [HttpPost("{provider}/resync")]
    public async Task<ActionResult> ResyncProvider(string provider)
    {
        try
        {
            // Validate provider
            provider = provider.ToLowerInvariant();
            if (provider != "withings" && provider != "fitbit")
            {
                return BadRequest(new { error = "Invalid provider. Must be 'withings' or 'fitbit'" });
            }

            // Get user ID from authenticated user claim
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            {
                _logger.LogWarning("User ID not found or invalid in authenticated user claims");
                return Unauthorized(new { error = "User ID not found" });
            }

            // Check if the provider link exists
            var existingLink = await _providerLinkService.GetAsync(userGuid, provider);
            if (existingLink == null)
            {
                return NotFound(new { error = $"No {provider} connection found" });
            }

            // Get user to check metric preference
            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Set the resync requested flag immediately
            await _sourceDataService.SetResyncRequestedAsync(userGuid, provider);
            _logger.LogInformation("Set resync requested flag for {Provider} for user {UserId}", provider, userId);

            // Clear existing source data for this provider
            await _sourceDataService.ClearSourceDataAsync(userGuid, provider);
            _logger.LogInformation("Cleared source data for {Provider} for user {UserId}", provider, userId);

            // Get provider service and trigger sync
            var providerService = _providerIntegrationService.GetProviderService(provider);
            if (providerService == null)
            {
                return BadRequest(new { error = $"Provider service not found for: {provider}" });
            }

            // Sync with metric=true (always store in kg)
            var success = await providerService.SyncMeasurementsAsync(userGuid, true);

            if (success)
            {
                _logger.LogInformation("Successfully resynced {Provider} for user {UserId}", provider, userId);
                return Ok(new { message = $"{provider} resync completed successfully" });
            }
            else
            {
                _logger.LogError("Failed to resync {Provider} for user {UserId}", provider, userId);
                return StatusCode(500, new { error = $"Failed to resync {provider} data" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resyncing provider {Provider} for user", provider);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
