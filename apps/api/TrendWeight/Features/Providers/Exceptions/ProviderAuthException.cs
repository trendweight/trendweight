namespace TrendWeight.Features.Providers.Exceptions;

/// <summary>
/// Exception thrown when a provider's authentication fails and cannot be recovered
/// </summary>
public class ProviderAuthException : Exception
{
    /// <summary>
    /// The provider that failed authentication
    /// </summary>
    public string Provider { get; }

    /// <summary>
    /// The original error code from the provider (if available)
    /// </summary>
    public string? ErrorCode { get; }

    public ProviderAuthException(string provider, string message, string? errorCode = null)
        : base(message)
    {
        Provider = provider;
        ErrorCode = errorCode;
    }

    public ProviderAuthException(string provider, string message, string? errorCode, Exception innerException)
        : base(message, innerException)
    {
        Provider = provider;
        ErrorCode = errorCode;
    }
}
