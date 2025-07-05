# Missing Functionality Implementation Plan

## Overview
This plan addresses the missing functionality identified in the new Vite + React/C# API implementation compared to the legacy Next.js app.

## Implementation Approach
Each phase will be implemented completely, followed by a pause for commit using the custom slash command before proceeding to the next phase.

## Phase 1: Profile API Endpoint ✅
**Purpose:** Create a separate profile endpoint for dashboard rendering and future sharing features

**Implementation:**
- [x] Create `ProfileController.cs` in Features/Users
- [x] Add `[Route("api/profile")]` endpoint for authenticated users
- [x] Return ProfileData (subset of SettingsData) excluding email/uid
- [x] Use existing UserService to fetch from Supabase
- [x] Test the endpoint works with the frontend
- [x] Update dashboard to use dedicated profile endpoint

**Completed:** Commit 1b5fbf6

**Why needed:**
- Dashboard needs profile data to render correctly (timezone, metric units, etc.)
- Future sharing feature will allow anonymous users to view dashboards
- Keeps sensitive data (email, uid) separate from display preferences

## Phase 2: BProgress Integration ✅
**Purpose:** Add progress indicators for better UX during navigation and data loading

**Implementation:**
- [x] Install BProgress React package: `npm install @bprogress/react`
- [x] Add `ProgressProvider` wrapper in `App.tsx`
- [x] Create `lib/progress/progress.ts` for state management
- [x] Create custom CSS file with legacy NProgress styling:
   - Progress color: `#eef5ff` (light blue)
   - Bar height: 3px
   - Spinner: 18x18px in upper right (top: 21px, right: 16px)
   - Mobile responsive: spinner right: 6px on screens < 768px
   - Blur effect on progress bar
- [x] Create `BackgroundQueryProgress` component for TanStack Query
- [x] Integrate with TanStack Router navigation events
- [x] Test progress indicators work on route changes and API calls
- [x] Fix reference counting bug with centralized progress manager

**Completed:** Commit 7cdfffd

## Phase 3: Custom Error Pages
**Purpose:** Provide user-friendly error pages with proper SEO signals

**Implementation:**
- [ ] Create `routes/[...404].tsx` with alien abduction theme
- [ ] Create error boundary for 500 errors with error guy image
- [ ] Create `routes/build.tsx` for deployment details
- [ ] Use React 19 native `<title>` and `<meta>` tags for SEO
- [ ] Style to match legacy UI exactly
- [ ] Test 404 handling and error boundary

**SEO approach:**
- Use `<meta name="robots" content="noindex, nofollow" />` for 404s
- Google recognizes this as a "soft 404" signal
- Standard practice for SPAs

## Phase 4: Migrate to React 19 Head Management
**Purpose:** Use React 19's native head management instead of custom hooks

**Implementation:**
- [ ] Replace all `useDocumentTitle` calls with native `<title>` tags
- [ ] Remove the custom `useDocumentTitle` hook
- [ ] Update any pages that need meta tags
- [ ] Test all page titles still work correctly

**Benefits:**
- Follows React 19 best practices
- No external dependencies needed
- Cleaner, more standard code

## Phase 5: Clean Up Email Verification
**Purpose:** Remove unnecessary email verification since magic links verify emails

**Implementation:**
- [ ] Remove `/auth/verify` route
- [ ] Remove any references to email verification
- [ ] Update any auth flow documentation
- [ ] Test auth flow still works smoothly

## Technical Notes
- BProgress is a modern TypeScript rewrite of NProgress
- React 19's native head management eliminates need for react-helmet-async
- SPA 404s will return HTTP 200 but with noindex meta tag (standard practice)
- Profile/Settings separation enables future dashboard sharing
- All solutions follow current Vite + React best practices