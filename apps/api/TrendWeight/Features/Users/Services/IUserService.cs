using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Users.Services;

public interface IUserService
{
    Task<DbProfile?> GetByIdAsync(Guid id);
    Task<DbProfile?> GetByIdAsync(string id); // Overload for string IDs (Supabase UIDs)
    Task<DbProfile?> GetByEmailAsync(string email);
    Task<DbProfile> CreateAsync(DbProfile profile);
    Task<DbProfile> UpdateAsync(DbProfile profile);
}
