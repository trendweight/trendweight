import { test, expect } from '@playwright/test';

test.describe('Settings', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access settings without authentication
    await page.goto('/settings');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  // TODO: Add authenticated settings tests
  test.skip('should display settings options when authenticated', async ({ page }) => {
    // This test will be implemented when we have proper auth fixtures
    // It should:
    // 1. Log in with test credentials
    // 2. Navigate to settings
    // 3. Verify settings sections:
    //    - Account settings
    //    - Units preferences (metric/imperial)
    //    - Timezone settings
    //    - Connected devices (Withings/Fitbit)
    //    - Data export options
  });

  test.skip('should allow connecting fitness devices', async ({ page }) => {
    // Test Withings connection flow
    // Test Fitbit connection flow
  });
});