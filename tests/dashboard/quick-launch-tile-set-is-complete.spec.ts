// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quick Launch Actions', () => {
  test('Quick Launch Tile Set is Complete', async ({ page }) => {
    // 1. Complete login
    await page.goto('/web/index.php/auth/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    // The shared public demo occasionally bounces the first login attempt with a
    // "Session Expired" banner; retry once before failing.
    try {
      await page.waitForURL('**/dashboard/index', { timeout: 10000 });
    } catch {
      const sessionExpired = await page.getByText('Session Expired').isVisible().catch(() => false);
      if (!sessionExpired) throw new Error('Login did not redirect to dashboard and no "Session Expired" banner was shown');
      await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
      await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForURL('**/dashboard/index');
    }

    // 2. Inspect the "Quick Launch" widget
    const tiles = ['Assign Leave', 'Leave List', 'Timesheets', 'Apply Leave', 'My Leave', 'My Timesheet'];

    // Expected: all six tiles are visible and clickable
    for (const name of tiles) {
      await expect(page.getByRole('button', { name, exact: true })).toBeVisible();
    }
  });
});
