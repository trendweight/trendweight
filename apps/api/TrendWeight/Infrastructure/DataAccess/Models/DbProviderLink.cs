using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using TrendWeight.Features.Providers.Models;

namespace TrendWeight.Infrastructure.DataAccess.Models;

[Table("provider_links")]
public class DbProviderLink : BaseModel
{
    [PrimaryKey("uid")]
    [Column("uid")]
    public Guid Uid { get; set; }
    
    [PrimaryKey("provider")]
    [Column("provider")]
    public string Provider { get; set; } = string.Empty;
    
    [Column("token")]
    public AccessToken Token { get; set; } = new();
    
    [Column("update_reason")]
    public string? UpdateReason { get; set; }
    
    [Column("updated_at")]
    public string UpdatedAt { get; set; } = string.Empty;
}