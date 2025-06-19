import { test as base, expect } from '@playwright/test';

export interface AuthFixtures {
  authenticatedPage: any;
}

// Extend basic test by providing authenticated page
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // TODO: Implement proper authentication once auth system is ready
    // For now, we'll just provide the regular page
    // In the future, this will:
    // 1. Navigate to login
    // 2. Fill in credentials
    // 3. Submit form
    // 4. Wait for redirect to dashboard
    
    await use(page);
  },
});

export { expect } from '@playwright/test';