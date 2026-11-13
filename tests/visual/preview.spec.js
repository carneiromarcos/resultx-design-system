// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');

const PREVIEW_PATH = path.resolve(__dirname, '..', '..', 'tokens', 'themes', 'preview.html');
const PREVIEW_URL = `file://${PREVIEW_PATH}`;
const FONTS = [
  ['Inter', 400], ['Inter', 500], ['Inter', 600],
  ['Sora', 600], ['Sora', 700],
  ['JetBrains Mono', 400], ['JetBrains Mono', 600],
];

async function openPreview(page) {
  await page.goto(PREVIEW_URL, { waitUntil: 'load' });
  const failures = await page.evaluate(async (fonts) => {
    const failed = [];
    for (const [family, weight] of fonts) {
      const descriptor = `${weight} 16px "${family}"`;
      try {
        const loaded = await document.fonts.load(descriptor);
        if (loaded.length === 0 || !document.fonts.check(descriptor)) failed.push(descriptor);
      } catch {
        failed.push(descriptor);
      }
    }
    await document.fonts.ready;
    return failed;
  }, FONTS);
  expect(failures, `Fontes do preview não carregadas: ${failures.join(', ')}`).toEqual([]);
}

test.describe('DS v2.1 — themes preview', () => {
  test('fontes locais do preview carregam', async ({ page }) => {
    await openPreview(page);
  });

  test('all 3 dashboard themes render correctly side-by-side', async ({ page }) => {
    await openPreview(page);
    await expect(page).toHaveScreenshot('preview-themes.png', { fullPage: true });
  });

  test('vibrant-dark theme block renders independently', async ({ page }) => {
    await openPreview(page);
    await expect(page.locator('[data-theme="vibrant-dark"]')).toHaveScreenshot('vibrant-dark-frame.png');
  });

  test('premium-light theme block renders independently', async ({ page }) => {
    await openPreview(page);
    await expect(page.locator('[data-theme="premium-light"]')).toHaveScreenshot('premium-light-frame.png');
  });

  test('sober-dark theme block renders independently', async ({ page }) => {
    await openPreview(page);
    await expect(page.locator('[data-theme="sober-dark"]')).toHaveScreenshot('sober-dark-frame.png');
  });
});
