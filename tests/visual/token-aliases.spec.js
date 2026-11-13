// Os aliases são opcionais e acompanham trocas de tema no mesmo elemento.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const preview = pathToFileURL(path.resolve(__dirname, '../../tokens/themes/preview.html')).href;
const aliases = pathToFileURL(path.resolve(__dirname, '../../tokens/legacy-aliases.css')).href;
const pairs = [
  ['--bg-card', '--bg-surface-2'],
  ['--accent-teal', '--accent-primary'],
  ['--accent-teal-hover', '--accent-primary-hover'],
  ['--accent-teal-muted', '--accent-primary-muted'],
  ['--accent-on-dark', '--accent-primary-text'],
];

test('aliases opt-in acompanham os tokens do tema aplicado', async ({ page }) => {
  await page.goto(preview);
  await page.addStyleTag({ url: aliases });
  await page.evaluate(() => {
    const container = document.createElement('div');
    container.id = 'test-theme';
    document.body.appendChild(container);
  });
  for (const theme of ['dark', 'light', 'premium-light', 'sober-dark', 'vibrant-dark']) {
    await page.locator('#test-theme').evaluate((element, value) => { element.dataset.theme = value; }, theme);
    const result = await page.locator('#test-theme').evaluate((element, expected) => {
      const css = getComputedStyle(element);
      return expected.map(([alias, role]) => ({ alias, role, actual: css.getPropertyValue(alias).trim(), target: css.getPropertyValue(role).trim() }));
    }, pairs);
    for (const pair of result) {
      // Um papel ausente deve ser tratado como tal, sem fabricar cor de fallback.
      expect(pair.actual, `${theme}: ${pair.alias}`).toBe(pair.target);
    }
  }
});
