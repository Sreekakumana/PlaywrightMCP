// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Sidebar Navigation', () => {
  test('Sidebar Contains All Expected Modules', async ({ page }) => {
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

    // 2. Inspect the left sidebar navigation list
    const sidebar = page.getByRole('navigation', { name: 'Sidepanel' });
    const modules = [
      'Admin',
      'PIM',
      'Leave',
      'Time',
      'Recruitment',
      'My Info',
      'Performance',
      'Dashboard',
      'Directory',
      'Maintenance',
      'Claim',
      'Buzz',
    ];

    // Expected: each module link is visible with the correct label
    for (const name of modules) {
      await expect(sidebar.getByRole('link', { name, exact: true })).toBeVisible();
    }
  });
});
