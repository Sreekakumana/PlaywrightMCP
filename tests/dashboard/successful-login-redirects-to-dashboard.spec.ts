// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dashboard Access & Load', () => {
  test('Successful Login Redirects to Dashboard', async ({ page }) => {
    // 1. Navigate to /web/index.php/auth/login
    await page.goto('/web/index.php/auth/login');

    // 2. Fill "Username" with Admin
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');

    // 3. Fill "Password" with admin123
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');

    // 4. Click the "Login" button
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

    // Expected: browser navigates to dashboard/index and "Dashboard" heading is visible
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});
