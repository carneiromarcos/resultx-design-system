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
    await page.locator('#primary').focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const field = page.locator('#search');
    const actions = page.locator('[aria-labelledby="actions-heading"]');
    const fieldSection = page.locator('#field');
    await actions.scrollIntoViewIfNeeded();
    await fieldSection.scrollIntoViewIfNeeded();
    await expect(field).toBeFocused();
    expect(await field.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
    const ring = await field.evaluate((el) => {
      const style = getComputedStyle(el);
      return [parseFloat(style.getPropertyValue('--focus-ring-width')), parseFloat(style.getPropertyValue('--focus-ring-offset'))];
    });
    expect(ring.every(Number.isFinite)).toBe(true);
    const margin = ring[0] + ring[1] + 4;
    const actionsBox = await actions.boundingBox();
    const fieldBox = await fieldSection.boundingBox();
    const inputBox = await field.boundingBox();
    const viewport = page.viewportSize();
    expect(actionsBox && fieldBox && inputBox && viewport).toBeTruthy();
    const x = Math.max(0, Math.floor(Math.min(actionsBox.x, fieldBox.x) - margin));
    const y = Math.max(0, Math.floor(Math.min(actionsBox.y, fieldBox.y) - margin));
    const right = Math.min(viewport.width, Math.ceil(Math.max(actionsBox.x + actionsBox.width, fieldBox.x + fieldBox.width) + margin));
    const bottom = Math.min(viewport.height, Math.ceil(Math.max(actionsBox.y + actionsBox.height, fieldBox.y + fieldBox.height) + margin));
    const clip = { x, y, width: right - x, height: bottom - y };
    // Um corte no limite da viewport não pode esconder parte do anel.
    expect(inputBox.x - ring[0] - ring[1]).toBeGreaterThanOrEqual(x);
    expect(inputBox.y - ring[0] - ring[1]).toBeGreaterThanOrEqual(y);
    expect(inputBox.x + inputBox.width + ring[0] + ring[1]).toBeLessThanOrEqual(right);
    expect(inputBox.y + inputBox.height + ring[0] + ring[1]).toBeLessThanOrEqual(bottom);
    await expect(page).toHaveScreenshot(`pilot-focus-${theme}.png`, { clip });
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
