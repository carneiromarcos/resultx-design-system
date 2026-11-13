// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * ResultX DS — Visual Regression Configuration
 *
 * Tests live in tests/visual/. CI phase A generates Linux snapshots for review;
 * macOS snapshots stay committed. After Linux snapshots are reviewed and
 * committed, phase B will compare them in CI instead of updating them.
 *
 * Run locally:
 *   npm run test:visual              # compare against baseline
 *   npm run test:visual -- -u        # update baseline (after intentional change)
 */
module.exports = defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    // file:// scheme — preview.html is fully static.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      // Allow tiny pixel differences (font rendering, anti-aliasing).
      maxDiffPixelRatio: 0.005,
      threshold: 0.2,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],
});
