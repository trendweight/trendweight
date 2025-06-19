using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace TrendWeight.Infrastructure.Firebase;

public class FirebaseService : IFirebaseService
{
    private readonly FirebaseAuth _firebaseAuth;
    private readonly ILogger<FirebaseService> _logger;

    public FirebaseService(FirebaseConfig config, ILogger<FirebaseService> logger)
    {
        _logger = logger;
        
        if (FirebaseApp.DefaultInstance == null)
        {
            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.FromJson(config.ServiceAccountKeyJson),
                ProjectId = config.ProjectId
            });
        }

        _firebaseAuth = FirebaseAuth.DefaultInstance;
    }

    public async Task<FirebaseToken> VerifyIdTokenAsync(string idToken)
    {
        try
        {
            return await _firebaseAuth.VerifyIdTokenAsync(idToken);
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Failed to verify Firebase ID token");
            throw;
        }
    }

    public async Task<UserRecord> GetUserAsync(string uid)
    {
        try
        {
            return await _firebaseAuth.GetUserAsync(uid);
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Failed to get user with UID: {Uid}", uid);
            throw;
        }
    }

    public async Task<UserRecord> CreateUserAsync(string email, string password)
    {
        try
        {
            var args = new UserRecordArgs
            {
                Email = email,
                Password = password,
                EmailVerified = false
            };
            
            return await _firebaseAuth.CreateUserAsync(args);
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Failed to create user with email: {Email}", email);
            throw;
        }
    }

    public async Task<string> CreateCustomTokenAsync(string uid)
    {
        try
        {
            return await _firebaseAuth.CreateCustomTokenAsync(uid);
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Failed to create custom token for UID: {Uid}", uid);
            throw;
        }
    }

    public async Task DeleteUserAsync(string uid)
    {
        try
        {
            await _firebaseAuth.DeleteUserAsync(uid);
        }
        catch (FirebaseAuthException ex)
        {
            _logger.LogError(ex, "Failed to delete user with UID: {Uid}", uid);
            throw;
        }
    }
}