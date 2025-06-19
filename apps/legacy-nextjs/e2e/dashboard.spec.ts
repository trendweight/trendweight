import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('should show login form elements', async ({ page }) => {
    await page.goto('/login');
    
    // Check all form elements are present
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'Email');
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
    
    const signInButton = page.locator('button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
    
    // Check for links
    const forgotPasswordLink = page.locator('text="forgot your password?"');
    await expect(forgotPasswordLink).toBeVisible();
    
    const createAccountLink = page.locator('text="create an account"');
    await expect(createAccountLink).toBeVisible();
  });

  // TODO: Add authenticated dashboard tests once auth is implemented
  test.skip('should display dashboard content when authenticated', async ({ page }) => {
    // This test will be implemented when we have proper auth fixtures
    // It should:
    // 1. Log in with test credentials
    // 2. Navigate to dashboard
    // 3. Verify dashboard elements are visible
    // 4. Check for weight chart
    // 5. Check for recent readings
    // 6. Check for statistics
  });
});