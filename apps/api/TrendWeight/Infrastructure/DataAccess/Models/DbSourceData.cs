using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using System.Text.Json;

namespace TrendWeight.Infrastructure.DataAccess.Models;

[Table("source_data")]
public class DbSourceData : BaseModel
{
    [PrimaryKey("uid")]
    [Column("uid")]
    public Guid Uid { get; set; }
    
    [PrimaryKey("provider")]
    [Column("provider")]
    public string Provider { get; set; } = string.Empty;
    
    [Column("measurements")]
    public JsonDocument Measurements { get; set; } = JsonDocument.Parse("[]");
    
    [Column("last_sync")]
    public DateTime? LastSync { get; set; }
    
    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; }
}