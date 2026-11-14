const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('url');
const path = require('path');
const { controlBoundary, textContrast } = require('./lib/contract-probes');

test.skip(Boolean(process.env.RESULTX_ADAPTER_URL), 'Autoteste exclusivo da vitrine DS');
test.beforeEach(async ({ page }) => {
  await page.goto(`${pathToFileURL(path.resolve('examples/pilot.html')).href}?theme=light`);
});
test('N1: preenchimento amarelo com borda neutra passa', async ({ page }) => {
  await page.addStyleTag({ content: ':root { --accent-primary: #cccc00; }' });
  await controlBoundary(page, '#primary');
});
test('N2: borda amarela falha', async ({ page }) => {
  await page.addStyleTag({ content: '.rx-button--primary { border-color: #cccc00 !important; }' });
  await expect(controlBoundary(page, '#primary')).rejects.toThrow();
});
test('N3a: amarelo sem borda falha', async ({ page }) => {
  await page.addStyleTag({ content: '.rx-button--primary { border: none !important; background: #cccc00 !important; }' });
  await expect(controlBoundary(page, '#primary')).rejects.toThrow();
});
test('N3b: preenchimento escuro sem borda passa', async ({ page }) => {
  await page.addStyleTag({ content: '.rx-button--primary { border: none !important; background: #1c2444 !important; }' });
  await controlBoundary(page, '#primary');
});
test('N4: texto com baixo contraste falha', async ({ page }) => {
  await page.addStyleTag({ content: '.rx-button--primary { --text-inverse: #1d4ed8; }' });
  await expect(textContrast(page, '#primary')).rejects.toThrow();
});
test('N5: borda amarela no hover falha', async ({ page }) => {
  await page.addStyleTag({ content: '.rx-button--primary { --accent-primary-hover: #cccc00; } .rx-button--primary:hover { border-color: var(--accent-primary-hover) !important; }' });
  await page.locator('#primary').hover();
  await expect(controlBoundary(page, '#primary')).rejects.toThrow();
});
