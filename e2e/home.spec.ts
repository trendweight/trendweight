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

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check for key navigation elements
    const logInLink = page.locator('text="Log In"');
    await expect(logInLink).toBeVisible();
    
    const signUpLink = page.locator('text="Sign Up"');
    await expect(signUpLink).toBeVisible();
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