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

    public async Task<DbUser?> GetByFirebaseUidAsync(string firebaseUid)
    {
        try
        {
            var users = await _supabaseService.QueryAsync<DbUser>(query =>
                query.Filter("firebase_uid", Supabase.Postgrest.Constants.Operator.Equals, firebaseUid)
            );
            
            return users.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by Firebase UID {FirebaseUid}", firebaseUid);
            return null;
        }
    }

    public async Task<DbUser?> GetByIdAsync(Guid id)
    {
        return await _supabaseService.GetByIdAsync<DbUser>(id);
    }

    public async Task<DbUser?> GetByEmailAsync(string email)
    {
        try
        {
            var users = await _supabaseService.QueryAsync<DbUser>(query =>
                query.Filter("email", Supabase.Postgrest.Constants.Operator.Equals, email)
            );
            
            return users.FirstOrDefault();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email {Email}", email);
            return null;
        }
    }

    public async Task<DbUser> CreateAsync(DbUser user)
    {
        return await _supabaseService.InsertAsync(user);
    }

    public async Task<DbUser> UpdateAsync(DbUser user)
    {
        return await _supabaseService.UpdateAsync(user);
    }
}