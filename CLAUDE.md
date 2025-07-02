# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TrendWeight is a web application for tracking weight trends by integrating with Withings and Fitbit devices. The application is being rebuilt as a C# ASP.NET Core API backend with a Vite + React frontend.

## IMPORTANT: Architecture Migration in Progress

**The application is being rebuilt with a new architecture. See `MIGRATION_PLAN_V2.md` for details.**

### Note on Naming
- The project name is **TrendWeight** (capital T, capital W, no space)
- Use this capitalization consistently in code, namespaces, and project names

### Note on Compatibility
- **The legacy system is NOT live and has NO active users**
- We are NOT maintaining backward compatibility
- This is a greenfield rebuild with freedom to modernize
- Use modern patterns and libraries rather than mimicking legacy approaches

The new architecture:
- **Backend**: C# ASP.NET Core API (replacing Next.js API routes)
- **Frontend**: Vite + React SPA (replacing Next.js)
- **Styling**: Tailwind CSS v4 + Radix UI (replacing Chakra UI)
- **Auth**: Firebase Auth (current), planned migration to Supabase Auth
- **Storage**: Supabase (PostgreSQL with JSONB) replacing Firestore

The current Next.js app (`apps/legacy-nextjs`) remains as a reference implementation during development.

## Essential Commands

**IMPORTANT: The frontend (apps/web) uses npm. The legacy app (apps/legacy-nextjs) uses pnpm.**

### Monorepo Commands (from root)
```bash
npm run dev       # Start both API and frontend in dev mode
npm run build     # Build both API and frontend
npm run test      # Run all tests (currently just API)
npm run check     # Run TypeScript and lint checks on frontend
npm run clean     # Clean all build artifacts and dependencies
```

### Development

#### Frontend (Vite React) - uses npm
```bash
cd apps/web
npm run dev       # Start development server on http://localhost:3000
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run check     # Run typecheck and lint
```

#### Backend (C# API)
```bash
cd apps/api
dotnet build      # Build entire solution
dotnet test       # Run all tests (when tests are added)

cd apps/api/TrendWeight
dotnet run        # Start API on http://localhost:5199
dotnet watch      # Run with hot reload
```

#### Legacy Reference (uses pnpm)
```bash
cd apps/legacy-nextjs
pnpm dev          # Start on http://localhost:3001
```

### Code Quality

The project uses Husky pre-commit hooks that automatically run pretty-quick to format staged files.

## Architecture Overview

### Current Stack

#### Backend (C# API - `apps/api`)
- **ASP.NET Core 9.0** Web API
- **Firebase Admin SDK** for JWT authentication
- **Supabase** for data storage (PostgreSQL with JSONB)
- **System.Text.Json** for JSON serialization

#### Frontend (Vite React - `apps/web`)
- **Vite** with React and TypeScript
- **Tailwind CSS v4** + Radix UI
- **TanStack Query** (React Query) for server state
- **TanStack Router** for routing
- **Firebase JS SDK** for authentication

#### Legacy Reference (`apps/legacy-nextjs`)
- **Next.js 13.4.4** with Pages Router
- **Chakra UI** component library
- **Firebase/Firestore** for data

### Key Directory Structure

```
/apps/
  /api/                    # C# ASP.NET Core solution
    TrendWeight.sln        # Solution file
    /TrendWeight/          # Main API project
      /Features/           # Feature-based organization
        /Users/            # User management
        /ProviderLinks/    # Provider OAuth tokens (renamed from VendorLinks)
        /Providers/        # Withings, Fitbit integrations (renamed from Vendors)
        /Measurements/     # Measurement data management
        /Settings/         # User settings
      /Infrastructure/     # Cross-cutting concerns
        /Firebase/         # Firebase Auth (still used for authentication)
        /DataAccess/       # Supabase data access layer
  /web/                    # Vite React frontend
    /src/
      /components/         # Shared UI components
      /features/           # Feature modules
      /lib/                # Utilities and API client
      /routes/             # TanStack Router pages
  /legacy-nextjs/          # Reference implementation
```

### API Route Pattern

API routes use a consistent middleware pattern:

```typescript
// Example from pages/api/settings.ts
export default checkAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  // Handler implementation
});
```

The `checkAuth` middleware validates JWT tokens and provides user context.

### State Management

- Server state: React Query with custom hooks (e.g., `useProfile`, `useSettings`)
- Local state: React hooks and Context API (see `DashboardProvider`)
- Persisted state: `use-persisted-state` for user preferences

### Date/Time Handling

The app uses multiple date libraries:

- `@js-joda/core` for core date operations
- `spacetime` for timezone conversions
- Date formatting should preserve user's timezone settings

### Environment Variables

C# API (`appsettings.Development.json`):
- Firebase project configuration
- Supabase connection (URL, keys)
- Withings OAuth credentials

Frontend:
- Firebase configuration (public keys)
- API endpoint URL

## Development Notes

### CRITICAL: Thorough Analysis Before Implementation

**You MUST follow this process for EVERY architectural decision:**

1. **Deep Analysis Phase** (BEFORE writing any code)
   - Read ALL relevant legacy code, not just snippets
   - Understand WHY things were done a certain way
   - Document what you learn
   - Consider multiple implementation approaches
   - Think through implications and edge cases
   - Research best practices for the specific problem

2. **Planning Phase**
   - Write out your analysis and reasoning
   - Compare alternatives with pros/cons
   - Consider long-term maintenance implications
   - Think about performance, scalability, and user experience
   - Document your decision rationale

3. **Implementation Phase**
   - Only start coding after thorough analysis
   - Refer back to your analysis frequently
   - Be willing to revise if you discover new information

**Red Flags to Avoid:**
- Making quick decisions without analysis
- Flip-flopping between approaches
- Implementing without understanding the domain
- Assuming "modern is better" without considering context
- Writing code before fully understanding the problem

### IMPORTANT: Always Reference Legacy Code

**Before implementing ANY feature in the new architecture (C# API or Vite app), you MUST:**

1. **Read and understand the legacy implementation first**
   - Never guess or assume how features work
   - Always examine the existing code to understand the complete implementation
   - Pay attention to edge cases and business logic nuances

2. **Key areas to examine before implementing:**
   - `lib/core/interfaces.ts` for TypeScript interfaces and data models
   - `lib/dashboard/computations/` for calculation logic and algorithms
   - `lib/data/` for Firebase data access patterns and storage structure
   - `pages/api/` for API endpoint implementations and contracts
   - Component files for UI behavior and user interactions

3. **Understand the full context:**
   - How data flows through the system
   - What validations are performed
   - How errors are handled
   - What the user experience expectations are

**This is not optional. Making assumptions about functionality without reading the legacy code is a critical error.**

### Adding New Features

1. API routes go in `pages/api/`
2. Feature components go in `lib/[feature]/`
3. Shared components go in `lib/shared/`
4. Use existing patterns for consistency

### Type Safety

- All components should have proper TypeScript types
- API responses should match interfaces in `lib/core/`
- Use strict null checks

### UI Components

- Use Chakra UI components whenever possible
- Custom theme is defined in `lib/theme/`
- Responsive design is required (check mobile views)

### Testing

**Frontend**: No test suite currently exists. When adding tests:
- Jest is already configured
- Place tests next to source files as `*.test.ts(x)`
- Focus on core business logic first

**Backend**: Solution structure prepared for tests. To add tests:
```bash
cd apps/api
dotnet new xunit -n TrendWeight.Tests
dotnet sln add TrendWeight.Tests/TrendWeight.Tests.csproj
cd TrendWeight.Tests
dotnet add reference ../TrendWeight/TrendWeight.csproj
```

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

## Migration Rules

### 1. UI Fidelity
- **EXACT REPRODUCTION**: The new UI must match the legacy UI exactly unless explicitly told otherwise
- This is NOT a redesign opportunity - reproduce the existing UI faithfully
- Match colors, spacing, typography, and layout precisely
- Use screenshots to verify visual accuracy before considering any UI task complete
- Be self-critical about UI quality - if it "looks like ass", fix it

### 2. Component Structure
- **PRESERVE REACT STRUCTURE**: Maintain the same component hierarchy as the legacy app
- If the legacy has separate components (e.g., Blurb, SampleChart, InfoButtons), create separate components
- Don't consolidate multiple components into one file unless explicitly instructed
- Match the legacy's component organization and naming conventions

### 3. Container and Layout
- **CONSISTENT WIDTHS**: Use the same Container component for both header and main content
- Container max-widths match legacy breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px
- The Layout component wraps all standard pages with Header + Container + Footer
- Special layouts (like home page) bypass the standard Layout

### 4. Development Approach
- **THINK BEFORE ACTING**: Always analyze the legacy code before implementing
- Don't make assumptions about data structures or UI patterns - verify first
- Check if libraries/plugins are installed and configured before using them (e.g., Tailwind Typography)
- Use proper Tailwind classes, not raw CSS
- Read documentation for new tools (e.g., Tailwind v4) before making assumptions
- Don't act like a "crappy junior dev" - think through problems properly

### 5. Static Pages First
- Complete all static pages before moving to dynamic/authenticated features
- Static pages include: Home, About, FAQ, Privacy, Tip Jar, etc.
- Leave complex features like Dashboard, Settings, and authentication for last

### 6. Typography and Styling
- Use appropriate text sizes (text-lg for body text on content pages)
- Ensure proper line height (leading-relaxed) for readability
- Headers should be prominent (text-4xl for h1, text-3xl for h2)
- Links use brand colors (text-brand-600 hover:text-brand-700 underline)
- Maintain consistent spacing between elements

## Supabase Migration (Completed)

### Overview
The C# API has been fully migrated from Firestore to Supabase for data storage. This migration was completed due to JSON serialization challenges with the C# Firestore client. Supabase provides native PostgreSQL JSONB support, making it ideal for document-style storage.

### Database Schema
- **profiles**: Stores user profiles with UUID primary key (renamed from users table to avoid confusion with Supabase auth.users)
- **provider_links**: OAuth tokens for provider integrations (renamed from vendor_links)
- **source_data**: Raw measurement data from providers

### UID Strategy
- **Supabase UUID**: Primary key for all tables
- Uses Supabase Auth JWTs directly - no Firebase UIDs anymore
- User's Supabase Auth UID is used as the primary key in profiles table

### Key Benefits
- No JSON serialization issues (native JSONB support)
- Better performance with PostgreSQL indexes
- Easier future migration to Supabase Auth
- Cleaner code without complex Firestore converters

### Recent Backend Cleanup (December 2024)

The backend C# code underwent a comprehensive cleanup with the following changes:

#### 1. **Complete Firestore Removal**
- All Firestore dependencies and services removed
- Migrated SettingsController from Firestore to Supabase
- Removed obsolete Firestore-related code and configuration

#### 2. **Provider Abstraction Layer**
- Created `IProviderService` interface for common provider operations
- Implemented `ProviderServiceBase` abstract class with token refresh logic
- Created `ProviderIntegrationService` orchestrator for multi-provider support
- Refactored WithingsService to use the new abstraction

#### 3. **Vendor → Provider Renaming**
- Renamed all "vendor" references to "provider" throughout the codebase
- Updated database schema: `vendor_links` → `provider_links`
- Updated column names: `vendor` → `provider` in both tables
- Updated all namespaces, classes, and method names accordingly

#### 4. **Database Model Consistency**
- All database models now have `Db` prefix for clarity:
  - `User` → `DbProfile` (table renamed from users to profiles to avoid confusion with auth.users)
  - `ProviderLink` → `DbProviderLink`
  - `SourceData` → `DbSourceData`
- Clear separation between database models and domain models

#### 5. **Production Endpoints**
- Replaced test controllers with production-ready endpoints
- Created proper OAuth flow controllers for providers
- Implemented MeasurementsController for data refresh with proper caching

#### 6. **Code Organization**
- Organized code into feature-specific modules
- Removed duplicate Data/ folder (kept Measurements/)
- Cleaned up outdated markdown and plan files
- Fixed all namespace and import issues

#### 7. **Timestamp Handling**
- **IMPORTANT**: All timestamp columns are stored as `text` with ISO 8601 format
- This avoids Supabase C# client timezone conversion issues
- Use `DateTime.UtcNow.ToString("o")` when storing timestamps
- Parse with `DateTime.Parse(timestamp, null, DateTimeStyles.RoundtripKind).ToUniversalTime()`

#### 8. **Data Refresh and Merging**
- Implements proper data merging (not replacement) when refreshing from providers
- Fetches data from 90 days before last sync to catch late-arriving/edited measurements
- Only updates database when measurements actually change
- Preserves historical data outside the refresh window
- 5-minute cache prevents unnecessary API calls

#### 9. **What Remains**
- **Firebase Infrastructure**: Still used for authentication (JWT validation)
  - FirebaseAuthenticationHandler.cs - Validates Firebase JWT tokens
  - FirebaseConfig.cs - Configuration for Firebase project
  - FirebaseService.cs - Service for Firebase Admin SDK
  - IFirebaseService.cs - Interface for Firebase service
- This is intentional as the app uses Firebase Auth for user authentication while storing data in Supabase

### Auth Migration to Supabase (December 2024)

The application is transitioning from Firebase Auth to Supabase Auth to unify authentication and data storage under a single platform.

#### Backend Auth Configuration
- **Dual Auth Support**: The backend temporarily supports both Firebase and Supabase JWTs during transition
- **SupabaseAuthenticationHandler**: New handler in Infrastructure/Auth validates Supabase JWTs using the JWT secret
- **Unified User Service**: UserService.GetByIdAsync() accepts both Supabase UUIDs and Firebase UIDs

#### Frontend Auth Configuration
- **Supabase Client**: Configured in `src/lib/supabase/client.ts`
- **Unified Auth Context**: `UnifiedAuthContext` wraps Supabase auth to maintain API compatibility
- **Social Logins**: Google, Microsoft (Azure), and Apple OAuth providers
- **Magic Links**: Email-based passwordless authentication

#### Environment Variables
Frontend (.env.local):
```
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```

Backend (appsettings.json):
```json
{
  "Supabase": {
    "Url": "https://[project-ref].supabase.co",
    "AnonKey": "[anon-key]",
    "ServiceKey": "[service-key]",
    "JwtSecret": "[jwt-secret]"
  }
}
```

#### Migration Status
- ✅ Backend supports Supabase JWTs
- ✅ Frontend uses Supabase Auth
- ✅ All auth methods implemented (email, Google, Microsoft, Apple)
- ⏳ Remove Firebase dependencies after testing
- ⏳ Update database schema to remove firebase_uid column
