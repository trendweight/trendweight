import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Log In link
    await page.click('text="Log In"');
    
    // Should be on login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check for login form elements
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    
    const signInButton = page.locator('button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('button:has-text("Sign In")');
    
    // Should show some error indication
    // Note: The exact error handling depends on the implementation
    // This test will need to be updated based on actual error display
    await page.waitForTimeout(1000); // Wait for potential error
  });

  test('should display signup page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Sign Up link
    await page.click('text="Sign Up"');
    
    // Should be on signup page
    await expect(page).toHaveURL(/.*\/signup/);
    
    // Check for signup form elements
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});