using FirebaseAdmin.Auth;

namespace TrendWeight.Infrastructure.Firebase;

public interface IFirebaseService
{
    Task<FirebaseToken> VerifyIdTokenAsync(string idToken);
    Task<UserRecord> GetUserAsync(string uid);
    Task<UserRecord> CreateUserAsync(string email, string password);
    Task<string> CreateCustomTokenAsync(string uid);
    Task DeleteUserAsync(string uid);
}