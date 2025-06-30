# TrendWeight C# Backend Migration Plan: Firestore to Supabase

## Overview
Migration plan to move C# backend from Firestore to Supabase using **JSON document storage** for flexibility and **feature-folder architecture** for maintainability. Includes **vendor abstraction layer** and **multi-vendor data storage** support.

## Architecture Principles

- **JSON Documents**: Use PostgreSQL JSONB for settings, links, and source data
- **Feature Folders**: Organize code by feature, not by technical layer  
- **Proven Data Models**: Mirror the exact interfaces from `lib/core/interfaces.ts`
- **Vendor Abstraction**: Common interface for all vendor integrations
- **Multi-Vendor Storage**: Separate rows per vendor for better concurrency
- **Minimal Relational**: Only use traditional columns for essential querying

## Migration Progress

### ✅ **Phase 1: Database Schema Setup**
- [ ] Create Supabase tables with JSONB columns
- [ ] Test JSONB operations
- [ ] Validate schema with sample data

### ✅ **Phase 2: Feature-Folder Structure Setup** 
- [ ] Create feature-based directory structure
- [ ] Set up vendor abstraction folders
- [ ] Validate project organization

### ✅ **Phase 3: Data Models from Legacy Interfaces**
- [ ] Create exact models from Next.js interfaces 
- [ ] Add multi-vendor support
- [ ] Validate models compile and match schema

### ✅ **Phase 4: Supabase Infrastructure**
- [ ] Add Supabase client with JSONB support
- [ ] Create SupabaseService base class
- [ ] Test basic CRUD operations

### **Phase 5: Test User Data Migration**
- [ ] Extract erv@ewal.net data from Firestore using MCP
- [ ] Transform to new schema format
- [ ] Insert into Supabase tables
- [ ] Validate data integrity

### **Phase 6: Feature Services Implementation**
- [ ] Implement UserService
- [ ] Implement VendorLinksService
- [ ] Implement MeasurementsService (per-vendor rows)
- [ ] Test all services

### **Phase 7: Vendor Abstraction Layer**
- [ ] Create IVendorService interface
- [ ] Create VendorServiceBase abstract class
- [ ] Create VendorIntegrationService orchestrator
- [ ] Test vendor abstraction

### **Phase 8: Withings Implementation**
- [ ] Implement WithingsService using abstraction
- [ ] Port token refresh logic from Next.js
- [ ] Port measurement fetching logic
- [ ] Test end-to-end Withings flow

### **Phase 9: Enhanced Controllers**
- [ ] Create DataRefreshController (multi-vendor)
- [ ] Update WithingsController for compatibility
- [ ] Add comprehensive error handling
- [ ] Test all endpoints

### **Phase 10: Integration & Testing**
- [ ] Test full refresh workflow
- [ ] Verify React dashboard integration
- [ ] Performance test with large datasets
- [ ] Document API endpoints

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    uid VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    profile_data JSONB NOT NULL, -- Full SettingsData as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Vendor Links Table  
```sql
CREATE TABLE vendor_links (
    uid VARCHAR(255) NOT NULL,
    vendor VARCHAR(50) NOT NULL, -- 'withings', 'fitbit', etc.
    link_data JSONB NOT NULL, -- VendorLink structure  
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (uid, vendor)
);
```

### Source Data Table (One Row Per Vendor)
```sql
CREATE TABLE source_data (
    uid VARCHAR(255) NOT NULL,
    vendor VARCHAR(50) NOT NULL, -- 'withings', 'fitbit', etc.
    data JSONB NOT NULL, -- Single SourceData object
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (uid, vendor)
);
```

### Indexes
```sql
CREATE INDEX idx_users_profile_data ON users USING GIN (profile_data);
CREATE INDEX idx_vendor_links_data ON vendor_links USING GIN (link_data);
CREATE INDEX idx_source_data_data ON source_data USING GIN (data);
CREATE INDEX idx_source_data_vendor ON source_data (vendor);
CREATE INDEX idx_source_data_updated ON source_data (updated_at);
```

## Feature Folder Structure

```
Features/
├── Users/
│   ├── Models/UserModels.cs
│   ├── Services/
│   │   ├── IUserService.cs
│   │   └── UserService.cs
│   └── Controllers/UsersController.cs
├── VendorLinks/
│   ├── Models/VendorLinkModels.cs
│   ├── Services/
│   │   ├── IVendorLinksService.cs
│   │   └── VendorLinksService.cs
│   └── Controllers/VendorLinksController.cs
├── Measurements/
│   ├── Models/MeasurementModels.cs
│   ├── Services/
│   │   ├── IMeasurementsService.cs
│   │   └── MeasurementsService.cs
│   └── Controllers/MeasurementsController.cs
├── Vendors/
│   ├── Abstractions/
│   │   ├── IVendorService.cs
│   │   ├── IVendorIntegrationService.cs
│   │   └── VendorServiceBase.cs
│   ├── Withings/
│   │   ├── Models/WithingsModels.cs
│   │   ├── Services/
│   │   │   ├── IWithingsService.cs
│   │   │   └── WithingsService.cs
│   │   └── Controllers/WithingsController.cs
│   ├── Fitbit/ (Future)
│   └── Services/
│       ├── IVendorIntegrationService.cs
│       └── VendorIntegrationService.cs
└── DataRefresh/
    ├── Models/RefreshModels.cs
    ├── Services/
    │   ├── IDataRefreshService.cs
    │   └── DataRefreshService.cs
    └── Controllers/DataRefreshController.cs
```

## Key Interfaces

### Vendor Abstraction
```csharp
public interface IVendorService
{
    string VendorName { get; }
    Task<AccessToken> RefreshTokenAsync(AccessToken token);
    Task<VendorMeasurementResponse> GetMeasurementsAsync(AccessToken token, bool useMetric, long startTimestamp, object? offset = null);
    bool IsTokenExpired(AccessToken token);
}

public interface IVendorIntegrationService  
{
    Task<List<SourceData>> RefreshAllVendorDataAsync(string uid, bool forceRefresh = false);
    Task<SourceData> RefreshVendorDataAsync(string uid, string vendorName, bool forceRefresh = false);
    IVendorService GetVendorService(string vendorName);
    IEnumerable<string> GetAvailableVendors();
}
```

### Measurements Service (Per-Vendor Rows)
```csharp
public interface IMeasurementsService
{
    Task<List<SourceData>> GetAllSourceDataAsync(string uid);
    Task<SourceData?> GetVendorSourceDataAsync(string uid, string vendor);
    Task UpdateVendorSourceDataAsync(string uid, SourceData sourceData);
    Task<DateTime?> GetVendorLastUpdateAsync(string uid, string vendor);
    Task<bool> HasVendorBeenUpdatedRecentlyAsync(string uid, string vendor, TimeSpan threshold);
}
```

## API Endpoints

### Multi-Vendor Data Refresh
- `GET /api/data-refresh/all?force=false` - Refresh all connected vendors
- `GET /api/data-refresh/vendor/{vendorName}?force=false` - Refresh specific vendor  
- `GET /api/data-refresh/status` - Get refresh status for all vendors

### Legacy Compatibility
- `GET /api/withings/test` - Withings-specific test endpoint (delegates to data-refresh)

## Next Steps

1. **Start with Phase 1**: Create Supabase schema
2. **Phase 5**: Migrate your test user data using Firebase MCP tools
3. **Incremental Implementation**: Build and test each phase before moving to next
4. **Validation at Each Step**: Ensure data integrity and functionality

## Benefits

1. **Vendor Agnostic**: Easy to add Fitbit/Garmin/etc.
2. **Concurrent Safe**: No vendor data conflicts
3. **Performance**: Only read/write needed vendor data
4. **Future Proof**: Proven data models from Next.js
5. **Maintainable**: Clear feature separation
6. **Debuggable**: Clear vendor data isolation

