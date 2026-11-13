const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const yaml = require('js-yaml');
// Outro adaptador só é conforme após executar todos os casos contra sua própria vitrine.
// RESULTX_ADAPTER_URL aceita URL http(s) ou file; use os mesmos IDs e estados do fixture.
const url = process.env.RESULTX_ADAPTER_URL || pathToFileURL(path.resolve('examples/pilot.html')).href;
const themedUrl = (theme) => { const u = new URL(url); u.searchParams.set('theme', theme); return u.href; };
const files = fs.readdirSync('contracts').filter((f) => f.endsWith('.yaml')).sort();
const cases = files.flatMap((f) => yaml.load(fs.readFileSync(path.join('contracts', f), 'utf8')).casos_teste.map((c) => c.id));

const { checks } = require('./lib/pilot-cases');

test('cada caso dos contratos tem implementação executável', () => {
  expect([...cases].sort()).toEqual(Object.keys(checks).sort());
  expect(new Set(cases).size).toBe(cases.length);
});
for (const theme of ['light', 'dark']) {
  for (const id of cases) {
    test(`${theme}: ${id}`, async ({ page }) => { await page.goto(themedUrl(theme)); await checks[id](page); });
  }
}

// Baselines Linux devem ser geradas no CI e aprovadas pelo Revisor.
for (const theme of ['light', 'dark']) {
  test(`baseline piloto ${theme}`, async ({ page }) => {
    await page.goto(themedUrl(theme));
    await expect(page).toHaveScreenshot(`pilot-${theme}.png`, { fullPage: true });
  });
}
