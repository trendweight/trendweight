# Changelog

## [2.0.0-alpha.6](https://github.com/ervwalter/trendweight/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2025-07-18)


### Features

* add Cloudflare Turnstile CAPTCHA to authentication ([9f6c6ae](https://github.com/ervwalter/trendweight/commit/9f6c6ae58683f8dd22a57755dde2d2cccacc9450))
* add download page for viewing and exporting scale readings ([993819c](https://github.com/ervwalter/trendweight/commit/993819c438de63463ef517daa23cd25f76a48616))
* implement complete account deletion functionality ([1f14a10](https://github.com/ervwalter/trendweight/commit/1f14a104c87bb22693c9b447cc190093a6aee59c))
* implement interactive explore mode for dashboard charts ([dcb7c31](https://github.com/ervwalter/trendweight/commit/dcb7c317ed0b63a8555d2e2639550607c126d6cd))
* implement legacy user migration from classic TrendWeight ([22b77f5](https://github.com/ervwalter/trendweight/commit/22b77f57b86c356f2f4c2b4f828fe2040984207f))
* implement secure dashboard sharing functionality ([7d30057](https://github.com/ervwalter/trendweight/commit/7d30057c2b3db6816ad283259a16048399497b7d))


### Bug Fixes

* improve OAuth callback error handling and make token exchange idempotent ([fd61711](https://github.com/ervwalter/trendweight/commit/fd61711aecc478772923b5d0304ac268897caa98))


### Documentation

* update project status to reflect completed data export feature ([993819c](https://github.com/ervwalter/trendweight/commit/993819c438de63463ef517daa23cd25f76a48616))


### Code Refactoring

* simplify footer version link to always use /build page ([9eecd60](https://github.com/ervwalter/trendweight/commit/9eecd6053bf3cbcceaae4ce04bf30e76b2a32c6b))
* unify toggle button components and move to ui folder ([993819c](https://github.com/ervwalter/trendweight/commit/993819c438de63463ef517daa23cd25f76a48616))

## [2.0.0-alpha.5](https://github.com/ervwalter/trendweight/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2025-07-15)


### Features

* create Button component with multiple variants and sizes ([e5ace77](https://github.com/ervwalter/trendweight/commit/e5ace772998a0887cf20c3e44b95d0131c0ef1e3))
* enhance build page with support tools and changelog display ([55b491d](https://github.com/ervwalter/trendweight/commit/55b491d824493d583a90ac6347d41183b024e5ba))
* implement shared dashboard URLs with third-person view ([2e40281](https://github.com/ervwalter/trendweight/commit/2e40281a2753306a8b31ce9bf4d093476547ae6e))
* improve dashboard UI and chart display ([512e6aa](https://github.com/ervwalter/trendweight/commit/512e6aae73727cb42730f9389d6becccbef6c8d3))


### Bug Fixes

* remove unused isAuthError variable in ProviderSyncError ([e5ace77](https://github.com/ervwalter/trendweight/commit/e5ace772998a0887cf20c3e44b95d0131c0ef1e3))


### Documentation

* add UI component usage guidelines to CLAUDE.md and ARCHITECTURE.md ([e5ace77](https://github.com/ervwalter/trendweight/commit/e5ace772998a0887cf20c3e44b95d0131c0ef1e3))


### Code Refactoring

* replace direct heading tags with Heading component ([c23b00c](https://github.com/ervwalter/trendweight/commit/c23b00c9f306a82536cc38bf5b5becf857892658))
* standardize UI components across application ([e5ace77](https://github.com/ervwalter/trendweight/commit/e5ace772998a0887cf20c3e44b95d0131c0ef1e3))


### Dependencies

* update npm dependencies ([be20f27](https://github.com/ervwalter/trendweight/commit/be20f2788e4ebef0fa1b033d65da7c75838f645b))

## [2.0.0-alpha.4](https://github.com/ervwalter/trendweight/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2025-07-14)


### Bug Fixes

* **ci:** require PAT for Release Please to trigger tag workflows ([9cd9bd7](https://github.com/ervwalter/trendweight/commit/9cd9bd704435c3b9fb7ecdeada2b505d55b526ec))

## [2.0.0-alpha.3](https://github.com/ervwalter/trendweight/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2025-07-14)


### Bug Fixes

* **ci:** enable Docker push for tagged releases ([20740d3](https://github.com/ervwalter/trendweight/commit/20740d305a2d74f9b5b1af2b001f5aa3a719e1c5))
* push Docker images when building from release tags ([f98aa5a](https://github.com/ervwalter/trendweight/commit/f98aa5aa88b2c32309b8cf58ea988dcff17d65ec))

## [2.0.0-alpha.2](https://github.com/ervwalter/trendweight/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2025-07-14)


### Features

* add dashboard help link and improve math explanation ([778b29f](https://github.com/ervwalter/trendweight/commit/778b29f6ffade88bb9d0705e803d23d780b038ed))
* add demo mode with sample data for dashboard ([1c9eccd](https://github.com/ervwalter/trendweight/commit/1c9eccd0ef1d6ea75e319fec3b698f612411a3b9))
* add GitHub Sponsors integration ([ff14486](https://github.com/ervwalter/trendweight/commit/ff14486dc1a64a0dd7d57f6115e115e344716ea1))
* add initial setup flow with profile creation ([0894dc0](https://github.com/ervwalter/trendweight/commit/0894dc06cc44d89ab21299fd63defeecca41cee5))
* add math explanation page with interactive table of contents ([f9b16d4](https://github.com/ervwalter/trendweight/commit/f9b16d454b50fc4f89700846d6cf7803afdfd3ea))
* add OAuth error handling with dashboard recovery UI ([4efa442](https://github.com/ervwalter/trendweight/commit/4efa44205716d69f5966a55146e6f557fa69ea06))
* add Plausible analytics tracking ([159c96d](https://github.com/ervwalter/trendweight/commit/159c96ddecf538d709ab44f7015c7c31523f7136))
* add PWA support for iOS Add to Home Screen ([59b0863](https://github.com/ervwalter/trendweight/commit/59b086372e92e759d97cf1b7478d26302881fed4))
* improve login flow and mobile chart display ([f621620](https://github.com/ervwalter/trendweight/commit/f6216209084d13cd581ece632693f4d665c461de))


### Bug Fixes

* add prerelease versioning strategy ([5c78f96](https://github.com/ervwalter/trendweight/commit/5c78f964a9f10ecffdbe3f5b69ffd881e6a7add9))
* **ci:** update to non-deprecated googleapis/release-please-action ([5c78f96](https://github.com/ervwalter/trendweight/commit/5c78f964a9f10ecffdbe3f5b69ffd881e6a7add9))
* configure Release Please for proper alpha versioning ([5c78f96](https://github.com/ervwalter/trendweight/commit/5c78f964a9f10ecffdbe3f5b69ffd881e6a7add9))
* move changelog-sections to root level for proper scope filtering ([3b160dc](https://github.com/ervwalter/trendweight/commit/3b160dc1b07ae9f136d1a5983e8b5a07775489fb))
* OAuth redirect to auth/verify for proper verification ([da254af](https://github.com/ervwalter/trendweight/commit/da254af4fc363e724425674cc5c29844efa07f42))
* remove bootstrap-sha that was causing all commits to be included ([5c78f96](https://github.com/ervwalter/trendweight/commit/5c78f964a9f10ecffdbe3f5b69ffd881e6a7add9))
* remove component prefix to match existing tag format ([0d95017](https://github.com/ervwalter/trendweight/commit/0d9501726c5d68cc2e63e773e20e40d4900ecb7e))
* remove unused timezone field and add settings help text ([5b0b41d](https://github.com/ervwalter/trendweight/commit/5b0b41d5c9700c18931f6558dcdc610e16b3c384))
* resolve code analysis warnings from enhanced .NET checks ([e88e241](https://github.com/ervwalter/trendweight/commit/e88e241b07735fba17a181b76624097b5bc90fc3))
* resolve linter warnings and improve code quality ([d235801](https://github.com/ervwalter/trendweight/commit/d2358010eb492f7fe3183d8003bdc61a860a3259))
* resolve OAuth token expiration timezone issues ([d660ccb](https://github.com/ervwalter/trendweight/commit/d660ccbc88c9dab05988a92b97e9f7b4d0d11ce7))
* update Dockerfile for npm workspaces compatibility ([f8d343b](https://github.com/ervwalter/trendweight/commit/f8d343be8ba40ec26d60c32cccf69a35aa1c3eb4))


### Documentation

* add troubleshooting for permission errors ([5c78f96](https://github.com/ervwalter/trendweight/commit/5c78f964a9f10ecffdbe3f5b69ffd881e6a7add9))
* show documentation changes in changelog ([0d95017](https://github.com/ervwalter/trendweight/commit/0d9501726c5d68cc2e63e773e20e40d4900ecb7e))
