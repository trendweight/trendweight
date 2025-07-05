# API Endpoint Comparison: Legacy Next.js vs New C# API

## Summary

This document compares the API endpoints between the legacy Next.js implementation and the new C# API to identify missing functionality.

## Legacy Next.js API Routes (apps/legacy-nextjs/pages/api/)

1. **`/api/ping`** - Health check endpoint
   - Returns current date/time
   - No authentication required

2. **`/api/profile`** - Get authenticated user's profile
   - Requires authentication
   - Returns user profile data

3. **`/api/profile/[id]`** - Get profile by ID (TEST ENDPOINT)
   - Returns hardcoded sample profile data
   - No authentication required

4. **`/api/settings`** - Get/update user settings
   - Requires authentication
   - Returns user settings data

5. **`/api/data`** - Get measurement data
   - Requires authentication
   - Refreshes data from providers if needed
   - Returns array of SourceData

6. **`/api/withings/link`** - Initiate Withings OAuth flow
   - Requires authentication
   - Returns authorization URL

7. **`/api/withings/callback`** - Handle Withings OAuth callback
   - No authentication required (uses signed state)
   - Exchanges code for token and stores link

## New C# API Endpoints (apps/api/TrendWeight/)

### Implemented Endpoints

1. **`GET /`** - Health check (in Program.cs)
   - Returns API status
   - No authentication required

2. **`GET /api/settings`** - Get user settings
   - Requires authentication
   - Returns user settings data
   - ✅ Matches legacy `/api/settings` GET functionality

3. **`GET /api/data`** - Get measurement data
   - Requires authentication
   - Auto-refreshes data if stale (5 min cache)
   - Returns array of SourceData
   - ✅ Matches legacy `/api/data` functionality

4. **`POST /api/data/refresh`** - Force refresh all providers
   - Requires authentication
   - Returns sync status for each provider

5. **`POST /api/data/refresh/{provider}`** - Force refresh specific provider
   - Requires authentication
   - Returns sync status for the provider

6. **`GET /api/withings/link`** - Get Withings authorization URL
   - Requires authentication
   - Returns authorization URL and state
   - ✅ Matches legacy `/api/withings/link` functionality

7. **`GET /api/withings/callback`** - Handle Withings OAuth callback
   - No authentication required (uses signed JWT state)
   - Exchanges code for token, stores link, redirects to frontend
   - ✅ Matches legacy `/api/withings/callback` functionality

### Missing Endpoints in C# API

1. **`/api/ping`** - Simple ping endpoint
   - While there's a health check at `/`, no exact `/api/ping` equivalent
   - **Priority: Low** (health check exists at root)

2. **`/api/profile`** - Get authenticated user's profile
   - **Priority: HIGH** - This is needed for the frontend to display user profile information
   - The settings endpoint returns some profile data but not in the same format

3. **`/api/profile/[id]`** - Get profile by ID
   - Test endpoint with hardcoded data
   - **Priority: Low** (test endpoint)

4. **`PUT /api/settings`** - Update user settings
   - The C# API only has GET for settings, no UPDATE
   - **Priority: HIGH** - Users need to be able to update their settings

## Additional Endpoints in C# API (Not in Legacy)

1. **`POST /api/data/refresh`** - Force refresh all providers
2. **`POST /api/data/refresh/{provider}`** - Force refresh specific provider

These are enhancements over the legacy API which only auto-refreshed on GET.

## Recommendations

### High Priority - Implement These Next

1. **Profile Endpoint** (`GET /api/profile`)
   - Create a ProfileController in Features/Profile/
   - Return ProfileData matching the legacy format
   - This is critical for the dashboard and other UI components

2. **Settings Update** (`PUT /api/settings`)
   - Add PUT method to existing SettingsController
   - Accept SettingsData in request body
   - Update user profile in database
   - Return updated settings

### Low Priority

1. **Ping Endpoint** (`GET /api/ping`)
   - Optional since health check exists at root
   - Could add for exact API compatibility if needed

### Future Considerations

1. **Fitbit Integration** - No Fitbit endpoints exist in either API yet
2. **User Management** - No user creation/deletion endpoints (handled by auth provider)
3. **Data Export** - No endpoints for exporting user data
4. **Public Profiles** - No endpoints for sharing/viewing public profiles