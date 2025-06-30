using TrendWeight.Infrastructure.DataAccess;
using TrendWeight.Infrastructure.DataAccess.Models;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Features.ProviderLinks.Services;

public class ProviderLinkService : IProviderLinkService
{
    private readonly ISupabaseService _supabaseService;
    private readonly ILogger<ProviderLinkService> _logger;

    public ProviderLinkService(ISupabaseService supabaseService, ILogger<ProviderLinkService> logger)
    {
        _supabaseService = supabaseService;
        _logger = logger;
    }

    public async Task<DbProviderLink?> GetAsync(Guid uid, string provider)
    {
        try
        {
            var links = await _supabaseService.QueryAsync<DbProviderLink>(query =>
                query.Filter("uid", Supabase.Postgrest.Constants.Operator.Equals, uid.ToString())
                     .Filter("provider", Supabase.Postgrest.Constants.Operator.Equals, provider)
            );
            
            return links.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider link for user {Uid} and provider {Provider}", uid, provider);
            return null;
        }
    }

    public async Task<List<DbProviderLink>> GetAllForUserAsync(Guid uid)
    {
        try
        {
            return await _supabaseService.QueryAsync<DbProviderLink>(query =>
                query.Filter("uid", Supabase.Postgrest.Constants.Operator.Equals, uid.ToString())
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting provider links for user {Uid}", uid);
            return new List<DbProviderLink>();
        }
    }

    public async Task<DbProviderLink> CreateAsync(DbProviderLink providerLink)
    {
        providerLink.UpdatedAt = DateTime.UtcNow;
        return await _supabaseService.InsertAsync(providerLink);
    }

    public async Task<DbProviderLink> UpdateAsync(DbProviderLink providerLink)
    {
        providerLink.UpdatedAt = DateTime.UtcNow;
        return await _supabaseService.UpdateAsync(providerLink);
    }

    public async Task DeleteAsync(Guid uid, string provider)
    {
        var providerLink = await GetAsync(uid, provider);
        if (providerLink != null)
        {
            await _supabaseService.DeleteAsync(providerLink);
        }
    }
    
    public Task<DbProviderLink?> GetProviderLinkAsync(Guid uid, string provider)
    {
        return GetAsync(uid, provider);
    }
    
    public Task RemoveProviderLinkAsync(Guid uid, string provider)
    {
        return DeleteAsync(uid, provider);
    }
    
    public async Task StoreProviderLinkAsync(Guid uid, string provider, AccessToken token, string? updateReason = null)
    {
        var existingLink = await GetAsync(uid, provider);
        
        if (existingLink != null)
        {
            // Update existing link
            existingLink.Token = token;
            existingLink.UpdateReason = updateReason;
            await UpdateAsync(existingLink);
        }
        else
        {
            // Create new link
            var newLink = new DbProviderLink
            {
                Uid = uid,
                Provider = provider,
                Token = token,
                UpdateReason = updateReason,
                UpdatedAt = DateTime.UtcNow
            };
            await CreateAsync(newLink);
        }
    }
}