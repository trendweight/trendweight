using Microsoft.AspNetCore.Authorization;
using TrendWeight.Infrastructure.Firebase;
using TrendWeight.Infrastructure.Middleware;
using Google.Cloud.Firestore;
using TrendWeight.Features.Vendors.Withings;

namespace TrendWeight.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddFirebaseAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Configure Firebase
        var firebaseConfig = new FirebaseConfig();
        configuration.GetSection("Firebase").Bind(firebaseConfig);
        services.AddSingleton(firebaseConfig);
        services.AddSingleton<IFirebaseService, FirebaseService>();

        // Configure authentication
        services.AddAuthentication("Firebase")
            .AddScheme<FirebaseAuthenticationSchemeOptions, FirebaseAuthenticationHandler>("Firebase", null);

        // Configure authorization
        services.AddAuthorization(options =>
        {
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
        });

        return services;
    }

    public static IServiceCollection AddTrendWeightServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Register Firestore service
        services.AddSingleton<IFirestoreService, FirestoreService>();
        
        // Register Withings service
        var withingsConfig = new WithingsConfig();
        configuration.GetSection("Withings").Bind(withingsConfig);
        services.AddSingleton(withingsConfig);
        services.AddHttpClient<IWithingsService, WithingsService>();
        
        // Add feature services as we implement them
        // services.AddScoped<IMeasurementService, MeasurementService>();
        // services.AddScoped<IProfileService, ProfileService>();
        // services.AddScoped<ISettingsService, SettingsService>();
        
        return services;
    }
}