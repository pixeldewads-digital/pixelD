import { test, expect } from '@playwright/test';

test('should navigate to the home page', async ({ page }) => {
  // Start from the index page (the baseURL is set in the config)
  await page.goto('/');
  // The new page should contain an h1 with "Welcome to PixelDew"
  await expect(page.locator('h1')).toContainText('Welcome to PixelDew');
});