using Google.Api.Gax;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.Converters;
using Google.Apis.Auth.OAuth2;
using System.Reflection;

namespace TrendWeight.Infrastructure.Firebase;

public class FirestoreService : IFirestoreService
{
    private readonly FirestoreDb _firestoreDb;
    private readonly ILogger<FirestoreService> _logger;

    public FirestoreService(FirebaseConfig config, ILogger<FirestoreService> logger)
    {
        _logger = logger;
        
        try
        {
            // Create a JSON-format service account credential string
            string jsonCred = $@"{{""type"": ""service_account"",
                ""project_id"": ""{config.ProjectId}"",
                ""private_key_id"": ""key_id"",
                ""private_key"": ""{config.PrivateKey.Replace("\\n", "\n")}"",
                ""client_email"": ""{config.ClientEmail}"",
                ""client_id"": ""client_id"",
                ""auth_uri"": ""https://accounts.google.com/o/oauth2/auth"",
                ""token_uri"": ""https://oauth2.googleapis.com/token"",
                ""auth_provider_x509_cert_url"": ""https://www.googleapis.com/oauth2/v1/certs"",
                ""client_x509_cert_url"": ""https://www.googleapis.com/robot/v1/metadata/x509/{config.ClientEmail.Replace("@", "%40")}""}}";

            // Create a credential from the JSON
            var credential = GoogleCredential.FromJson(jsonCred);
            
            // Create a custom converter registry for automatic camelCase serialization
            var registry = new ConverterRegistry
            {
                // Register our CamelCaseFirestoreConverter for specific model types
                // We'll add more types as needed
                new CamelCaseFirestoreConverter<Features.Profile.Models.ProfileData>(),
                new CamelCaseFirestoreConverter<Features.Settings.Models.SettingsData>(),
                // Add converters for Withings integration models
                new CamelCaseFirestoreConverter<Features.Vendors.Models.Links>(),
                new CamelCaseFirestoreConverter<Features.Vendors.Models.VendorLink>(),
                new CamelCaseFirestoreConverter<Features.Vendors.Models.AccessToken>()
            };
            
            // Initialize Firestore with credentials and custom converter registry
            var builder = new FirestoreDbBuilder
            {
                ProjectId = config.ProjectId,
                Credential = credential,
                ConverterRegistry = registry
            };
            
            _firestoreDb = builder.Build();
            _logger.LogInformation("Firestore initialized with project ID: {ProjectId}", config.ProjectId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Firestore with project ID: {ProjectId}", config.ProjectId);
            throw;
        }
    }

    /// <summary>
    /// Gets the Firestore database instance
    /// </summary>
    public FirestoreDb Database => _firestoreDb;

    /// <summary>
    /// Gets a document from a collection by its ID
    /// </summary>
    /// <typeparam name="T">The type to deserialize the document to</typeparam>
    /// <param name="collectionPath">The collection path</param>
    /// <param name="documentId">The document ID</param>
    /// <returns>The deserialized document, or default if not found</returns>
    public async Task<T?> GetDocumentAsync<T>(string collectionPath, string documentId)
    {
        try
        {
            DocumentReference docRef = _firestoreDb.Collection(collectionPath).Document(documentId);
            DocumentSnapshot snapshot = await docRef.GetSnapshotAsync();

            if (snapshot.Exists)
            {
                return snapshot.ConvertTo<T>();
            }

            _logger.LogWarning("Document {DocumentId} not found in collection {CollectionPath}", documentId, collectionPath);
            return default;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving document {DocumentId} from collection {CollectionPath}", documentId, collectionPath);
            throw;
        }
    }

    /// <summary>
    /// Sets a document in a collection with the specified ID
    /// </summary>
    /// <typeparam name="T">The type to serialize</typeparam>
    /// <param name="collectionPath">The collection path</param>
    /// <param name="documentId">The document ID</param>
    /// <param name="data">The data to serialize</param>
    public async Task SetDocumentAsync<T>(string collectionPath, string documentId, T data)
    {
        try
        {
            DocumentReference docRef = _firestoreDb.Collection(collectionPath).Document(documentId);
            await docRef.SetAsync(data);
            _logger.LogInformation("Document {DocumentId} set in collection {CollectionPath}", documentId, collectionPath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting document {DocumentId} in collection {CollectionPath}", documentId, collectionPath);
            throw;
        }
    }
}
