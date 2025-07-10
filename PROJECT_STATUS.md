# TrendWeight Project Status

This issues tracks the implementation status of TrendWeight migration

## Architecture Overview

- **Frontend**: React 19 + Vite + TypeScript + TanStack Router/Query
- **Backend**: ASP.NET Core 9.0 Web API
- **Database**: Supabase (PostgreSQL with JSONB)
- **Authentication**: Supabase Auth
- **Deployment**: Docker + GitHub Actions CI/CD

## Implementation Status

### ✅ Core Infrastructure

- [x] Monorepo setup with npm workspaces
- [x] Vite + React frontend setup
- [x] ASP.NET Core API setup
- [x] TypeScript configuration
- [x] ESLint + Prettier setup
- [x] Pre-commit hooks for formatting
- [x] Docker containerization
- [x] GitHub Actions CI/CD pipeline
- [x] DigitalOcean Container Registry integration
- [x] Renovate dependency automation
- [x] Development server management (tmuxinator)
- [x] Error boundaries and fallback pages

### ✅ Authentication & Security

- [x] Supabase Auth integration (replaced Firebase)
- [x] JWT authentication in backend
- [x] Email link authentication
- [x] Social logins (Google, Microsoft, Apple)
- [x] Apple Sign-in with JS SDK for better iOS compatibility
- [x] Apple Sign-in redirect flow improvements
- [x] Protected route handling
- [x] Authentication loading states with Suspense
- [x] Check email flow
- [x] Email verification handling
- [x] Navigation guard for unsaved changes
- [x] Mobile logout fixes for iPhone Safari
- [x] Touch device navigation improvements
- [x] Improved proxy header security
- [ ] Account migration from legacy site

### ✅ Database & Data Layer

- [x] Supabase database schema
- [x] JSONB data storage pattern
- [x] Proper timestamp handling (ISO 8601)
- [x] User profiles table
- [x] Provider links table (OAuth tokens)
- [x] Source data table (measurements)
- [x] Data access layer in backend
- [x] Type-safe API client

### ⚙️ Provider Integrations

- [x] Withings OAuth flow
- [x] Withings data sync
- [x] Withings token refresh
- [x] Provider link management API
- [ ] Fitbit OAuth flow
- [ ] Fitbit data sync
- [ ] Fitbit token refresh
- [x] OAuth callback handling
- [ ] OAuth error handling/recovery
- [ ] Bulk historical data import
- [x] Manual data resync (with resync_requested flag for resilient handling)

### ✅ Dashboard & Visualization

- [x] Dashboard layout
- [x] Loading skeletons
- [x] Highcharts integration
- [x] Weight trend chart
- [x] Statistics summary
- [x] Recent readings list
- [x] Support for body fat %, lean mass, etc.
- [x] Client-side trend calculation
- [x] Demo dashboard with sample data
- [x] Optimized data loading with parallel queries
- [x] Consistent weight storage in kg (instant unit switching)
- [ ] Handle "no data" state elegantly
- [ ] Handle "no provider links" state
- [ ] Shared/public dashboard URLs
- [ ] Dashboard sharing UI
- [ ] Explore UI

### ✅ Settings & Profile

- [x] Settings page route
- [x] Settings API endpoint (refactored into ProfileController)
- [x] Profile API endpoint (GET/PUT /api/profile)
- [x] Settings UI implementation (comprehensive with all sections)
- [x] Weight units preference
- [ ] Smoothing days preference
- [x] Timezone selection (with @vvo/tzdb)
- [x] Day start offset
- [ ] Privacy settings
- [x] Connect/disconnect providers
- [x] Delete account functionality (UI ready, backend pending)

### ✅ Static Pages

- [x] Home/marketing page
- [x] About page
- [x] FAQ page
- [x] Privacy policy
- [x] Tip jar/donation page
- [x] Build info page
- [ ] Mathematical explanation page

### 🚀 Additional Features

- [ ] All measurements page
- [ ] Data export (CSV, JSON)

### 🔧 Testing

- [ ] Unit tests (frontend)
- [ ] Unit tests (backend)
- [ ] Integration tests
- [ ] E2E tests

### 🐛 Other Items

- [ ] Improve error handling throughout
- [ ] Add request/response logging
- [ ] Implement proper retry logic
- [ ] Add monitoring/observability
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Security audit

## Legend

- ✅ Completed
- ⚙️ Partially implemented / In progress
- 🚀 Future enhancement (not MVP)
- 🐛 Bug fix / Technical debt
