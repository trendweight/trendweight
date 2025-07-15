# Architecture

## Overview

TrendWeight uses a modern web architecture with a C# ASP.NET Core API backend and a Vite + React frontend.

## Backend Architecture

### Technology Stack

- **ASP.NET Core 9.0** Web API
- **Supabase** (PostgreSQL) for data storage
- **JWT-based authentication**
- **Feature-based architecture** with service layer pattern

### Service Layer Pattern

The backend uses a service layer pattern to separate business logic from controllers:

- **ProfileService**: Manages user profile CRUD operations and business logic
- **ProviderService**: Base class for provider-specific implementations (Withings/Fitbit)
- **SourceDataService**: Handles raw measurement data storage and retrieval
- **MeasurementsController**: Orchestrates data fetching from multiple providers

Controllers should be thin, delegating complex logic to services.

### Project Structure

```
apps/api/
└── TrendWeight/
    ├── Features/           # Feature-based organization
    │   ├── Profile/        # User profile management
    │   ├── Providers/      # Withings/Fitbit integrations
    │   └── Measurements/   # Weight data management
    └── Infrastructure/     # Cross-cutting concerns
```

## Frontend Architecture

### Technology Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **TanStack Router** for routing
- **TanStack Query** for server state management
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components

## Timestamp Storage

The application stores weight measurements with local date and time strings rather than Unix timestamps:

### Storage Format

```typescript
interface RawMeasurement {
  date: string; // "2024-01-15" (YYYY-MM-DD)
  time: string; // "06:30:00" (HH:mm:ss)
  weight: number; // kg
  fatRatio?: number; // 0-1 ratio
}
```

### Provider Handling

- **Withings**: Provides UTC timestamps with timezone info. The backend converts these to local time before storage.
- **Fitbit**: Provides measurements already in the user's local timezone, stored as-is.

This approach:

- Preserves the user's local time context
- Avoids timezone conversion issues
- Simplifies display logic on the frontend
- Handles provider differences transparently

## Database Schema

### Tables

- **profiles**: User profiles with settings (UUID primary key)
- **provider_links**: OAuth tokens for provider integrations
- **source_data**: Raw measurement data from providers

### Key Principles

- All timestamps stored as ISO 8601 strings
- All weights stored in kg for consistency
- JSONB columns for flexible data storage
- No unique constraint on email (uses Supabase Auth UID)

## Authentication Flow

1. Frontend uses Supabase Auth for user authentication
2. Backend validates Supabase JWTs using shared JWT secret
3. All API endpoints require authentication except health checks and OAuth callbacks
4. Provider OAuth tokens stored encrypted in database

## Development Guidelines

### Backend

- Feature folders for organization
- Dependency injection for all services
- Async/await for all I/O operations
- Nullable fields should remain null when not provided (never default to 0)

### Frontend

- Functional components with hooks
- Custom hooks for reusable logic
- Error boundaries for graceful error handling
- Route-level authentication guards

### UI Component Standards

- **Always use standard UI components** instead of raw HTML elements for the following cases
- Use `Button` component from `/components/ui/Button.tsx` instead of `<button>`
- Use `Heading` component from `/components/ui/Heading.tsx` instead of `<h1>`, `<h2>`, etc.
- This ensures consistent styling, accessibility, and maintainability across the application

## Provider Integration Notes

### Fitbit Limitations

- Weight data requests cannot start before 2009-01-01
- Maximum date range per request is 32 days
- Always use initial sync date of 2009-01-01

### Token Management

- Tokens automatically refresh when expired
- Provider userid fields vary in type and are not used
- Failed auth triggers reconnection flow
