import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  // The public demo server is occasionally flaky/rate-limited under heavy automated
  // use; retry a failed test before reporting it as a real failure.
  retries: 2,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'results.xml' }]]
    : [['html', { open: 'always' }]],
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://opensource-demo.orangehrmlive.com',
  },
  projects: [
    { name: 'chromium', testIgnore: 'tests/api/**', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
      use: {
        // Trailing slash matters: request paths like 'pet/1' resolve relative to it.
        baseURL: 'https://petstore3.swagger.io/api/v3/',
        extraHTTPHeaders: { Accept: 'application/json' },
      },
    },
  ],
});
