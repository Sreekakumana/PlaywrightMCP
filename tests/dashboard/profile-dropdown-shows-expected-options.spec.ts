// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('User/Profile Menu', () => {
  test('Profile Dropdown Shows Expected Options', async ({ page }) => {
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

    // 2. Click the profile dropdown in the top-right of the topbar
    await page.getByText('Demo Source').click();

    // Expected: dropdown menu shows About, Support, Change Password, Logout
    const menu = page.getByRole('menu');
    await expect(menu.getByRole('menuitem', { name: 'About' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Support' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Change Password' })).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Logout' })).toBeVisible();
  });
});
