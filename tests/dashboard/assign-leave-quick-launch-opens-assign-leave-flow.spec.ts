// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quick Launch Actions', () => {
  test('Assign Leave Quick Launch Opens Assign Leave Flow', async ({ page }) => {
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

    // 2. Click the "Assign Leave" tile in Quick Launch
    await page.getByRole('button', { name: 'Assign Leave' }).click();

    // Expected: application navigates to the Assign Leave form
    await page.waitForURL('**/leave/assignLeave');
    await expect(page.getByRole('heading', { name: 'Assign Leave', exact: true })).toBeVisible();
  });
});
