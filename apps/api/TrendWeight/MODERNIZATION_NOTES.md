# Modernization Notes for C# API

## Improvements over Legacy Implementation

### 1. Date/Time Handling
**Legacy**: Uses @js-joda/core and spacetime for robust timezone math
- Critical for grouping measurements by user's local day
- Handles dayStartOffset (e.g., day starts at 3am for night shift workers)

**Modern C# API**: 
- Use NodaTime library (the .NET port of Joda-Time)
- DateTimeOffset is NOT sufficient for timezone math
- Store user's timezone ID (e.g., "America/New_York") not offset
- Convert vendor timestamps to user's local dates accounting for DST

**Modern TypeScript Client**:
- Continue using @js-joda/core or consider Temporal API when stable
- Day boundaries must respect user's timezone AND dayStartOffset
- Example: Measurement at 2am should count for previous day if dayStartOffset=3

### 2. Data Models  
**Legacy**: Stores raw measurements with interpolation done client-side
**Modern**: Keep calculations client-side (same as legacy)
- Why: Users may want to change their dayStartOffset or timezone retroactively
- Trend calculations depend on the ORDER of measurements by user's local day
- Caching would be complex with timezone/offset changes
- Client has all data needed and calculations are fast
- Matches user expectations from legacy app

### 3. Firebase Structure
**Legacy**: Nested collections (source-data/uid/sources/withings)
**Modern**: Keep similar structure but with improvements
- Nested structure actually makes sense here - data is always accessed by user
- But DO use Firestore's built-in timestamp fields
- Consider adding indexes for common queries
- Add proper security rules from the start

### 4. Authentication
**Legacy**: Custom JWT tokens with Firebase Auth
**Modern**: Use Firebase Auth SDK directly
- No need for custom JWT handling
- Firebase SDK handles token refresh automatically
- Better security with built-in Firebase features

### 5. API Design
**Legacy**: Separate endpoints for each operation
**Modern**: RESTful resource-based design with proper HTTP verbs
- GET /api/measurements - list all
- GET /api/measurements/{date} - get specific day
- POST /api/measurements/sync - trigger vendor sync
- Use async/await throughout (no callbacks)

### 6. Vendor Integration
**Legacy**: Direct OAuth implementation
**Modern**: Use vendor SDKs where available
- Fitbit has an official SDK
- OAuth 2.0 libraries for Withings
- Better error handling with Polly for retries

### 7. Number Types
**Legacy**: Uses JavaScript numbers (with floating point issues)
**Modern**: Use decimal in C# for weights and percentages
- Avoids floating point errors (0.1 + 0.2 = 0.3, not 0.30000000000000004)
- User enters "150.3 lbs" and expects to see exactly that
- Convert from double when receiving from vendors
- Exponential smoothing (0.1M factor) works fine with decimal
- Better for any arithmetic operations on weights

### 8. Validation
**Legacy**: Minimal validation
**Modern**: Use FluentValidation
- Strongly typed validation rules
- Better error messages
- Reusable validation logic

### 9. Background Jobs
**Legacy**: Unclear how sync happens
**Modern**: Use Hangfire or similar for background jobs
- Scheduled syncs with vendors
- Retry failed syncs
- Better visibility into job status

### 10. Caching
**Legacy**: No apparent caching
**Modern**: Use IMemoryCache for frequently accessed data
- Cache user profiles
- Cache recent measurements
- Cache trend calculations

## Migration Strategy

Since we're not maintaining compatibility:
1. Design ideal API first
2. Import legacy data with one-time migration
3. Focus on better user experience over legacy patterns
4. Use modern C# features (records, pattern matching, etc.)