using System.Text.Json;
using System.Text.Json.Serialization;
using Google.Cloud.Firestore;

namespace TrendWeight.Infrastructure.Firebase;

/// <summary>
/// A custom Firestore converter that automatically converts between C# PascalCase properties
/// and Firestore camelCase fields.
/// </summary>
/// <typeparam name="T">The type to convert to/from Firestore</typeparam>
public class CamelCaseFirestoreConverter<T> : IFirestoreConverter<T> where T : class
{
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    /// <summary>
    /// Converts a .NET object to a Firestore value.
    /// Uses System.Text.Json to serialize the object with camelCase property names.
    /// </summary>
    /// <param name="value">The value to convert</param>
    /// <returns>A Dictionary representing the object with camelCase keys</returns>
    public object? ToFirestore(T value)
    {
        if (value == null) return null;
        
        // Serialize to JSON with camelCase property names
        var json = JsonSerializer.Serialize(value, _jsonOptions);
        
        // Deserialize back to a Dictionary<string, object> which Firestore can handle
        var dictionary = JsonSerializer.Deserialize<Dictionary<string, object>>(json);
        return dictionary;
    }

    /// <summary>
    /// Converts a Firestore value to a .NET object.
    /// </summary>
    /// <param name="value">The Firestore value (typically a Dictionary)</param>
    /// <returns>The deserialized .NET object</returns>
    public T FromFirestore(object value)
    {
        if (value == null) throw new ArgumentNullException(nameof(value));
        
        if (value is Dictionary<string, object> dictionary)
        {
            try
            {
                // Create a new options instance with type handling
                var options = new JsonSerializerOptions(_jsonOptions)
                {
                    // Add converter to handle numeric to string conversions
                    Converters = { new JsonStringNumberConverter() }
                };
                
                // Serialize the dictionary to JSON
                var json = JsonSerializer.Serialize(dictionary);
                
                // Deserialize to the target type, which will map camelCase JSON to PascalCase properties
                return JsonSerializer.Deserialize<T>(json, options) ?? 
                    throw new InvalidOperationException($"Failed to deserialize {typeof(T).Name}");
            }
            catch (JsonException ex)
            {
                throw new JsonException($"Error deserializing {typeof(T).Name}: {ex.Message}", ex);
            }
        }
        
        throw new ArgumentException($"Cannot convert {value.GetType()} to {typeof(T)}");
    }
}
