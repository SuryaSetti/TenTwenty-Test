import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

declare const process: { env: Record<string, string | undefined>; argv: string[] };

// Slow motion is only applied to headed runs (npm run test:bdd:headed) so the actions are easy to follow.
// Override with SLOW_MO=<ms>.
const slowMo = Number(process.env.SLOW_MO ?? (process.argv.includes('--headed') ? 500 : 0));

const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
});

export default defineConfig({
  fullyParallel: true,
  timeout: 60_000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: { slowMo },
  },
  projects: [
    {
      name: 'chromium',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'bdd',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
