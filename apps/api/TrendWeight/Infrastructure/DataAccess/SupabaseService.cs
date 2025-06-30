using Supabase;
using Supabase.Postgrest.Models;

namespace TrendWeight.Infrastructure.DataAccess;

public class SupabaseService : ISupabaseService
{
    private readonly Client _supabaseClient;
    private readonly ILogger<SupabaseService> _logger;

    public SupabaseService(SupabaseConfig config, ILogger<SupabaseService> logger)
    {
        _logger = logger;
        
        var options = new SupabaseOptions
        {
            AutoRefreshToken = true,
            AutoConnectRealtime = false
        };
        
        _supabaseClient = new Client(config.Url, config.ServiceKey, options);
        var initTask = _supabaseClient.InitializeAsync();
        initTask.Wait(); // Wait for initialization
        _logger.LogInformation("Supabase client initialized for URL: {Url}", config.Url);
    }

    public async Task<T?> GetByIdAsync<T>(Guid id) where T : BaseModel, new()
    {
        try
        {
            var response = await _supabaseClient.From<T>()
                .Filter("uid", Supabase.Postgrest.Constants.Operator.Equals, id.ToString())
                .Single();
            
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting {Type} by ID {Id}", typeof(T).Name, id);
            return null;
        }
    }

    public async Task<T?> GetByIdAsync<T>(string id) where T : BaseModel, new()
    {
        try
        {
            var response = await _supabaseClient.From<T>()
                .Filter("uid", Supabase.Postgrest.Constants.Operator.Equals, id)
                .Single();
            
            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting {Type} by ID {Id}", typeof(T).Name, id);
            return null;
        }
    }

    public async Task<List<T>> GetAllAsync<T>() where T : BaseModel, new()
    {
        try
        {
            var response = await _supabaseClient.From<T>()
                .Get();
            
            return response.Models;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all {Type}", typeof(T).Name);
            return new List<T>();
        }
    }

    public async Task<T> InsertAsync<T>(T model) where T : BaseModel, new()
    {
        try
        {
            var response = await _supabaseClient.From<T>()
                .Insert(model);
            
            return response.Models.First();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error inserting {Type}", typeof(T).Name);
            throw;
        }
    }

    public async Task<T> UpdateAsync<T>(T model) where T : BaseModel, new()
    {
        try
        {
            var response = await _supabaseClient.From<T>()
                .Update(model);
            
            return response.Models.First();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating {Type}", typeof(T).Name);
            throw;
        }
    }

    public async Task DeleteAsync<T>(T model) where T : BaseModel, new()
    {
        try
        {
            await _supabaseClient.From<T>()
                .Delete(model);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting {Type}", typeof(T).Name);
            throw;
        }
    }

    public async Task<List<T>> QueryAsync<T>(Action<Supabase.Interfaces.ISupabaseTable<T, Supabase.Realtime.RealtimeChannel>> query) where T : BaseModel, new()
    {
        try
        {
            var table = _supabaseClient.From<T>();
            query(table);
            var response = await table.Get();
            
            return response.Models;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error querying {Type}", typeof(T).Name);
            return new List<T>();
        }
    }
}