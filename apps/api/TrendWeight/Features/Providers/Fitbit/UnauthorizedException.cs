namespace TrendWeight.Features.Providers.Fitbit;

/// <summary>
/// Exception thrown when Fitbit API returns unauthorized status
/// </summary>
public class UnauthorizedException : Exception
{
    public UnauthorizedException(string message) : base(message)
    {
    }

    public UnauthorizedException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
