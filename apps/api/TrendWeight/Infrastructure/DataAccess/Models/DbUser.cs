using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;
using TrendWeight.Features.Profile.Models;

namespace TrendWeight.Infrastructure.DataAccess.Models;

[Table("users")]
public class DbUser : BaseModel
{
    [PrimaryKey("uid")]
    public Guid Uid { get; set; }
    
    [Column("firebase_uid")]
    public string? FirebaseUid { get; set; }
    
    [Column("email")]
    public string Email { get; set; } = string.Empty;
    
    [Column("profile")]
    public ProfileData Profile { get; set; } = new();
    
    [Column("created_at")]
    public string CreatedAt { get; set; } = string.Empty;
    
    [Column("updated_at")]
    public string UpdatedAt { get; set; } = string.Empty;
}