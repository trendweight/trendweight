namespace TrendWeight.Features.Providers.Exceptions;

/// <summary>
/// Exception thrown when a provider's API returns an error
/// </summary>
public class ProviderApiException : Exception
{
    /// <summary>
    /// The provider that returned the error
    /// </summary>
    public string Provider { get; }

    /// <summary>
    /// The error code from the provider (if available)
    /// </summary>
    public string? ErrorCode { get; }

    /// <summary>
    /// The status code from the provider (if available)
    /// </summary>
    public int? StatusCode { get; }

    public ProviderApiException(string provider, string message, string? errorCode = null, int? statusCode = null)
        : base(message)
    {
        Provider = provider;
        ErrorCode = errorCode;
        StatusCode = statusCode;
    }

    public ProviderApiException(string provider, string message, string? errorCode, int? statusCode, Exception innerException)
        : base(message, innerException)
    {
        Provider = provider;
        ErrorCode = errorCode;
        StatusCode = statusCode;
    }
}
