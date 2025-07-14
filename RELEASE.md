# Release Process Documentation

This document describes the automated release process for TrendWeight using Release Please.

## Overview

TrendWeight uses [Release Please](https://github.com/googleapis/release-please) to automate:
- Changelog generation from commit messages
- Version bumping
- GitHub release creation
- Pull request management for releases

## Current Setup

### Release Strategy
- **Single release** for the entire monorepo (both web and API are released together)
- **Alpha prerelease** mode during development (2.0.0-alpha.X)
- **Conventional commits** drive the changelog generation

### Configuration Files

1. **`.github/workflows/release-please.yml`** - GitHub Action workflow
2. **`release-please-config.json`** - Main configuration
   - Contains `bootstrap-sha` pointing to the v2.0.0-alpha.1 tag
   - This ensures Release Please only includes commits after that tag
3. **`.release-please-manifest.json`** - Current version tracking
4. **`VERSION`** - Simple version file for Docker builds and scripts

### Version Progression During Alpha

While in alpha mode, ALL commits increment only the prerelease number:
- `feat:` → 2.0.0-alpha.1 → 2.0.0-alpha.2
- `fix:` → 2.0.0-alpha.2 → 2.0.0-alpha.3
- `feat!:` → 2.0.0-alpha.3 → 2.0.0-alpha.4 (no major bump)

## Initial Setup (REQUIRED)

**Important**: You MUST create a Personal Access Token (PAT) for Release Please to work correctly:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` scope
3. Add it as a repository secret named `RELEASE_PLEASE_TOKEN`

This is required because tags created with the default GITHUB_TOKEN don't trigger other workflows (like the CI workflow that builds Docker images).

## How It Works

1. **You push commits** to `main` with conventional commit messages:
   ```
   feat: add user dashboard widget
   fix: resolve login redirect issue
   ```

2. **Release Please creates/updates a PR** titled "chore(main): release 2.0.0-alpha.2"
   - Updates `CHANGELOG.md` with categorized changes
   - Bumps version in `VERSION` file
   - Updates `apps/web/package.json` version

3. **The PR stays open** and updates automatically as you push more commits

4. **When you merge the PR**:
   - Creates git tag `v2.0.0-alpha.2`
   - Creates GitHub release with changelog
   - Commits the updated files to main
   - Triggers CI workflow to build Docker images with `latest-release` tag

## Transitioning from Alpha to Stable

When feature complete and ready to release 2.0.0:

### Step 1: Update Configuration

Edit `release-please-config.json`:
```json
{
  "prerelease": false,  // Change from true
  // Remove: "prerelease-type": "alpha",
  "bump-patch-for-minor-pre-major": false,  // Change from true
  // ... rest of config
}
```

### Step 2: Merge the Transition

The next Release Please PR will propose version `2.0.0` (without alpha). Merge it to release.

### Step 3: Normal Versioning

After 2.0.0, versions will follow standard patterns:
- `fix:` commits → patch bumps (2.0.0 → 2.0.1)
- `feat:` commits → minor bumps (2.0.1 → 2.1.0)
- Breaking changes → minor bumps (due to `bump-minor-pre-major: true`)

## Commit Message Guidelines

Use conventional commits with emoji prefixes (they work fine with Release Please):

- `✨ feat: add new feature` → Features section
- `🐛 fix: resolve bug` → Bug Fixes section
- `⚡️ perf: improve performance` → Performance section
- `♻️ refactor: reorganize code` → Hidden from changelog
- `📝 docs: update README` → Hidden from changelog
- `🧪 test: add unit tests` → Hidden from changelog

## Manual Version Override

If needed, you can manually set the next version:

1. Update the `VERSION` file
2. Update `.release-please-manifest.json`
3. Commit with message: `chore: release X.Y.Z`

## Docker Integration

The `VERSION` file can be used in your Docker build:

```dockerfile
COPY VERSION /app/VERSION
ARG VERSION=$(cat /app/VERSION)
LABEL version=$VERSION
```

## Troubleshooting

### Release PR not created?
- Check GitHub Actions tab for errors
- Ensure conventional commit format is correct
- Verify branch protections allow PR creation

### Permission errors (can't create labels)?
See the "Initial Setup" section above - you need a PAT with `repo` scope.

### Version not bumping correctly?
- During alpha: This is expected, only prerelease number increments
- After stable: Check `bump-patch-for-minor-pre-major` setting

### Need to skip a release?
Add `[skip-release]` to your commit message:
```
feat: work in progress [skip-release]
```

## Future Considerations

1. **Major Version Bumps**: Currently disabled. To enable after v2.0.0:
   - Remove `"bump-minor-pre-major": true` from config
   - Use `feat!:` or `BREAKING CHANGE:` for major bumps

2. **NPM Publishing**: Can be added to workflow:
   ```yaml
   - run: npm publish
     if: ${{ steps.release.outputs.release_created }}
   ```

3. **Docker Publishing**: Can trigger Docker build on release:
   ```yaml
   - name: Build and push Docker image
     if: ${{ steps.release.outputs.release_created }}
     run: |
       docker build -t trendweight:${{ steps.release.outputs.version }} .
       docker push trendweight:${{ steps.release.outputs.version }}
   ```

## Links

- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Our Release Config](./release-please-config.json)