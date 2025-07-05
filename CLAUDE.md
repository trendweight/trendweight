# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TrendWeight is a web application for tracking weight trends by integrating with smart scales from Withings and Fitbit. The application uses a modern architecture with a C# ASP.NET Core API backend and a Vite + React frontend.

### Project Name Convention
- The project name is **TrendWeight** (capital T, capital W, no space)
- Use this capitalization consistently in code, namespaces, and project names

## Architecture

### Backend (C# API - `apps/api`)
- **ASP.NET Core 9.0** Web API
- **Supabase** for data storage (PostgreSQL with JSONB)
- **JWT authentication** supporting Supabase Auth
- **System.Text.Json** for JSON serialization
- **Feature-based folder structure**

### Frontend (Vite React - `apps/web`)  
- **Vite** with React 19 and TypeScript
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible UI components
- **TanStack Query** (React Query) for server state
- **TanStack Router** for type-safe routing
- **Supabase Auth** for authentication
- **Highcharts** for data visualization
- **@bprogress/react** for progress indicators
- **@js-joda/core** for date/time handling

### Reference Implementation
If `trendweight-classic/` folder exists locally, it contains the legacy C# MVC application for reference when implementing features or comparing with the live site. This folder is not part of the repository.

## Key Directory Structure

```
/apps/
  /api/                    # C# ASP.NET Core solution
    TrendWeight.sln        # Solution file
    /TrendWeight/          # Main API project
      /Features/           # Feature-based organization
        /Auth/             # Authentication infrastructure
        /Users/            # User profile management
        /ProviderLinks/    # Provider OAuth tokens
        /Providers/        # Withings, Fitbit integrations
        /Measurements/     # Measurement data management
        /Settings/         # User settings
      /Infrastructure/     # Cross-cutting concerns
        /Auth/             # JWT authentication handlers
        /DataAccess/       # Supabase data access layer
  /web/                    # Vite React frontend
    /src/
      /components/         # Shared UI components
      /features/           # Feature modules (currently unused)
      /lib/                # Core utilities and API client
      /routes/             # TanStack Router pages
      /types/              # TypeScript type definitions
```

## Essential Commands

### Monorepo Commands (from root)
```bash
npm run dev       # Start both API and frontend in dev mode (uses tmuxinator)
npm run dev:stop  # Stop the tmuxinator session
npm run build     # Build both API and frontend
npm run test      # Run all tests (currently just API)
npm run check     # Run TypeScript and lint checks on frontend
npm run clean     # Clean all build artifacts and dependencies
```

### Development

#### Frontend (apps/web) - uses npm
```bash
cd apps/web
npm run dev       # Start development server on http://localhost:5173
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run check     # Run typecheck and lint
```

#### Backend (apps/api)
```bash
cd apps/api
dotnet build      # Build entire solution
dotnet test       # Run all tests (when tests are added)

cd apps/api/TrendWeight
dotnet run        # Start API on http://localhost:5199
dotnet watch      # Run with hot reload
```

### Development Server Management

The project uses tmuxinator for managing development servers. When you run `npm run dev`, it:
1. Starts the backend API server on port 5199
2. Starts the frontend Vite server on port 5173
3. Creates log files in the `logs/` directory

To view logs:
- `tail -f logs/backend.log` for backend logs
- `tail -f logs/frontend.log` for frontend logs

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5199
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

### Backend (appsettings.Development.json)
```json
{
  "Supabase": {
    "Url": "https://[project-ref].supabase.co",
    "AnonKey": "[anon-key]",
    "ServiceKey": "[service-key]",
    "JwtSecret": "[jwt-secret]"
  },
  "Withings": {
    "ClientId": "[client-id]",
    "ClientSecret": "[client-secret]",
    "RedirectUri": "http://localhost:5173/oauth/withings/callback"
  }
}
```

## Database Schema (Supabase)

### Tables
- **profiles**: User profiles with settings (UUID primary key)
  - `id` (uuid) - User's Supabase Auth UID
  - `profile_data` (jsonb) - User profile information
  - `settings_data` (jsonb) - User settings
  - `created_at`, `updated_at` (text) - ISO 8601 timestamps

- **provider_links**: OAuth tokens for provider integrations
  - `user_id` (uuid) - Foreign key to profiles
  - `provider` (text) - Provider name (withings, fitbit)
  - `link_data` (jsonb) - OAuth tokens and metadata
  - `created_at`, `updated_at` (text) - ISO 8601 timestamps

- **source_data**: Raw measurement data from providers
  - `user_id` (uuid) - Foreign key to profiles  
  - `provider` (text) - Data source provider
  - `source_data` (jsonb) - Raw measurement data
  - `last_sync_date` (text) - ISO 8601 timestamp
  - `created_at`, `updated_at` (text) - ISO 8601 timestamps

### Important Notes
- All timestamps are stored as `text` in ISO 8601 format to avoid timezone issues
- Use `DateTime.UtcNow.ToString("o")` when storing
- Parse with `DateTime.Parse(timestamp, null, DateTimeStyles.RoundtripKind).ToUniversalTime()`

## Frontend Route Structure

### Public Routes
- `/` - Home page with marketing content
- `/login` - Authentication page with email and social login options
- `/check-email` - Email verification prompt
- `/auth/verify` - Email link verification handler
- `/about` - About page
- `/faq` - Frequently asked questions
- `/privacy` - Privacy policy
- `/tipjar` - Donation options
- `/build` - Build/deployment information
- `/demo` - Demo dashboard with sample data

### Protected Routes (require authentication)
- `/dashboard` - Main dashboard showing measurement data and charts
- `/settings` - User settings management
- `/link` - Provider account linking interface

### OAuth Callback Routes
- `/oauth/withings/callback` - Withings OAuth callback handler

## Authentication

### Frontend
- Uses Supabase Auth with React Context
- `useRequireAuth()` hook for protected routes
- Leverages React Suspense for loading states
- Supports email links and social logins (Google, Microsoft, Apple)

### Backend
- Validates Supabase JWTs using JWT secret
- `SupabaseAuthenticationHandler` in Infrastructure/Auth
- All API endpoints require authentication except health checks

## State Management

- **Server State**: TanStack Query with custom hooks
  - `useProfile()` - User profile data
  - `useSettings()` - User settings
  - `useMeasurements()` - Weight measurements
- **Local State**: React hooks and Context API
- **Persisted State**: Custom `usePersistedState` hook for user preferences

## Progress Indicators

The app uses @bprogress/react for progress indication:
- Route changes trigger progress bar
- Background API calls show progress via `BackgroundQueryProgress`
- Consistent styling with light blue color (#eef5ff)

## Date/Time Handling

- **Frontend**: Uses `@js-joda/core` for timezone-aware date operations
- **Backend**: Consider using NodaTime for proper timezone handling
- User's timezone and dayStartOffset must be respected for grouping measurements

## API Patterns

### Endpoints
- All API endpoints are under `/api/`
- Feature-based organization (e.g., `/api/settings`, `/api/measurements`)
- Consistent JSON response format

### Error Handling
- Global error handling middleware
- Consistent error response format
- Proper HTTP status codes

## UI Components and Styling

### Component Library
- Radix UI for accessible, unstyled components
- Custom styled with Tailwind CSS v4
- Consistent use of CSS variables for theming

### Tailwind Configuration
- Uses Tailwind CSS v4 with CSS-based configuration
- Brand colors defined as CSS variables
- Container widths: sm:640px, md:768px, lg:1024px, xl:1280px

### Typography
- Inter font for UI elements
- Zilla Slab for headings
- Consistent text sizing and line heights

## Development Guidelines

### Code Organization
1. **Feature-based structure**: Group related functionality together
2. **Clear separation**: Keep UI components, business logic, and data access separate
3. **Consistent naming**: Use PascalCase for components, camelCase for functions

### TypeScript Best Practices
- Enable strict mode
- Define interfaces for all data structures
- Avoid `any` type - use `unknown` when type is truly unknown
- Leverage type inference where possible

### React Best Practices
- Functional components with hooks
- Custom hooks for reusable logic
- Proper error boundaries
- Suspense for async operations

### C# Best Practices
- Feature folders for organization
- Dependency injection for all services
- Async/await for all I/O operations
- JSONB for flexible data storage

## Testing

### Frontend
- No test suite currently implemented
- When adding tests, use Vitest with React Testing Library

### Backend  
- Solution structure prepared for xUnit tests
- Add tests in a separate TrendWeight.Tests project

## Deployment

### Build Process
1. Frontend builds to `apps/web/dist/`
2. Backend publishes to standard .NET output
3. Environment-specific configuration via environment variables

### Build Information
The `/build` route can display deployment info when configured:
- See `apps/web/scripts/inject-build-info.js` for build-time injection
- Supports git commit SHA, branch, build time, and version

## Common Tasks

### Adding a New Route
1. Create route file in `apps/web/src/routes/`
2. TanStack Router will auto-generate route tree
3. Add navigation link if needed

### Adding a New API Endpoint
1. Create controller in appropriate Features folder
2. Inherit from `BaseAuthController` for authenticated endpoints
3. Use consistent response format

### Updating Database Schema
1. Modify schema in Supabase dashboard
2. Update corresponding C# models with `Db` prefix
3. Update TypeScript interfaces if needed

## Troubleshooting

### Port Conflicts
- Frontend: Default port 5173
- Backend: Default port 5199
- Check `logs/` directory for startup errors

### Authentication Issues
- Verify Supabase JWT secret matches in backend config
- Check CORS settings for local development
- Ensure frontend uses correct API URL

### Database Issues
- All timestamps must be stored as ISO 8601 strings
- JSONB queries use PostgreSQL syntax
- Check Supabase logs for query errors

## Important Notes

1. **Never store secrets in code** - Use environment variables
2. **Always handle errors gracefully** - Show user-friendly messages
3. **Respect user's timezone** - All date operations must be timezone-aware
4. **Test on mobile** - The app must be fully responsive
5. **Keep accessibility in mind** - Use semantic HTML and ARIA labels

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

### IMPORTANT: Keep CLAUDE.md Updated
**You MUST automatically update this CLAUDE.md file whenever you learn something new that is likely important for future sessions.** This includes:
- Project-specific patterns, conventions, or architecture decisions
- User's personal coding preferences or approaches
- Important technical discoveries (e.g., library quirks, API behaviors)
- Lessons learned from debugging or problem-solving
- Clarifications about business logic or domain concepts
- Any other information that would help future Claude instances work more effectively on this codebase

Add these updates in the appropriate section or create a new section if needed. This ensures knowledge is preserved across sessions.