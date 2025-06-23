using Google.Cloud.Firestore;

namespace TrendWeight.Infrastructure.Firebase;

public interface IFirestoreService
{
    /// <summary>
    /// Gets the Firestore database instance
    /// </summary>
    FirestoreDb Database { get; }
    
    /// <summary>
    /// Gets a document from a collection by its ID
    /// </summary>
    /// <typeparam name="T">The type to deserialize the document to</typeparam>
    /// <param name="collectionPath">The collection path</param>
    /// <param name="documentId">The document ID</param>
    /// <returns>The deserialized document, or default if not found</returns>
    Task<T?> GetDocumentAsync<T>(string collectionPath, string documentId);

    /// <summary>
    /// Sets a document in a collection with the specified ID
    /// </summary>
    /// <typeparam name="T">The type to serialize</typeparam>
    /// <param name="collectionPath">The collection path</param>
    /// <param name="documentId">The document ID</param>
    /// <param name="data">The data to serialize</param>
    Task SetDocumentAsync<T>(string collectionPath, string documentId, T data);
}
