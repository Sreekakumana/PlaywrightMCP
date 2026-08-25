import { test, expect } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Playwright/i);
    await page.close();
  });
});
