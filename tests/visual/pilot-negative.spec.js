// Ensaios deliberadamente defeituosos devem ser rejeitados pelas mesmas sondas.
const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('url');
const path = require('path');
const { paintedEdge, descendantTextContrast } = require('./lib/contract-probes');
const { modalSemantics, tableHeaders, dialogKeyboard, tableSorting } = require('./lib/behavior-probes');
const reference = pathToFileURL(path.resolve('examples/pilot.html')).href;

test.beforeEach(async ({ page }) => { await page.goto(`${reference}?theme=light`); });

test('rejeita borda sem contraste com fundo externo mesmo quando contrasta com interior', async ({ page }) => {
  await page.locator('#primary').evaluate((el) => { el.parentElement.style.background = getComputedStyle(el).borderTopColor; });
  await expect(paintedEdge(page, '#primary', 'border')).rejects.toThrow();
});
test('rejeita border-style none com cor contrastante', async ({ page }) => {
  await page.locator('#primary').evaluate((el) => { el.style.setProperty('border-style', 'none', 'important'); });
  await expect(paintedEdge(page, '#primary', 'border')).rejects.toThrow();
});
test('rejeita borda de largura zero com cor contrastante', async ({ page }) => {
  await page.locator('#primary').evaluate((el) => { el.style.setProperty('border-width', '0px', 'important'); });
  await expect(paintedEdge(page, '#primary', 'border')).rejects.toThrow();
});
test('rejeita anel coberto por elemento sobreposto', async ({ page }) => {
  await page.locator('#primary').focus();
  await page.locator('#primary').evaluate((el) => { const r = el.getBoundingClientRect(), overlay = document.createElement('div'); Object.assign(overlay.style, { position: 'fixed', left: `${r.x - 10}px`, top: `${r.y - 10}px`, width: `${r.width + 20}px`, height: `${r.height + 20}px`, background: 'white', zIndex: '9999' }); document.body.append(overlay); });
  await expect(paintedEdge(page, '#primary', 'outline')).rejects.toThrow();
});
test('rejeita anel recortado por overflow', async ({ page }) => {
  await page.locator('#primary').evaluate((el) => { const w = document.createElement('span'); Object.assign(w.style, { display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }); el.style.margin = '0'; el.replaceWith(w); w.append(el); });
  await page.locator('#primary').focus();
  await expect(paintedEdge(page, '#primary', 'outline')).rejects.toThrow();
});
test('rejeita diálogo aberto sem modalidade', async ({ page }) => {
  await page.locator('#confirm').evaluate((el) => el.show());
  await expect(modalSemantics(page)).rejects.toThrow();
});
test('rejeita foco que escapa no limite do modal', async ({ page }) => {
  await page.evaluate(() => { const old = document.querySelector('#confirm'), clone = old.cloneNode(true); old.replaceWith(clone); document.querySelector('#open-dialog').addEventListener('click', (e) => { e.stopImmediatePropagation(); clone.showModal(); }, true); });
  await expect(dialogKeyboard(page)).rejects.toThrow();
});
test('rejeita célula sem associação com cabeçalho', async ({ page }) => {
  await page.locator('#table th').nth(1).evaluate((el) => el.removeAttribute('scope'));
  await expect(tableHeaders(page)).rejects.toThrow();
});
test('rejeita ordenação que não funciona com Espaço', async ({ page }) => {
  await page.locator('#sort').evaluate((el) => el.addEventListener('keydown', (e) => { if (e.key === ' ') e.preventDefault(); }));
  await expect(tableSorting(page)).rejects.toThrow();
});
for (const selector of ['#card p', '#stat [data-part=value]', '#table tbody td']) test(`rejeita texto descendente sem contraste em ${selector}`, async ({ page }) => {
  await page.locator(selector).first().evaluate((el) => { el.style.color = getComputedStyle(el).getPropertyValue('--bg-surface-1'); });
  const container = selector.startsWith('#card') ? '#card' : selector.startsWith('#stat') ? '#stat' : '#table';
  await expect(descendantTextContrast(page, container)).rejects.toThrow();
});

test('rejeita erro do campo sem descrição associada', async ({ page }) => {
  const { checks } = require('./lib/pilot-cases');
  await page.locator('#invalid').evaluate((el) => el.removeAttribute('aria-describedby'));
  await expect(checks['field-error'](page)).rejects.toThrow();
});
test('rejeita carregamento do campo sem aria-busy', async ({ page }) => {
  const { checks } = require('./lib/pilot-cases');
  await page.locator('#field-loading').evaluate((el) => el.removeAttribute('aria-busy'));
  await expect(checks['field-loading'](page)).rejects.toThrow();
});
test('rejeita erro do indicador sem ação de recuperação', async ({ page }) => {
  const { checks } = require('./lib/pilot-cases');
  await page.locator('#stat-error button').evaluate((el) => el.remove());
  await expect(checks['stat-error'](page)).rejects.toThrow();
});

test('rejeita aria-modal sem tornar o fundo inerte', async ({ page }) => {
  await page.locator('#confirm').evaluate((el) => { el.setAttribute('aria-modal', 'true'); el.show(); });
  await expect(modalSemantics(page)).rejects.toThrow();
});
test('rejeita fuga de foco no limite Shift+Tab', async ({ page }) => {
  await page.locator('#confirm').evaluate((el) => el.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && event.shiftKey && document.activeElement.id === 'cancel') { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true));
  await expect(dialogKeyboard(page)).rejects.toThrow();
});
test('rejeita borda ausente apenas em um lado', async ({ page }) => {
  await page.locator('#primary').evaluate((el) => { el.style.setProperty('border-right-width', '0px', 'important'); });
  await expect(paintedEdge(page, '#primary', 'border')).rejects.toThrow();
});

test('rejeita confirmação que permanece ativa durante carregamento', async ({ page }) => {
  const { checks } = require('./lib/pilot-cases');
  await page.locator('#confirm-action').evaluate((el) => el.addEventListener('click', () => { el.disabled = false; }));
  await expect(checks['dialog-loading-error'](page)).rejects.toThrow();
});
