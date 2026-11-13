const { expect } = require('@playwright/test');
const { paintedEdge, textContrast, descendantTextContrast } = require('./contract-probes');
async function contrast(page, selector, property = 'color') {
  if (property === 'outlineColor') return paintedEdge(page, selector, 'outline');
  if (property === 'borderTopColor') return paintedEdge(page, selector, 'border');
  return textContrast(page, selector);
}
const { modalSemantics, tableHeaders, dialogKeyboard, tableSorting } = require('./behavior-probes');
const checks = {
  'button-accessible': async (p) => expect(p.getByRole('button', { name: 'Publicar vaga' }).first()).toBeVisible(),
  'button-disabled': async (p) => { const b = p.locator('#disabled'); await expect(b).toBeDisabled(); expect(await b.evaluate((el) => { let count = 0; el.addEventListener('click', () => count++); el.click(); return count; })).toBe(0); },
  'button-loading': async (p) => { await expect(p.locator('#loading-button')).toBeDisabled(); await expect(p.locator('#loading-button')).toHaveAttribute('aria-busy', 'true'); },
  'button-keyboard': async (p) => { const el = p.locator('#primary'); await el.focus(); await p.keyboard.press('Tab'); await expect(p.locator('#secondary')).toBeFocused(); await p.keyboard.press('Shift+Tab'); await expect(el).toBeFocused(); await contrast(p, '#primary', 'outlineColor', 3); let count = 0; await el.evaluate((e) => e.addEventListener('click', () => { e.dataset.clicks = String(Number(e.dataset.clicks || 0) + 1); })); await p.keyboard.press('Enter'); await p.keyboard.press('Space'); count = await el.evaluate((e) => Number(e.dataset.clicks)); expect(count).toBe(2); },
  'button-contrast': async (p) => { for (const s of ['#primary', '#secondary', '#disabled', '#loading-button']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } for (const s of ['#primary', '#secondary']) { const el = p.locator(s), before = await el.evaluate((e) => getComputedStyle(e).backgroundColor); await el.hover(); const hover = await el.evaluate((e) => getComputedStyle(e).backgroundColor); expect(hover).not.toBe(before); await contrast(p, s); await p.mouse.down(); const active = await el.evaluate((e) => getComputedStyle(e).backgroundColor); expect(active).not.toBe(hover); await contrast(p, s); await p.mouse.up(); } },
  'field-label': async (p) => expect(p.getByLabel('Buscar candidato')).toBeVisible(),
  'field-error': async (p) => { await expect(p.locator('#invalid')).toHaveAttribute('aria-invalid', 'true'); await expect(p.locator('#invalid')).toHaveAttribute('aria-describedby', 'invalid-message'); await expect(p.locator('#invalid-message')).toBeVisible(); await expect(p.locator('#invalid-message')).toContainText('válido'); },
  'field-empty': async (p) => { await expect(p.locator('#search')).toHaveValue(''); expect(await p.locator('#search').evaluate((e) => e.validity.valid)).toBe(true); },
  'field-loading': async (p) => { await expect(p.locator('#field-loading')).toHaveAttribute('aria-busy', 'true'); await expect(p.locator('#loading-field')).toBeDisabled(); },
  'field-disabled': async (p) => expect(p.locator('#disabled-field')).toBeDisabled(),
  'field-keyboard': async (p) => { await p.locator('#primary').focus(); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await expect(p.locator('#search')).toBeFocused(); await p.keyboard.type('Ana'); await expect(p.locator('#search')).toHaveValue('Ana'); await contrast(p, '#search', 'outlineColor', 3); },
  'field-contrast': async (p) => { for (const s of ['#search', '#invalid', '#disabled-field']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } },
  'card-heading': async (p) => expect(p.locator('#card').getByRole('heading', { name: 'Vagas recentes', level: 2 })).toBeVisible(),
  'card-sizes': async (p) => { const sizes = []; for (const id of ['sm', 'md', 'lg']) sizes.push(await p.locator(`#card-${id}`).evaluate((e) => parseFloat(getComputedStyle(e).paddingTop))); expect(sizes[0]).toBeLessThan(sizes[1]); expect(sizes[1]).toBeLessThan(sizes[2]); },
  'card-empty-error': async (p) => { await expect(p.locator('#card-empty button')).toBeVisible(); await expect(p.locator('#card-error [role=alert]')).toContainText('Tente novamente'); },
  'card-keyboard': async (p) => { await p.locator('#card button:not(:disabled)').focus(); await expect(p.locator('#card button:not(:disabled)')).toBeFocused(); await contrast(p, '#card button:not(:disabled)', 'outlineColor', 3); },
  'card-disabled': async (p) => expect(p.locator('#card-disabled')).toBeDisabled(),
  'card-loading': async (p) => expect(p.locator('#card-loading')).toHaveAttribute('aria-busy', 'true'),
  'card-shadow': async (p) => expect(await p.locator('#card').evaluate((e) => getComputedStyle(e).boxShadow)).toBe('none'),
  'card-contrast': async (p) => { for (const s of ['#card', '#card-sm', '#card-md', '#card-lg', '#card-empty', '#card-error', '#card-loading']) await descendantTextContrast(p, s); },
  'stat-value': async (p) => { await expect(p.locator('#stat [data-part=value]')).toHaveText('42'); expect(await p.locator('#stat [data-part=value]').evaluate((e) => getComputedStyle(e).fontVariantNumeric)).toContain('tabular-nums'); },
  'stat-empty': async (p) => expect(p.locator('#stat-empty [data-part=value]')).toHaveText('—'),
  'stat-loading': async (p) => expect(p.locator('#stat-loading')).toHaveAttribute('aria-busy', 'true'),
  'stat-error': async (p) => { await expect(p.locator('#stat-error p')).toContainText('Não foi possível'); await expect(p.locator('#stat-error button')).toBeVisible(); await expect(p.locator('#stat-error button')).toHaveText('Tentar novamente'); },
  'stat-link': async (p) => { const a = p.locator('#stat-link a'); await a.focus(); await expect(a).toBeFocused(); await paintedEdge(p, '#stat-link a', 'outline'); await p.keyboard.press('Enter'); expect(new URL(p.url()).hash).toBe('#table'); },
  'stat-contrast': async (p) => { for (const s of ['#stat', '#stat-empty', '#stat-loading', '#stat-error', '#stat-link']) await descendantTextContrast(p, s); },
  'table-semantics': async (p) => { await expect(p.getByRole('table', { name: 'Candidatos à vaga' })).toBeVisible(); await tableHeaders(p); },
  'table-sorting': tableSorting,
  'table-empty-error': async (p) => { await expect(p.locator('#table-empty button')).toBeVisible(); await expect(p.locator('#table-error')).toHaveAttribute('role', 'alert'); await expect(p.locator('#table-error button')).toBeVisible(); },
  'table-disabled': async (p) => expect(p.locator('#table-disabled')).toBeDisabled(),
  'table-focus': async (p) => { await p.locator('#sort').focus(); await expect(p.locator('#sort')).toBeFocused(); await contrast(p, '#sort', 'outlineColor', 3); },
  'table-loading': async (p) => expect(p.locator('#table-loading')).toHaveAttribute('aria-busy', 'true'),
  'table-contrast': async (p) => { for (const s of ['#table', '#table-loading', '#table-empty', '#table-error']) await descendantTextContrast(p, s); },
  'dialog-closed': async (p) => expect(p.locator('#confirm')).toBeHidden(),
  'dialog-loading-error': async (p) => { await p.locator('#open-dialog').click(); const dialog = p.locator('#confirm'), confirm = p.locator('#confirm-action'), err = p.locator('#dialog-error'); await confirm.click(); await expect(dialog).toHaveAttribute('aria-busy', 'true'); await expect(confirm).toBeDisabled(); await expect(p.locator('#dialog-loading')).toBeVisible(); await expect(err).toHaveAttribute('role', 'alert'); await expect(err).toBeVisible(); await expect(err).toContainText('Tente novamente'); await expect(confirm).toBeEnabled(); },
  'dialog-semantics': async (p) => { await p.locator('#open-dialog').click(); await modalSemantics(p); },
  'dialog-keyboard': dialogKeyboard,
  'dialog-contrast': async (p) => { await p.locator('#open-dialog').click(); await contrast(p, '#confirm'); await contrast(p, '#confirm-action'); await contrast(p, '#confirm-action', 'borderTopColor', 3); await p.locator('#confirm-action').hover(); await contrast(p, '#confirm-action'); },
  'badge-semantics': async (p) => { await expect(p.locator('#badge-neutral')).toBeVisible(); expect(await p.locator('#badge-neutral').evaluate((e) => e.tabIndex)).toBe(-1); },
  'badge-variants': async (p) => { for (const name of ['Pendente', 'Aprovado', 'Recusado']) await expect(p.getByText(name, { exact: true }).first()).toBeVisible(); },
  'badge-loading': async (p) => { await expect(p.locator('#badge-loading')).toHaveAttribute('aria-busy', 'true'); await expect(p.locator('#badge-loading')).toContainText('Atualizando'); },
  'badge-empty': async (p) => expect(p.locator('#badge-empty')).toHaveText('Sem status'),
  'badge-contrast': async (p) => { for (const s of ['#badge-neutral', '#badge-success', '#badge-error']) { await contrast(p, s); await contrast(p, s, 'borderTopColor', 3); } },
  'empty-content': async (p) => { await expect(p.locator('#empty h2')).toContainText('Nenhuma'); await expect(p.locator('#empty p')).toContainText('Publique'); await expect(p.locator('#empty button')).toBeVisible(); },
  'error-content': async (p) => { await expect(p.locator('#error')).toHaveAttribute('role', 'alert'); await expect(p.locator('#error button')).toHaveText('Tentar novamente'); },
  'empty-keyboard': async (p) => { await p.locator('#empty button').focus(); await p.keyboard.press('Tab'); await expect(p.locator('#error button')).toBeFocused(); await contrast(p, '#error button', 'outlineColor', 3); const b = p.locator('#error button'); await b.evaluate((e) => e.addEventListener('click', () => { e.dataset.clicks = String(Number(e.dataset.clicks || 0) + 1); })); await p.keyboard.press('Enter'); await p.keyboard.press('Space'); expect(await b.evaluate((e) => Number(e.dataset.clicks))).toBe(2); },
  'empty-loading': async (p) => { await expect(p.locator('#empty-loading')).toHaveAttribute('aria-busy', 'true'); await expect(p.locator('#empty-loading button')).toBeDisabled(); },
  'empty-contrast': async (p) => { await contrast(p, '#empty'); await contrast(p, '#error'); },
};


module.exports = { checks };
