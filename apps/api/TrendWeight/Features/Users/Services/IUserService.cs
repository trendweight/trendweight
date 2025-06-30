using TrendWeight.Infrastructure.DataAccess.Models;

namespace TrendWeight.Features.Users.Services;

public interface IUserService
{
    Task<DbUser?> GetByFirebaseUidAsync(string firebaseUid);
    Task<DbUser?> GetByIdAsync(Guid id);
    Task<DbUser?> GetByEmailAsync(string email);
    Task<DbUser> CreateAsync(DbUser user);
    Task<DbUser> UpdateAsync(DbUser user);
}