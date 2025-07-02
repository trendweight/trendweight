using TrendWeight.Infrastructure.DataAccess;
using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Users.Services;

public class UserService : IUserService
{
    private readonly ISupabaseService _supabaseService;
    private readonly ILogger<UserService> _logger;

    public UserService(ISupabaseService supabaseService, ILogger<UserService> logger)
    {
        _supabaseService = supabaseService;
        _logger = logger;
    }


    public async Task<DbProfile?> GetByIdAsync(Guid id)
    {
        return await _supabaseService.GetByIdAsync<DbProfile>(id);
    }

    public async Task<DbProfile?> GetByIdAsync(string id)
    {
        // Parse as GUID (Supabase UIDs are UUIDs)
        if (Guid.TryParse(id, out var guid))
        {
            return await GetByIdAsync(guid);
        }
        
        _logger.LogWarning("Invalid user ID format: {Id}", id);
        return null;
    }

    public async Task<DbProfile?> GetByEmailAsync(string email)
    {
        try
        {
            var profiles = await _supabaseService.QueryAsync<DbProfile>(query =>
                query.Filter("email", Supabase.Postgrest.Constants.Operator.Equals, email)
            );
            
            return profiles.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email {Email}", email);
            return null;
        }
    }

    public async Task<DbProfile> CreateAsync(DbProfile profile)
    {
        return await _supabaseService.InsertAsync(profile);
    }

    public async Task<DbProfile> UpdateAsync(DbProfile profile)
    {
        return await _supabaseService.UpdateAsync(profile);
    }
}