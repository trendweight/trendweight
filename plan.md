# TrendWeight Migration Plan

## Notes

- **Project**: Migrate a legacy Next.js application to a new architecture: a Vite (React) frontend and a C# ASP.NET Core backend.
- **References**: The `legacy-nextjs` app is the reference for UI and business logic. The `trendweight-classic` app is a secondary reference for business logic only and should **not** be used for UI.
- **Project Guidelines**: `CLAUDE.md` provides important context, including the need to thoroughly analyze legacy code before implementing new features.
- **Architectural Fidelity**: The migration to C# should faithfully replicate the architecture and separation of concerns from the legacy Next.js app.
- **Dev Server Status**: The C# API is running on `http://localhost:5199` and the Vite dev server is running on `http://localhost:5174`. Both are in watch mode and will restart on changes. I should not manage the servers.
- **Vite Proxy**: The Vite dev server proxies all `/api` requests to the C# backend. This means the browser only communicates with the Vite server, and complex CORS policies on the backend for the frontend origin are not required.
- **Authentication Fixed**: The client-side race condition causing an initial 401 Unauthorized error has been resolved. Authenticated API calls now wait for Firebase to initialize.
- **API Response Structure**: The `/api/settings` endpoint correctly mimics the legacy API by returning a nested object: `{ user: SettingsData, timestamp: string }`.
- **Backend Responsibilities**: The C# API should only replicate the server-side logic from the legacy app (data access, vendor APIs). It is responsible for providing raw data to the frontend.
- **C# Naming Convention**: C# properties should be `PascalCase`. The API should automatically serialize JSON responses to `camelCase`.
- **Backend Serialization**: The C# API is now configured for automatic `camelCase` serialization for both API JSON responses and Firestore documents. This was achieved by configuring JSON options in `Program.cs` and implementing a custom `CamelCaseFirestoreConverter<T>` for Firestore.
- **Settings Update**: The legacy app does not have a POST/PUT endpoint for user settings. This functionality is not part of the migration.
- **Withings Integration Strategy**: Per user feedback, the Withings integration will be implemented iteratively. First, a test endpoint will be created to verify direct API calls to Withings. This test endpoint must use the authenticated user's credentials to fetch a real Withings token from Firestore. Once that is working, the full data refresh logic (merging with Firestore data) will be implemented.
- **Legacy Data Flow**: Analysis of the legacy `pages/api/data.ts` reveals a multi-step process: check if a refresh is needed (based on a 5-minute cache), refresh the Withings token if it's expiring, fetch new measurements since the last partial sync, merge them with existing data from Firestore, and update Firestore with the new data.
- **Client-side Responsibilities**: The Vite frontend is responsible for all UI, state management, and data computations, such as trend calculation.
- **C# API Structure**: The API is organized by features (e.g., `Features/Settings`). It has a `FirebaseService` for authentication and a new `FirestoreService` for data access.
- **Frontend API Client**: The frontend uses a structured approach for API calls with React Query. `lib/api/client.ts` contains the base `apiRequest` function. `lib/api/types.ts` holds all TypeScript interfaces for API responses. `lib/api/queries.ts` centralizes all React Query hooks (`use...`) and query keys.
- **Dashboard Testing**: Per user feedback, API tests on the dashboard should run automatically on page load (similar to the settings and auth tests) and display truncated results, rather than being triggered by a button.
- **Firestore Serialization Issue**: There is a persistent runtime error when saving the refreshed Withings token back to Firestore (`System.ArgumentException: Unable to create converter for type System.Text.Json.JsonElement`). This occurs because the object being saved contains a `JsonElement`, likely carried over from the initial deserialization from Firestore. Attempts to fix this by creating a new, clean object have also failed, suggesting a more fundamental issue with the object serialization pipeline. The next step is to step back and find a robust way to update documents in Firestore without triggering this error.

## Task List

### Phase 1: Foundation (Complete)

- [x] Set up monorepo structure (`apps/legacy-nextjs`, `apps/api`, `apps/web`).
- [x] Initialize C# API and Vite React projects.
- [x] Implement static pages (Home, About, FAQ, Privacy, Tip Jar).
- [x] Implement frontend authentication flow (UI and Firebase SDK integration).

### Phase 2: Backend API Development

- [x] Implement and verify Firebase JWT authentication in the C# API.
- [x] Connect the Vite frontend to the C# backend API for testing.
  - [x] Add a test endpoint to the C# API.
  - [x] Add a React Query hook (`useTestData`) to call the test endpoint.
  - [x] Update the Dashboard to display the test data.
- [x] Fix client-side auth race condition.
  - [x] Update authenticated components (e.g., Dashboard) to use the `isInitializing` state from `useAuth` to show a loading state and prevent premature API calls.
  - [x] Fix TypeScript error in `useTestData` by allowing it to accept React Query options.
  - [x] Verify that the initial 401 error is eliminated and dashboard loads correctly.
- [x] Create GET API endpoint for user settings.
  - [x] Analyze legacy `pages/api/settings.ts` to understand data fetching and auth.
  - [x] Use existing C# models for user settings (`SettingsData`, `ProfileData`).
  - [x] Implement a Firestore service in C# to interact with Firestore collections.
  - [x] Register `FirestoreService` for dependency injection.
  - [x] Create a `SettingsController` with a `GET /api/settings` endpoint.
  - [x] Secure the endpoint and use the user's UID from the JWT to fetch their settings.
  - [x] Verify the `GET /api/settings` endpoint works correctly.
    - [x] Fix API startup failures, auth issues, and deserialization errors.
    - [x] Implement automatic camelCase serialization for Firestore and API responses.
    - [x] Update frontend to handle the settings API response.
    - [x] Verify settings data is displayed correctly on the Dashboard.
- [x] Commit changes for GET settings endpoint and camelCase serialization.
- [ ] Create API endpoint to serve dashboard data.
  - [x] Analyze legacy `pages/api/data.ts`, `lib/vendors/refresh-data.ts`, and `lib/vendors/withings.ts` to understand the full data refresh sequence.
  - [x] Create C# models for Withings API and data structures based on `lib/core/interfaces.ts`.
    - [x] Create `RawMeasurement` and `SourceData` models.
    - [x] Verify existing `AccessToken`, `VendorLink`, and `Links` models.
    - [x] Create Withings API response models (`WithingsResponse`, `WithingsMeasure`).
    - [x] Create remaining Withings models (`WithingsMeasureGroup`, `WithingsGetMeasuresResponse`).
  - [ ] Implement and test Withings API service.
    - [x] Implement `IWithingsService` and `WithingsService` class with methods for token refresh and measurement fetching.
    - [x] Add Withings client ID and secret to `appsettings.Development.json`.
    - [x] Register `WithingsConfig` and `WithingsService` for dependency injection.
    - [x] Create a temporary test endpoint (`GET /api/withings/test`).
    - [ ] Implement token refresh logic in the test endpoint.
      - [ ] Diagnose and fix the Firestore `JsonElement` serialization error that occurs when saving the refreshed token.
      - [ ] Investigate alternative Firestore update strategies (e.g., `UpdateAsync` with specific fields vs. `SetAsync` with a full object).
      - [ ] Verify that a refreshed token can be successfully persisted in Firestore.
    - [ ] Add measurement fetching logic to the test endpoint.
    - [ ] Verify the test endpoint works correctly by calling it from the frontend.
  - [ ] Implement core data refresh logic in a new `DataService`.
    - [ ] Fetch user links and settings from Firestore.
    - [ ] Check if data needs to be refreshed based on `lastUpdate` timestamp.
  - [ ] Create a `DataController` with a `GET /api/data` endpoint.
    - [ ] Secure the endpoint.
    - [ ] Use the `DataService` to get the latest data.
    - [ ] Return the measurement data.

### Phase 3: Authenticated Frontend Development

- [ ] Implement the Settings page UI to display user settings (read-only).
- [ ] Implement client-side trend calculation logic (referencing legacy `lib/dashboard/computations/`).
- [ ] Implement the Dashboard page UI, connecting to the data API and displaying the calculated trend.

### Phase 4: Testing & Deployment

- [ ] Add E2E and integration tests.
- [ ] Deploy the C# API and Vite SPA.

## Current Goal

Fix the Firestore serialization error.
