const { expect } = require('@playwright/test');
const { paintedEdge } = require('./contract-probes');

async function modalSemantics(p) {
  const dialog = p.locator('#confirm');
  await expect(p.getByRole('dialog', { name: 'Excluir vaga?' })).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-describedby', 'confirm-description');
  const modal = await dialog.evaluate((el) => el.matches(':modal') || el.getAttribute('aria-modal') === 'true');
  expect(modal, 'diálogo deve ser modal').toBe(true);
  await p.locator('#primary').evaluate((el) => el.focus());
  expect(await dialog.evaluate((el) => el.contains(document.activeElement)), 'fundo deve ser inerte').toBe(true);
}
async function tableHeaders(p) {
  const result = await p.locator('#table').evaluate((table) => [...table.querySelectorAll('tbody td')].map((cell) => {
    const ids = (cell.getAttribute('headers') || '').trim().split(/\s+/).filter(Boolean);
    if (ids.length) return ids.every((id) => { const th = table.querySelector('#' + CSS.escape(id)); return th && th.tagName === 'TH'; });
    const column = cell.cellIndex;
    const th = table.tHead?.rows[table.tHead.rows.length - 1]?.cells[column];
    return !!th && th.tagName === 'TH' && th.getAttribute('scope') === 'col';
  }));
  expect(result.length).toBeGreaterThan(0);
  expect(result.every(Boolean), 'cada célula deve ter cabeçalho associado').toBe(true);
}

async function dialogKeyboard(p) {
  const opener = p.locator('#open-dialog');
  await opener.focus(); await p.keyboard.press('Enter');
  await expect(p.locator('#confirm')).toBeVisible();
  await expect(p.locator('#cancel')).toBeFocused();
  await paintedEdge(p, '#cancel', 'outline');
  await p.keyboard.press('Tab'); await expect(p.locator('#confirm-action')).toBeFocused();
  await p.keyboard.press('Tab'); await expect(p.locator('#cancel')).toBeFocused();
  await p.keyboard.press('Shift+Tab'); await expect(p.locator('#confirm-action')).toBeFocused();
  await p.keyboard.press('Escape'); await expect(p.locator('#confirm')).toBeHidden(); await expect(opener).toBeFocused();
}
async function tableSorting(p) {
  await p.locator('#sort').focus(); await p.keyboard.press('Enter');
  await expect(p.locator('#sort').locator('..')).toHaveAttribute('aria-sort', 'descending');
  await expect(p.locator('#table tbody tr').first()).toContainText('Bruno Costa');
  await p.keyboard.press('Space');
  await expect(p.locator('#sort').locator('..')).toHaveAttribute('aria-sort', 'ascending');
  await expect(p.locator('#table tbody tr').first()).toContainText('Ana Silva');
}
module.exports = { modalSemantics, tableHeaders, dialogKeyboard, tableSorting };
