# TrendWeight Migration Plan v2: Fresh Build Approach

## Overview
Instead of migrating the existing Next.js app in place, we'll build a new Vite + C# ASP.NET Core architecture alongside the existing app, using it as a reference implementation.

**Start Date**: June 19, 2025  
**Architecture**: Vite React SPA + C# ASP.NET Core API + Firebase  
**Status**: Phase 1 Complete ✅

### Important Context
- **The legacy system is NOT live and has NO active users**
- This is a greenfield rebuild with freedom to modernize
- We should use modern patterns rather than copying legacy approaches
- See `apps/api/TrendWeight/MODERNIZATION_NOTES.md` for specific improvements

## Previous Modernization Progress

### Test Infrastructure (Phase 1 - 90% Complete)
Before transitioning to the new architecture plan, significant test infrastructure was established:

**Completed:**
- Jest configuration with TypeScript support (commit: ecb760b)
- Playwright E2E setup (commit: 26b8131)
- E2E tests for critical flows including:
  - Login/logout flow
  - Dashboard loading and data display
  - Settings management
  - Withings/Fitbit connection flow (placeholder)
  - Data sync functionality (placeholder)
  - Error handling scenarios (commit: 17226e3)
- API endpoint tests for auth-protected, data fetching, and settings endpoints (commit: e1a40c8)
- Test fixes and improvements (commit: 92f1030)
- Unit tests for core utilities (date handling, data processing)
- Test authentication utilities
- Test API middleware functions
- Test data transformation functions

**Not Completed:**
- Vendor integration endpoint tests
- GitHub Actions CI integration

**Key Dependencies Added:**
- Jest and TypeScript test dependencies
- Playwright for E2E testing
- Testing utilities and mocks

### Important Discoveries
- The test infrastructure revealed the complexity of vendor integrations
- Authentication flow testing highlighted the need for a more modern auth approach
- Performance testing showed that SSR provides minimal benefit for this authenticated app

## Rationale for Architecture Change

### Why Not Next.js:
- No SEO requirements (app is behind auth)
- No SSR benefits (dashboard is client-rendered)
- API routes are just Firebase/vendor proxies
- Unnecessary complexity for this use case

### Why Vite + C# API:
- Clear separation: API handles logic, SPA handles UI
- Better for mathematical computations (trend calculations)
- Superior vendor integration support (Withings/Fitbit)
- Easier to test and maintain
- Modern development experience

## Repository Structure

```
trendweight/
├── apps/
│   ├── legacy-nextjs/      # Current app (reference)
│   ├── api/                # New C# API
│   │   └── TrendWeight/    # Note: Named TrendWeight, not TrendWeight.Api
│   │       ├── Features/   # Feature-based organization
│   │       ├── Infrastructure/
│   │       └── Program.cs
│   └── web/                # New Vite React app
│       └── src/
│           ├── features/   # Feature-based organization
│           └── shared/
├── docs/
├── scripts/
└── package.json           # Monorepo scripts
```

## Implementation Phases

### Phase 1: Repository Restructure & Foundation ✅
**Status**: COMPLETE (commit: af72561)
**Goal**: Set up monorepo structure and basic projects

#### Step 1: Create new directory structure
```bash
# Create the new structure
mkdir -p apps/{legacy-nextjs,api,web}
mkdir -p packages docs scripts
```

#### Step 2: Move existing Next.js app (preserve git history)
```bash
# Create a list of items to move
cat > /tmp/move-list.txt << EOF
pages
lib
public
e2e
__mocks__
jest.config.js
jest.setup.js
next.config.js
next-env.d.ts
tsconfig.json
.env.local.example
package.json
pnpm-lock.yaml
playwright.config.ts
EOF

# Move each item to the new location
while read -r item; do
  if [ -e "$item" ]; then
    git mv "$item" "apps/legacy-nextjs/$item" 2>/dev/null || mv "$item" "apps/legacy-nextjs/$item"
  fi
done < /tmp/move-list.txt

# Keep these files in root (don't move)
# - .gitignore
# - README.md
# - CLAUDE.md
# - MIGRATION_PLAN_V2.md
# - MODERNIZATION_PLAN.md (for historical reference)
```

#### Step 3: Create root package.json for monorepo
```bash
cat > package.json << 'EOF'
{
  "name": "trendweight-monorepo",
  "private": true,
  "scripts": {
    "dev": "concurrently -n \"api,web\" -c \"yellow,blue\" \"npm run dev:api\" \"npm run dev:web\"",
    "dev:all": "concurrently -n \"legacy,api,web\" -c \"gray,yellow,blue\" \"npm run dev:legacy\" \"npm run dev:api\" \"npm run dev:web\"",
    "dev:legacy": "cd apps/legacy-nextjs && pnpm dev",
    "dev:api": "cd apps/api && dotnet watch run",
    "dev:web": "cd apps/web && npm run dev",
    "test": "npm run test:legacy && npm run test:api && npm run test:web",
    "test:legacy": "cd apps/legacy-nextjs && pnpm test",
    "test:api": "cd apps/api && dotnet test",
    "test:web": "cd apps/web && npm test",
    "clean": "find . -name 'node_modules' -type d -prune -exec rm -rf '{}' + && find . -name 'bin' -type d -prune -exec rm -rf '{}' + && find . -name 'obj' -type d -prune -exec rm -rf '{}' +"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
EOF

npm install
```

#### Step 4: Update .gitignore for monorepo
```bash
cat >> .gitignore << 'EOF'

# Monorepo
.nx/
.turbo/

# C# / .NET
*.swp
*.*~
project.lock.json
.DS_Store
*.pyc
nupkg/

# Visual Studio
.vs/
.vscode/

# Rider
.idea/
*.sln.iml

# User-specific files
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
bld/
[Bb]in/
[Oo]bj/
[Ll]og/
[Ll]ogs/

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# Vite
apps/web/dist
apps/web/.vite
EOF
```

#### Step 5: Initialize C# API project
```bash
cd apps/api

# Create the API project
dotnet new webapi -n TrendWeight -f net9.0
cd TrendWeight

# Add required packages
dotnet add package FirebaseAdmin
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
# Note: No Google auth package needed - Firebase handles all auth providers

# Create feature folder structure
mkdir -p Features/{Auth,Measurements,Profile,Settings,Vendors/Withings,Vendors/Fitbit}
mkdir -p Infrastructure/{Firebase,Middleware,Extensions}

# Remove default files
rm Controllers/WeatherForecastController.cs
rm WeatherForecast.cs

cd ../../..
```

#### Step 6: Initialize Vite React project
```bash
cd apps/web

# Create Vite project with React + TypeScript
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install additional packages
npm install @tanstack/react-router @tanstack/react-query
npm install @radix-ui/themes @radix-ui/react-icons
npm install tailwindcss@next @tailwindcss/postcss@next
npm install clsx
# Note: tailwind-merge would be useful but requires Tailwind configuration first

# Create feature folder structure
mkdir -p src/features/{auth,dashboard,settings}/components
mkdir -p src/features/{auth,dashboard,settings}/hooks
mkdir -p src/shared/{components,hooks,utils}

cd ../..
```

#### Step 7: Commit the reorganization
```bash
git add -A
git commit -m "refactor: Reorganize repository as monorepo

- Move existing Next.js app to apps/legacy-nextjs/
- Initialize C# API project in apps/api/
- Initialize Vite React project in apps/web/
- Add monorepo scripts for running all apps
- Update .gitignore for C# and monorepo structure

The legacy app remains fully functional as a reference implementation."
```

#### Phase 1 Completion Notes

**What was actually completed:**
- ✅ Monorepo structure created
- ✅ Legacy Next.js app moved with git history preserved
- ✅ C# API project initialized with .NET 9
- ✅ Vite React project initialized
- ✅ Basic folder structures created
- ✅ Dependencies installed (but not configured)
- ✅ .gitignore updated for C# and monorepo

**What still needs configuration:**
- ⏳ Tailwind CSS v4 setup (postcss config, imports, etc.)
- ⏳ Firebase Admin SDK configuration in C# API
- ⏳ JWT authentication middleware setup
- ⏳ React Router configuration
- ⏳ API client setup in web app
- ⏳ Development proxy configuration

### Phase 2: Frontend Foundation (Revised Approach)
**Status**: Not started (incorrectly started with API first)
**Goal**: Build the Vite React frontend with faithful UI reproduction

**Key Principle**: The UI must be as faithful to the legacy UI as possible. This is NOT a redesign.

**Note**: We incorrectly started building the API first. The API work done so far provides:
- Firebase authentication setup (can be reused later)
- Basic infrastructure (will need revision based on frontend needs)
- Model definitions (may need adjustment based on actual API requirements)

#### 2.1 Development Approach
1. Run legacy app locally to capture screenshots
2. Use Playwright to interact with legacy app for reference
3. Build new components to match exactly
4. Compare side-by-side frequently
5. Start with static pages before authenticated features

#### 2.2 Implementation Order
1. **Basic Setup**
   - Configure Tailwind CSS v4 properly
   - Set up routing with TanStack Router
   - Configure development environment

2. **Layout Foundation**
   - Header/Navigation (matching legacy exactly)
   - Footer
   - Page container/wrapper components
   - Responsive breakpoints matching legacy

3. **Static Pages** (easiest to verify correctness)
   - Home page (marketing/landing)
   - About page
   - FAQ page  
   - Privacy policy page
   - Tip jar page
   - 404/500 error pages

4. **Auth Pages** (still mostly static)
   - Login page
   - Signup page
   - Link account page (for Withings/Fitbit)

5. **Authenticated Pages** (requires API)
   - Dashboard (complex - do last)
   - Settings page
   - Profile viewing

### Phase 3: C# API Development
**Goal**: Build API to support frontend needs

**Important**: Only build API endpoints after frontend needs them. The frontend drives API design.

#### 2.1 Infrastructure Setup
```csharp
Infrastructure/
├── Firebase/
│   ├── IFirebaseService.cs
│   ├── FirebaseService.cs
│   └── FirebaseConfig.cs
├── Middleware/
│   └── ErrorHandlingMiddleware.cs
└── Extensions/
    └── ServiceCollectionExtensions.cs
```

#### 2.2 Authentication Feature
```csharp
Features/Auth/
├── IAuthService.cs
├── AuthService.cs
├── AuthController.cs
├── Models/
│   ├── LoginRequest.cs  
│   └── AuthResponse.cs
└── Middleware/
    └── FirebaseAuthMiddleware.cs
// Note: All auth providers (Google, Apple, Magic Link) are handled by Firebase
// The API only validates Firebase ID tokens
```

#### 2.3 Measurements Feature
```csharp
Features/Measurements/
├── IMeasurementService.cs
├── MeasurementService.cs
├── MeasurementsController.cs
├── Models/
│   ├── Measurement.cs
│   ├── MeasurementWithTrend.cs
│   └── MeasurementInput.cs
└── Services/
    ├── ITrendCalculator.cs
    └── TrendCalculator.cs
```

#### 2.4 Vendor Integrations
```csharp
Features/Vendors/
├── IVendorService.cs
├── Withings/
│   ├── WithingsService.cs
│   ├── WithingsController.cs
│   └── WithingsModels.cs
└── Fitbit/
    ├── FitbitService.cs
    ├── FitbitController.cs
    └── FitbitModels.cs
```

### Phase 3: React SPA Development
**Goal**: Build modern React app with Tailwind + Radix UI

#### 3.1 Foundation
- Tailwind CSS v4 setup
- Radix UI components
- TanStack Router
- TanStack Query
- Feature folder structure

#### 3.2 Feature Implementation
```
src/features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   └── SocialLoginButtons.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── api.ts
├── dashboard/
│   ├── components/
│   │   ├── WeightChart.tsx
│   │   ├── CurrentStats.tsx
│   │   └── RecentReadings.tsx
│   ├── hooks/
│   │   └── useMeasurements.ts
│   └── api.ts
└── settings/
    ├── components/
    │   └── SettingsForm.tsx
    ├── hooks/
    │   └── useSettings.ts
    └── api.ts
```

### Phase 4: Testing & Validation
**Goal**: Ensure feature parity with existing app

1. API integration tests
2. Frontend component tests
3. E2E tests comparing old and new apps
   - Leverage existing Playwright tests from legacy app
   - Run same test scenarios against both implementations
4. Performance benchmarks
5. Accessibility audit

**Note**: The legacy app already has comprehensive E2E tests (90% complete from previous modernization effort) that can be adapted for validating the new implementation.

### Phase 5: Deployment & Migration
**Goal**: Deploy new architecture

1. Deploy API to Azure App Service / AWS / etc
2. Deploy SPA to CDN
3. Configure Firebase rules
4. Domain setup with gradual rollout
5. Monitoring and observability

## Development Workflow

```bash
# Terminal 1: Legacy reference app
cd apps/legacy-nextjs && pnpm dev

# Terminal 2: New API
cd apps/api && dotnet watch run

# Terminal 3: New web app
cd apps/web && npm run dev

# Or run all together
npm run dev:all
```

## Key Implementation Details

### C# Dependency Injection Example
```csharp
// Program.cs
builder.Services.AddScoped<IFirebaseService, FirebaseService>();
builder.Services.AddScoped<IMeasurementService, MeasurementService>();
builder.Services.AddScoped<ITrendCalculator, TrendCalculator>();

// Features/Measurements/IMeasurementService.cs
public interface IMeasurementService
{
    Task<List<MeasurementWithTrend>> GetMeasurementsAsync(string userId, DateTime? from, DateTime? to);
    Task<Measurement> AddMeasurementAsync(string userId, MeasurementInput input);
}

// Features/Measurements/MeasurementService.cs
public class MeasurementService : IMeasurementService
{
    private readonly IFirebaseService _firebase;
    private readonly ITrendCalculator _trendCalculator;
    
    public MeasurementService(IFirebaseService firebase, ITrendCalculator trendCalculator)
    {
        _firebase = firebase;
        _trendCalculator = trendCalculator;
    }
}
```

### Frontend API Integration
```typescript
// src/lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const api = {
  get: (url: string, config?: RequestInit) => 
    fetch(`${API_BASE}${url}`, { ...config, credentials: 'include' }),
  post: (url: string, data: any) =>
    fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include'
    })
};
```

## Success Metrics

1. All features from legacy app implemented
2. Performance: API response times < 100ms
3. Frontend bundle size < 200KB
4. 80%+ test coverage on critical paths
5. Accessibility: WCAG 2.1 AA compliant

## Risk Mitigation

1. **Vendor API Changes**: Abstract behind interfaces
2. **Firebase Changes**: All Firebase code in Infrastructure layer
3. **Authentication Issues**: Support multiple providers
4. **Data Loss**: Read-only mode during migration
5. **Testing Gaps**: Utilize existing test suite from legacy app as reference

## Key Decisions from Previous Effort

1. **Test-First Approach**: Tests were established before any migration work, providing a safety net
2. **Authentication Complexity**: Username/password auth proved cumbersome, reinforcing the decision to move to social/magic link auth
3. **Performance Analysis**: Testing showed minimal benefit from SSR for an authenticated dashboard app
4. **Vendor Integration Challenges**: Tests revealed the need for better abstraction of vendor APIs

## Timeline Estimate

- Phase 1: 1 week
- Phase 2: 3-4 weeks  
- Phase 3: 3-4 weeks
- Phase 4: 1-2 weeks
- Phase 5: 1 week

**Total: 10-12 weeks**

This approach reduces risk, improves architecture, and results in a more maintainable system than the in-place migration.