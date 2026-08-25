// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User/Profile Menu', () => {
  test('Logout Returns to Login Page', async ({ page }) => {
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

    // 2. Open the profile dropdown
    await page.locator('.oxd-userdropdown-tab').click();

    // 3. Click "Logout"
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Expected: session ends and user is redirected to the login page
    await page.waitForURL('**/auth/login');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
