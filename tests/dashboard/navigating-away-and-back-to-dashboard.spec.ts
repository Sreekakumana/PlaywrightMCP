// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  test('Navigating Away and Back to Dashboard', async ({ page }) => {
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

    // 2. Click the "PIM" sidebar link
    await page.getByRole('navigation', { name: 'Sidepanel' }).getByRole('link', { name: 'PIM' }).click();

    // 3. Verify navigation to the PIM module
    await page.waitForURL('**/pim/**');

    // 4. Click the "Dashboard" sidebar link
    await page.getByRole('navigation', { name: 'Sidepanel' }).getByRole('link', { name: 'Dashboard' }).click();

    // Expected: user returns to dashboard/index and dashboard widgets are visible again
    await page.waitForURL('**/dashboard/index');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Quick Launch', { exact: true })).toBeVisible();
  });
});
