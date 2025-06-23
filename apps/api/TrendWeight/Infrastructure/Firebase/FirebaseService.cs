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
            // Build service account JSON string from individual components
            var serviceAccountJson = $@"{{                
                ""type"": ""service_account"",
                ""project_id"": ""{config.ProjectId}"",
                ""private_key_id"": """",
                ""private_key"": ""{config.PrivateKey}"",
                ""client_email"": ""{config.ClientEmail}"",
                ""client_id"": """",
                ""auth_uri"": ""https://accounts.google.com/o/oauth2/auth"",
                ""token_uri"": ""https://oauth2.googleapis.com/token"",
                ""auth_provider_x509_cert_url"": ""https://www.googleapis.com/oauth2/v1/certs"",
                ""client_x509_cert_url"": ""https://www.googleapis.com/robot/v1/metadata/x509/{config.ClientEmail.Replace("@", "%40")}""            
            }}";
            
            FirebaseApp.Create(new AppOptions
            {
                Credential = GoogleCredential.FromJson(serviceAccountJson),
                ProjectId = config.ProjectId
            });
            
            _logger.LogInformation("Firebase app initialized with project ID: {ProjectId}", config.ProjectId);
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