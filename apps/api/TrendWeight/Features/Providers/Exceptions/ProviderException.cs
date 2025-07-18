using System.Net;

namespace TrendWeight.Features.Providers.Exceptions;

/// <summary>
/// Exception thrown when provider API calls fail
/// </summary>
public class ProviderException : Exception
{
    /// <summary>
    /// HTTP status code from the provider
    /// </summary>
    public HttpStatusCode StatusCode { get; }

    /// <summary>
    /// Error code for programmatic handling
    /// </summary>
    public string ErrorCode { get; }

    /// <summary>
    /// Whether the error is retryable
    /// </summary>
    public bool IsRetryable { get; }

    public ProviderException(string message, HttpStatusCode statusCode, string errorCode, bool isRetryable)
        : base(message)
    {
        StatusCode = statusCode;
        ErrorCode = errorCode;
        IsRetryable = isRetryable;
    }
}
