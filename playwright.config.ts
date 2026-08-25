import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'results.xml' }]]
    : [['html', { open: 'always' }]],
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://opensource-demo.orangehrmlive.com',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
