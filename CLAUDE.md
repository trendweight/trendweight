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

### Development

```bash
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm prettier     # Format code with Prettier
pnpm analyze      # Analyze bundle size
```

### Code Quality

The project uses Husky pre-commit hooks that automatically run pretty-quick to format staged files. Manual formatting can be done with `pnpm prettier`.

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
  /api/                    # C# ASP.NET Core API
    /TrendWeight/
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

**Note**: No test suite currently exists. When adding tests:

- Jest is already configured
- Place tests next to source files as `*.test.ts(x)`
- Focus on core business logic first

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.

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
- **users**: Stores user profiles with UUID primary key and Firebase UID mapping
- **provider_links**: OAuth tokens for provider integrations (renamed from vendor_links)
- **source_data**: Raw measurement data from providers

### UID Strategy
- **Supabase UUID**: Primary key for all tables (future-compatible with Supabase Auth)
- **Firebase UID**: Stored as `firebase_uid` for current auth system
- When handling requests, map Firebase UID from JWT to Supabase UUID

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
  - `User` → `DbUser`
  - `ProviderLink` → `DbProviderLink`
  - `SourceData` → `DbSourceData`
- Clear separation between database models and domain models

#### 5. **Production Endpoints**
- Replaced test controllers with production-ready endpoints
- Created proper OAuth flow controllers for providers
- Implemented DataRefreshController for syncing provider data

#### 6. **Code Organization**
- Organized code into feature-specific modules
- Removed duplicate Data/ folder (kept Measurements/)
- Cleaned up outdated markdown and plan files
- Fixed all namespace and import issues

#### 7. **What Remains**
- **Firebase Infrastructure**: Still used for authentication (JWT validation)
  - FirebaseAuthenticationHandler.cs - Validates Firebase JWT tokens
  - FirebaseConfig.cs - Configuration for Firebase project
  - FirebaseService.cs - Service for Firebase Admin SDK
  - IFirebaseService.cs - Interface for Firebase service
- This is intentional as the app uses Firebase Auth for user authentication while storing data in Supabase
