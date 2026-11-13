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

// A vitrine de referência usa Inter 400, 600 e 700 no adaptador e nos títulos.
const PILOT_FONTS = [['Inter', 400], ['Inter', 600], ['Inter', 700]];
async function openPilotCapture(page, theme) {
  await page.goto(themedUrl(theme), { waitUntil: 'load' });
  const failures = await page.evaluate(async (fonts) => {
    const failed = [];
    for (const [family, weight] of fonts) {
      const descriptor = `${weight} 16px "${family}"`;
      try {
        const loaded = await document.fonts.load(descriptor);
        const exact = loaded.some((face) => face.family === family && face.weight === String(weight) && face.status === 'loaded');
        if (!exact || !document.fonts.check(descriptor)) failed.push(descriptor);
      } catch {
        failed.push(descriptor);
      }
    }
    await document.fonts.ready;
    return failed;
  }, PILOT_FONTS);
  expect(failures, `Fontes da vitrine não carregadas: ${failures.join(', ')}`).toEqual([]);
}

// Suspende apenas a conclusão simulada da confirmação para capturar o estado real.
async function startPendingConfirmation(page) {
  await page.locator('#open-dialog').click();
  await page.evaluate(() => {
    const original = window.setTimeout;
    window.setTimeout = (callback, delay, ...args) => {
      if (delay === 500) {
        window.__pilotFinish = () => callback(...args);
        return 0;
      }
      return original(callback, delay, ...args);
    };
    window.__restorePilotTimer = () => { window.setTimeout = original; };
  });
  try {
    await page.locator('#confirm-action').click();
  } finally {
    await page.evaluate(() => window.__restorePilotTimer());
  }
  await expect(page.locator('#confirm')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#confirm-action')).toBeDisabled();
  await expect(page.locator('#dialog-loading')).toBeVisible();
}

// Baselines Linux devem ser geradas no CI e aprovadas pelo Revisor.
for (const theme of ['light', 'dark']) {
  test(`baseline piloto ${theme}`, async ({ page }) => {
    await openPilotCapture(page, theme);
    await expect(page).toHaveScreenshot(`pilot-${theme}.png`, { fullPage: true });
  });

  test(`baseline foco ${theme}`, async ({ page }) => {
    await openPilotCapture(page, theme);
    // Agrupa apenas ações e campo; a margem inclui o anel e seu deslocamento.
    await page.evaluate(() => {
      const actions = document.querySelector('[aria-labelledby="actions-heading"]');
      const field = document.querySelector('#field');
      const region = document.createElement('div');
      region.setAttribute('data-visual-focus-region', '');
      region.style.padding = 'calc(var(--focus-ring-width) + var(--focus-ring-offset) + var(--space-2))';
      actions.before(region);
      region.append(actions, field);
    });
    await page.locator('#primary').focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const field = page.locator('#search');
    await expect(field).toBeFocused();
    expect(await field.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
    await expect(page.locator('[data-visual-focus-region]')).toHaveScreenshot(`pilot-focus-${theme}.png`);
  });

  test(`baseline diálogo ${theme}`, async ({ page }) => {
    await openPilotCapture(page, theme);
    await page.locator('#open-dialog').click();
    await expect(page.locator('#confirm')).toBeVisible();
    await expect(page).toHaveScreenshot(`pilot-dialog-${theme}.png`);
  });

  test(`baseline diálogo carregando ${theme}`, async ({ page }) => {
    await openPilotCapture(page, theme);
    await startPendingConfirmation(page);
    await expect(page).toHaveScreenshot(`pilot-dialog-loading-${theme}.png`);
  });

  test(`baseline diálogo erro ${theme}`, async ({ page }) => {
    await openPilotCapture(page, theme);
    await startPendingConfirmation(page);
    await page.evaluate(() => window.__pilotFinish());
    await expect(page.locator('#dialog-error')).toBeVisible();
    await expect(page.locator('#confirm-action')).toBeEnabled();
    await expect(page).toHaveScreenshot(`pilot-dialog-error-${theme}.png`);
  });
}
