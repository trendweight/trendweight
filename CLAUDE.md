# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TrendWeight is a Next.js web application for tracking weight trends by integrating with Withings and Fitbit devices. The app uses TypeScript, React, and Chakra UI for the frontend, with Firebase for authentication and data storage.

## IMPORTANT: Active Modernization Initiative

**There is an active modernization effort in progress. See `MODERNIZATION_PLAN.md` for the detailed plan and current status.**

The modernization includes:

- Migrating from pnpm to npm
- Upgrading from Chakra UI to Tailwind CSS v4 + Radix UI
- Upgrading to latest Next.js and React 19
- Migrating from Pages Router to App Router
- Modernizing authentication (social logins + magic links)
- Adding comprehensive test coverage

Always check the modernization plan for the current phase and follow the established patterns when making changes.

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

### Core Technologies

- **Next.js 13.4.4** with Pages Router (not App Router)
- **TypeScript** with strict mode enabled
- **Chakra UI** for component library with custom theme
- **React Query** for server state management
- **Firebase** for auth and data persistence

### Key Directory Structure

- `pages/` - Next.js pages and API routes
  - `pages/api/` - Backend API endpoints for data operations, settings, and vendor integrations
- `lib/` - Core application code organized by feature:
  - `lib/api/` - API middleware and utilities (auth checking, error handling)
  - `lib/auth/` - Authentication components and hooks
  - `lib/core/` - Core interfaces and business logic
  - `lib/dashboard/` - Dashboard feature components
  - `lib/data/` - Data access layer with Firebase integration
  - `lib/vendors/` - Withings and Fitbit integration code

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

Required environment variables (see `.env.local.example`):

- Firebase configuration (NEXT*PUBLIC_FIREBASE*\*)
- Withings OAuth credentials
- JWT signing key

## Development Notes

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
