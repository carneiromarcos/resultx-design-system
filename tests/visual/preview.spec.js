// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const PREVIEW_PATH = path.resolve(__dirname, '..', '..', 'tokens', 'themes', 'preview.html');
const PREVIEW_URL = `file://${PREVIEW_PATH}`;

test.describe('DS v2.1 — themes preview', () => {
  test('all 3 dashboard themes render correctly side-by-side', async ({ page }) => {
    await page.goto(PREVIEW_URL, { waitUntil: 'load' });

    // Inline script appends heatmap dots on DOMContentLoaded; small delay is
    // safer than waitForFunction (Playwright's waitForFunction occasionally
    // hangs on file:// URLs without explicit reason).
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('preview-themes.png', {
      fullPage: true,
    });
  });

  test('vibrant-dark theme block renders independently', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    await page.waitForTimeout(500);

    const vibrantFrame = page.locator('[data-theme="vibrant-dark"]');
    await expect(vibrantFrame).toHaveScreenshot('vibrant-dark-frame.png');
  });

  test('premium-light theme block renders independently', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    await page.waitForTimeout(500);

    const premiumFrame = page.locator('[data-theme="premium-light"]');
    await expect(premiumFrame).toHaveScreenshot('premium-light-frame.png');
  });

  test('sober-dark theme block renders independently', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    await page.waitForTimeout(500);

    const soberFrame = page.locator('[data-theme="sober-dark"]');
    await expect(soberFrame).toHaveScreenshot('sober-dark-frame.png');
  });
});
