using System.Text.Json;
using System.Text.Json.Serialization;

namespace TrendWeight.Infrastructure.Firebase;

/// <summary>
/// Custom JSON converter that allows numeric values to be deserialized into string properties.
/// This is useful when dealing with external data sources that might represent IDs as numbers
/// but we want to store them as strings in our C# models.
/// </summary>
public class JsonStringNumberConverter : JsonConverter<string>
{
    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Handle different JSON token types
        return reader.TokenType switch
        {
            // If it's already a string, just return it
            JsonTokenType.String => reader.GetString(),
            
            // Convert numbers to strings
            JsonTokenType.Number => reader.TryGetInt64(out long longValue) 
                ? longValue.ToString() 
                : reader.GetDouble().ToString(),
            
            // Handle null
            JsonTokenType.Null => null,
            
            // For any other type, throw an exception
            _ => throw new JsonException($"Unable to convert {reader.TokenType} to {typeToConvert}")
        };
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // When writing, just write the string value
        writer.WriteStringValue(value);
    }
}
