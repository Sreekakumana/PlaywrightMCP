// spec: specs/orangehrm-dashboard.plan.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dashboard Access & Load', () => {
  test('Unauthenticated Access Redirects to Login', async ({ page }) => {
    // 1. With no active session (fresh context), navigate directly to /web/index.php/dashboard/index
    await page.goto('/web/index.php/dashboard/index');

    // Expected: application redirects to the login page instead of showing the dashboard
    await page.waitForURL('**/auth/login');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
