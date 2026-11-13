const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const yaml = require('js-yaml');
const url = pathToFileURL(path.resolve('examples/pilot.html')).href;
const files = fs.readdirSync('contracts').filter((f) => f.endsWith('.yaml')).sort();
const cases = files.flatMap((f) => yaml.load(fs.readFileSync(path.join('contracts', f), 'utf8')).casos_teste.map((c) => c.id));

async function contrast(page, selector, property = 'color', minimum = 4.5) {
  const result = await page.locator(selector).first().evaluate((el, prop) => {
    const rgba = (s) => { const m = s.match(/[\d.]+/g); return m ? m.map(Number) : [0, 0, 0, 0]; };
    const blend = (f, b) => f.slice(0, 3).map((v, i) => v * (f[3] ?? 1) + b[i] * (1 - (f[3] ?? 1)));
    const background = (node) => {
      if (!node) return [255, 255, 255];
      const bg = rgba(getComputedStyle(node).backgroundColor);
      return blend(bg, background(node.parentElement));
    };
    const style = getComputedStyle(el), bg = prop === 'outlineColor' ? background(el.parentElement) : background(el);
    const fg = blend(rgba(style[prop]), bg);
    const luminance = (rgb) => rgb.map((n) => { const v = n / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const a = luminance(fg), b = luminance(bg);
    return { ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), fg, bg, outline: style.outlineStyle, width: style.outlineWidth };
  }, property);
  expect(result.ratio, `${selector} ${property}: ${JSON.stringify(result)}`).toBeGreaterThanOrEqual(minimum);
  if (property === 'outlineColor') { expect(result.outline).not.toBe('none'); expect(parseFloat(result.width)).toBeGreaterThan(0); }
}
const text = (selector) => async (page) => contrast(page, selector);
const checks = {
  'button-accessible': async (p) => expect(p.getByRole('button', { name: 'Publicar vaga' }).first()).toBeVisible(),
  'button-disabled': async (p) => expect(p.locator('#disabled')).toBeDisabled(),
  'button-loading': async (p) => { await expect(p.locator('#loading-button')).toBeDisabled(); await expect(p.locator('#loading-button')).toHaveAttribute('aria-busy', 'true'); },
  'button-keyboard': async (p) => { const el = p.locator('#primary'); await el.focus(); await p.keyboard.press('Tab'); await expect(p.locator('#secondary')).toBeFocused(); await p.keyboard.press('Shift+Tab'); await expect(el).toBeFocused(); await contrast(p, '#primary', 'outlineColor', 3); let count = 0; await el.evaluate((e) => e.addEventListener('click', () => { e.dataset.clicks = String(Number(e.dataset.clicks || 0) + 1); })); await p.keyboard.press('Enter'); await p.keyboard.press('Space'); count = await el.evaluate((e) => Number(e.dataset.clicks)); expect(count).toBe(2); },
  'button-contrast': async (p) => { for (const s of ['#primary', '#secondary', '#disabled', '#loading-button']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } for (const s of ['#primary', '#secondary']) { await p.locator(s).hover(); await contrast(p, s); await p.mouse.down(); await contrast(p, s); await p.mouse.up(); } },
  'field-label': async (p) => expect(p.getByLabel('Buscar candidato')).toBeVisible(),
  'field-error': async (p) => { await expect(p.locator('#invalid')).toHaveAttribute('aria-invalid', 'true'); await expect(p.locator('#invalid')).toHaveAttribute('aria-describedby', 'invalid-message'); await expect(p.locator('#invalid-message')).toContainText('válido'); },
  'field-disabled': async (p) => expect(p.locator('#disabled-field')).toBeDisabled(),
  'field-keyboard': async (p) => { await p.locator('#primary').focus(); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await expect(p.locator('#search')).toBeFocused(); await p.keyboard.type('Ana'); await expect(p.locator('#search')).toHaveValue('Ana'); await contrast(p, '#search', 'outlineColor', 3); },
  'field-contrast': async (p) => { for (const s of ['#search', '#invalid', '#disabled-field']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } },
  'card-heading': async (p) => expect(p.locator('#card').getByRole('heading', { name: 'Vagas recentes', level: 2 })).toBeVisible(),
  'card-sizes': async (p) => { const sizes = []; for (const id of ['sm', 'md', 'lg']) sizes.push(await p.locator(`#card-${id}`).evaluate((e) => parseFloat(getComputedStyle(e).paddingTop))); expect(sizes[0]).toBeLessThan(sizes[1]); expect(sizes[1]).toBeLessThan(sizes[2]); },
  'card-loading': async (p) => expect(p.locator('#card-loading')).toHaveAttribute('aria-busy', 'true'),
  'card-contrast': text('#card'),
  'stat-value': async (p) => { await expect(p.locator('#stat .rx-stat-card__value')).toHaveText('42'); expect(await p.locator('#stat .rx-stat-card__value').evaluate((e) => getComputedStyle(e).fontVariantNumeric)).toContain('tabular-nums'); },
  'stat-empty': async (p) => expect(p.locator('#stat-empty .rx-stat-card__value')).toHaveText('—'),
  'stat-loading': async (p) => expect(p.locator('#stat-loading')).toHaveAttribute('aria-busy', 'true'),
  'stat-contrast': text('#stat'),
  'table-semantics': async (p) => { await expect(p.getByRole('table', { name: 'Candidatos à vaga' })).toBeVisible(); await expect(p.locator('#table th').first()).toHaveAttribute('scope', 'col'); },
  'table-sorting': async (p) => { await p.locator('#sort').focus(); await p.keyboard.press('Enter'); await expect(p.locator('#sort').locator('..')).toHaveAttribute('aria-sort', 'descending'); await expect(p.locator('#table tbody tr').first()).toContainText('Bruno Costa'); },
  'table-loading': async (p) => expect(p.locator('#table-loading')).toHaveAttribute('aria-busy', 'true'),
  'table-contrast': text('#table'),
  'dialog-semantics': async (p) => { await p.locator('#open-dialog').click(); await expect(p.getByRole('dialog', { name: 'Excluir vaga?' })).toBeVisible(); await expect(p.locator('#confirm')).toHaveAttribute('aria-describedby', 'confirm-description'); },
  'dialog-keyboard': async (p) => { const opener = p.locator('#open-dialog'); await opener.focus(); await p.keyboard.press('Enter'); await expect(p.locator('#confirm')).toBeVisible(); await expect(p.locator('#cancel')).toBeFocused(); await contrast(p, '#cancel', 'outlineColor', 3); await p.keyboard.press('Tab'); await expect(p.locator('#confirm-action')).toBeFocused(); await p.keyboard.press('Shift+Tab'); await expect(p.locator('#cancel')).toBeFocused(); await p.keyboard.press('Escape'); await expect(p.locator('#confirm')).toBeHidden(); await expect(opener).toBeFocused(); },
  'dialog-contrast': async (p) => { await p.locator('#open-dialog').click(); await contrast(p, '#confirm'); await contrast(p, '#confirm-action'); await contrast(p, '#confirm-action', 'borderTopColor', 3); await p.locator('#confirm-action').hover(); await contrast(p, '#confirm-action'); },
  'badge-semantics': async (p) => { await expect(p.locator('p > .rx-badge--neutral')).toBeVisible(); expect(await p.locator('p > .rx-badge--neutral').getAttribute('tabindex')).toBeNull(); },
  'badge-variants': async (p) => { for (const name of ['Pendente', 'Aprovado', 'Recusado']) await expect(p.getByText(name, { exact: true }).first()).toBeVisible(); },
  'badge-contrast': async (p) => { for (const s of ['.rx-badge--neutral', '.rx-badge--success', '.rx-badge--error']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } },
  'empty-content': async (p) => { await expect(p.locator('#empty h2')).toContainText('Nenhuma'); await expect(p.locator('#empty p')).toContainText('Publique'); await expect(p.locator('#empty button')).toBeVisible(); },
  'error-content': async (p) => { await expect(p.locator('#error')).toHaveAttribute('role', 'alert'); await expect(p.locator('#error button')).toHaveText('Tentar novamente'); },
  'empty-keyboard': async (p) => { await p.locator('#empty button').focus(); await p.keyboard.press('Tab'); await expect(p.locator('#error button')).toBeFocused(); await contrast(p, '#error button', 'outlineColor', 3); },
  'empty-contrast': async (p) => { await contrast(p, '#empty'); await contrast(p, '#error'); },
};

test('cada caso dos contratos tem implementação executável', () => {
  expect([...cases].sort()).toEqual(Object.keys(checks).sort());
  expect(new Set(cases).size).toBe(cases.length);
});
for (const theme of ['light', 'dark']) {
  for (const id of cases) {
    test(`${theme}: ${id}`, async ({ page }) => { await page.goto(`${url}?theme=${theme}`); await checks[id](page); });
  }
}

// Capturas aguardam geração no workflow Visual Linux e aprovação do Revisor.
for (const theme of ['light', 'dark']) {
  test.skip(`baseline pendente: piloto ${theme}`, async ({ page }) => {
    await page.goto(`${url}?theme=${theme}`);
    await expect(page).toHaveScreenshot(`pilot-${theme}.png`, { fullPage: true });
  });
}
