# Missing Functionality in New App

This document lists functionality that exists in the legacy Next.js app but is missing in the new Vite + React/C# API implementation.

## 1. Missing Pages

### Custom Error Pages
- **404 Error Page** (`404.tsx`) - Custom page for handling not found routes
- **500 Error Page** (`500.tsx`) - Custom page for server errors  
- **Build Page** (`build.tsx`) - Shows deployment details, git info, and environment

## 2. Missing API Endpoints

### Profile Endpoint
- **GET /api/profile** - Returns authenticated user's profile data
  - The frontend likely depends on this endpoint
  - Currently only settings endpoint returns some profile data in a different format

## 3. Progress Indicators

### NProgress Configuration
The legacy app uses NProgress with custom styling that includes:

1. **Progress Bar**: Thin bar at top of page (3px height)
2. **Spinner**: Positioned in upper right corner (top: 19px, right: 16px)
   - 18x18px circular spinner
   - Responsive positioning on mobile (right: 6px)
   
### Two Types of Progress Triggers

1. **Route Changes**
   - Configured in `_app.tsx` with Router events
   - Shows progress during page navigation

2. **Background Query Progress**
   - `BackgroundQueryProgress` component tracks React Query fetching state
   - Shows progress during API calls with 250ms delay
   - Used throughout the app, not just dashboard

### Custom Styling
- Color: `--nprogress-color: #eef5ff` (light blue)
- Includes fancy blur effect on progress bar
- Full CSS customization in `lib/shared/nprogress.css`

**Note**: Consider using [BProgress](https://bprogress.vercel.app/docs) instead of NProgress for the new implementation, as NProgress is no longer actively maintained.

## 4. Authentication Flow

### Email Verification Handler
- Legacy app handles email verification through Firebase Auth
- New app has `/auth/verify` route but needs to ensure it properly handles the email verification flow

## Notes

- **Signup page not needed**: New Supabase auth flow handles registration differently
- **Fitbit not implemented**: Legacy app mentions Fitbit but has no actual implementation
- **Settings UI not missing**: Neither app has proper settings UI, so it's not a gap
- **Provider management UI not missing**: Neither app has UI for viewing/unlinking providers
- **Settings PUT endpoint not missing**: Legacy app also only has GET endpoint for settings