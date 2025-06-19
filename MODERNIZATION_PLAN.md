# TrendWeight Modernization Plan

## Status Overview

- **Start Date**: June 19, 2025
- **Current Phase**: Phase 1 - Test Infrastructure Setup
- **Overall Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

## Phase Status Legend

- ⬜ Not Started
- 🟦 In Progress
- ✅ Complete
- ⚠️ Blocked/Issues
- 🔄 Needs Revision

---

## Phase 1: Test Infrastructure Setup 🟦

**Status**: In Progress  
**Progress**: 40% ⬜⬜⬜⬜⬛⬛⬛⬛⬛⬛

### Goals

- Establish comprehensive testing framework before making any architectural changes
- Create baseline tests to ensure functionality is preserved during migration

### Tasks

- [x] **1.1 Jest Configuration**
  - [x] Install Jest and TypeScript dependencies
  - [x] Create jest.config.js with TypeScript support
  - [x] Set up test environment for Next.js
  - [x] Configure module path aliases
  - [x] Add test scripts to package.json
- [x] **1.2 Unit Test Structure**
  - [x] Create test directory structure
  - [x] Write tests for core utilities (date handling, data processing)
  - [x] Test authentication utilities
  - [x] Test API middleware functions
  - [x] Test data transformation functions
- [ ] **1.3 Playwright E2E Setup**
  - [ ] Install Playwright
  - [ ] Create playwright.config.ts
  - [ ] Set up test fixtures for authentication
  - [ ] Configure test data management
- [ ] **1.4 E2E Test Coverage**
  - [ ] Login/logout flow
  - [ ] Dashboard loading and data display
  - [ ] Settings management
  - [ ] Withings/Fitbit connection flow
  - [ ] Data sync functionality
  - [ ] Error handling scenarios
- [ ] **1.5 API Testing**
  - [ ] Test auth-protected endpoints
  - [ ] Test data fetching endpoints
  - [ ] Test settings endpoints
  - [ ] Test vendor integration endpoints
- [ ] **1.6 CI/CD Integration**
  - [ ] Create .github/workflows/test.yml
  - [ ] Configure test matrix (Node versions)
  - [ ] Set up test result reporting
  - [ ] Add branch protection rules

### Commit Strategy

- Commit 1: Jest setup and configuration
- Commit 2: Initial unit tests
- Commit 3: Playwright setup
- Commit 4: E2E tests
- Commit 5: API tests
- Commit 6: GitHub Actions CI

---

## Phase 2: Switch from pnpm to npm ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Simplify package management by switching to npm
- Ensure all developers can easily contribute

### Tasks

- [ ] **2.1 Package Manager Migration**
  - [ ] Delete pnpm-lock.yaml
  - [ ] Remove .npmrc if pnpm-specific
  - [ ] Run npm install to generate package-lock.json
  - [ ] Update all documentation references
- [ ] **2.2 Script Updates**
  - [ ] Update package.json scripts
  - [ ] Update Husky hooks
  - [ ] Update CI/CD workflows
  - [ ] Update README instructions
- [ ] **2.3 Verification**
  - [ ] Clean install test
  - [ ] Run all tests
  - [ ] Verify build process
  - [ ] Check for pnpm-specific issues

### Commit Strategy

- Commit 1: Package manager switch and verification

---

## Phase 3: Incremental Next.js Upgrade ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Upgrade from Next.js 13.4.4 to latest (15.x)
- Upgrade React from 18.2.0 to 19.x
- Maintain Pages Router temporarily

### Tasks

- [ ] **3.1 Next.js 13.4 → 14.0**
  - [ ] Update Next.js to 14.0
  - [ ] Fix any breaking changes
  - [ ] Update related dependencies
  - [ ] Run full test suite
- [ ] **3.2 Next.js 14.0 → 14.2 (Stable)**
  - [ ] Update to latest 14.x
  - [ ] Address deprecation warnings
  - [ ] Test all functionality
- [ ] **3.3 Next.js 14.x → 15.x**
  - [ ] Update to Next.js 15
  - [ ] Update React to v19
  - [ ] Fix React 19 breaking changes
  - [ ] Update TypeScript if needed
- [ ] **3.4 Dependency Updates**
  - [ ] Update all Next.js related packages
  - [ ] Update ESLint configuration
  - [ ] Update TypeScript configuration
  - [ ] Address any peer dependency issues

### Commit Strategy

- Commit 1: Next.js 14 upgrade
- Commit 2: Next.js 15 and React 19 upgrade
- Commit 3: Dependency updates and fixes

---

## Phase 4: Add Tailwind CSS v4 Alongside Chakra ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Install and configure Tailwind CSS v4
- Ensure it works alongside Chakra UI
- Create migration utilities

### Tasks

- [ ] **4.1 Tailwind v4 Installation**
  - [ ] Install tailwindcss and @tailwindcss/postcss
  - [ ] Create postcss.config.mjs
  - [ ] Add Tailwind imports to globals.css
  - [ ] Configure Tailwind content paths
- [ ] **4.2 Configuration**
  - [ ] Set up Tailwind config for design system
  - [ ] Match Chakra theme values (colors, spacing)
  - [ ] Configure Tailwind to avoid conflicts
  - [ ] Set up CSS layer ordering
- [ ] **4.3 Migration Utilities**
  - [ ] Create Chakra → Tailwind mapping guide
  - [ ] Document common pattern conversions
  - [ ] Create helper utilities if needed
  - [ ] Test in isolated components

### Commit Strategy

- Commit 1: Tailwind installation and configuration
- Commit 2: Migration utilities and documentation

---

## Phase 5: Component Migration to Tailwind + Radix UI ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Systematically replace all Chakra UI components
- Implement Radix UI for complex interactive components
- Maintain visual consistency

### Tasks

- [ ] **5.1 Component Library Setup**
  - [ ] Install Radix UI primitives
  - [ ] Create base component structure
  - [ ] Set up component documentation
- [ ] **5.2 Basic Components** (Button, Link, Box, Text)
  - [ ] Create Tailwind versions
  - [ ] Match Chakra styling exactly
  - [ ] Update all usages
  - [ ] Visual regression testing
- [ ] **5.3 Layout Components**
  - [ ] Header/Footer
  - [ ] Navigation components
  - [ ] Container/Grid components
  - [ ] Responsive utilities
- [ ] **5.4 Form Components**
  - [ ] Input/Textarea with Radix
  - [ ] Select/Dropdown
  - [ ] Checkbox/Radio
  - [ ] Form validation styling
- [ ] **5.5 Complex Components**
  - [ ] Modal/Dialog (Radix)
  - [ ] Toast notifications
  - [ ] Loading states
  - [ ] Charts (keep Highcharts)
- [ ] **5.6 Cleanup**
  - [ ] Remove all Chakra imports
  - [ ] Remove Chakra dependencies
  - [ ] Remove Emotion
  - [ ] Update theme system

### Commit Strategy

- Commit 1: Component library setup
- Commit 2: Basic components migration
- Commit 3: Layout components migration
- Commit 4: Form components with Radix
- Commit 5: Complex components
- Commit 6: Chakra removal

---

## Phase 6: Authentication System Modernization ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Replace username/password with modern authentication
- Implement social logins and magic links
- Provide migration path for existing users

### Tasks

- [ ] **6.1 Firebase Auth Configuration**
  - [ ] Enable Google authentication
  - [ ] Enable Apple authentication
  - [ ] Configure magic link emails
  - [ ] Set up auth rules
- [ ] **6.2 Frontend Auth Flow**
  - [ ] Create new login page UI
  - [ ] Implement social login buttons
  - [ ] Create magic link flow
  - [ ] Handle auth redirects
- [ ] **6.3 User Migration**
  - [ ] Create migration strategy
  - [ ] Link existing accounts to social logins
  - [ ] Handle email verification
  - [ ] Create fallback for existing users
- [ ] **6.4 Remove Old Auth**
  - [ ] Remove signup page
  - [ ] Remove password reset
  - [ ] Remove password change
  - [ ] Clean up auth code
- [ ] **6.5 Testing**
  - [ ] Test all auth flows
  - [ ] Test migration scenarios
  - [ ] Test error cases
  - [ ] Update E2E tests

### Commit Strategy

- Commit 1: New auth implementation
- Commit 2: User migration support
- Commit 3: Old auth removal
- Commit 4: Test updates

---

## Phase 7: Pages to App Router Migration ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Migrate from Pages Router to App Router
- Implement React Server Components
- Modernize data fetching

### Tasks

- [ ] **7.1 App Directory Setup**
  - [ ] Create app directory structure
  - [ ] Set up root layout
  - [ ] Configure metadata
  - [ ] Set up error boundaries
- [ ] **7.2 Static Pages Migration**
  - [ ] About, Privacy, FAQ pages
  - [ ] 404/500 error pages
  - [ ] Home page
  - [ ] Update links and navigation
- [ ] **7.3 Dynamic Pages Migration**
  - [ ] Dashboard page (with RSC)
  - [ ] Settings page
  - [ ] Link/connection pages
  - [ ] Loading states
- [ ] **7.4 API Routes to Route Handlers**
  - [ ] Convert auth endpoints
  - [ ] Convert data endpoints
  - [ ] Convert settings endpoints
  - [ ] Update middleware pattern
- [ ] **7.5 Data Fetching Updates**
  - [ ] Implement server components
  - [ ] Remove React Query where appropriate
  - [ ] Add streaming where beneficial
  - [ ] Optimize client components

### Commit Strategy

- Commit 1: App directory setup
- Commit 2: Static pages migration
- Commit 3: Dynamic pages migration
- Commit 4: API routes migration
- Commit 5: Data fetching optimization

---

## Phase 8: React 19 Optimizations ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Enable React Compiler
- Optimize with React 19 features
- Improve performance

### Tasks

- [ ] **8.1 React Compiler Setup**
  - [ ] Install React Compiler
  - [ ] Configure for Next.js
  - [ ] Enable incrementally
  - [ ] Measure performance impact
- [ ] **8.2 Server Components Optimization**
  - [ ] Identify heavy client components
  - [ ] Convert to server components
  - [ ] Implement proper boundaries
  - [ ] Add suspense boundaries
- [ ] **8.3 New React Features**
  - [ ] Use new hooks where appropriate
  - [ ] Implement Actions
  - [ ] Optimize re-renders
  - [ ] Update form handling
- [ ] **8.4 Performance Audit**
  - [ ] Measure Core Web Vitals
  - [ ] Optimize bundle size
  - [ ] Implement code splitting
  - [ ] Add performance monitoring

### Commit Strategy

- Commit 1: React Compiler setup
- Commit 2: Component optimizations
- Commit 3: Performance improvements

---

## Phase 9: Final Optimizations & Cleanup ⬜

**Status**: Not Started  
**Progress**: 0% ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜

### Goals

- Final cleanup and optimization
- Update all documentation
- Ensure production readiness

### Tasks

- [ ] **9.1 Code Cleanup**
  - [ ] Remove deprecated code
  - [ ] Clean up unused dependencies
  - [ ] Optimize imports
  - [ ] Format all code
- [ ] **9.2 Documentation Updates**
  - [ ] Update README.md
  - [ ] Update CLAUDE.md
  - [ ] Create architecture docs
  - [ ] Update API documentation
- [ ] **9.3 Security Audit**
  - [ ] Review auth implementation
  - [ ] Check for exposed secrets
  - [ ] Update security headers
  - [ ] Review API security
- [ ] **9.4 Production Readiness**
  - [ ] Performance testing
  - [ ] Load testing
  - [ ] Error monitoring setup
  - [ ] Deployment verification

### Commit Strategy

- Commit 1: Code cleanup
- Commit 2: Documentation updates
- Commit 3: Security and production updates

---

## Completed Commits Log

<!-- Update this section as commits are made -->

### Phase 1 Commits

- [x] Jest setup and configuration ✅ (commit: ecb760b)
- [ ] Initial unit tests
- [ ] Playwright setup
- [ ] E2E tests
- [ ] API tests
- [ ] GitHub Actions CI

---

## Notes and Decisions

<!-- Document important decisions and rationale here -->

### Key Decisions

1. **Test-First Approach**: Establishing tests before migration ensures we don't break functionality
2. **Incremental Migration**: Each phase builds on the previous, maintaining a working app
3. **Tailwind v4**: Using latest version with PostCSS setup as recommended
4. **Radix UI**: Chosen for accessibility and composability with Tailwind
5. **Strategic Commits**: Each commit represents a stable, working state

### Risks and Mitigations

1. **Risk**: Breaking changes during Next.js upgrade
   - **Mitigation**: Incremental upgrades with testing at each step
2. **Risk**: Visual regression during UI migration
   - **Mitigation**: Playwright visual testing and side-by-side comparison
3. **Risk**: User disruption during auth migration
   - **Mitigation**: Parallel auth systems with gradual migration

### Rollback Points

Each commit is designed to be a stable rollback point if issues arise.

---

## Resources and References

- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/12/05/react-19)
- [Firebase Auth Migration](https://firebase.google.com/docs/auth/web/start)
