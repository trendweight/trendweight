using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TrendWeight.Features.ProviderLinks.Services;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.Providers;

[ApiController]
[Route("api/providers")]
[Authorize]
public class ProvidersController : ControllerBase
{
    private readonly IProviderLinkService _providerLinkService;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(
        IProviderLinkService providerLinkService,
        ILogger<ProvidersController> logger)
    {
        _providerLinkService = providerLinkService;
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

            // TODO: Trigger actual resync logic here
            // For now, just return success
            _logger.LogInformation("Triggered resync for {Provider} for user {UserId}", provider, userId);
            return Ok(new { message = $"{provider} resync initiated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resyncing provider {Provider} for user", provider);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}
