import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check the page title
    await expect(page).toHaveTitle(/TrendWeight/);
    
    // Check that main sections are visible
    const banner = page.locator('text="TrendWeight"').first();
    await expect(banner).toBeVisible();
  });

  test('should have call to action buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check for Learn More button
    const learnMore = page.locator('text="Learn More"');
    await expect(learnMore).toBeVisible();
    
    // Check for Works with Withings/Fitbit
    await expect(page.locator('text="Works with"').first()).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });
});