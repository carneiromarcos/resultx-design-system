const {
  test,
  expect
} = require('@playwright/test');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const {
  brands
} = require('../../catalog/bindings.config');
const definitions = require('../../catalog/components.config.cjs');
const {
  tableSorting,
  tableHeaders
} = require('./lib/behavior-probes');
const {
  checks
} = require('./lib/pilot-cases');
const {
  parseCssColor
} = require('./lib/css-color');
let server, base, published;
test.use({
  launchOptions: process.env.CATALOG_CHROME ? {
    executablePath: process.env.CATALOG_CHROME
  } : undefined
});
test.describe.configure({
  mode: 'serial'
});
test.beforeAll(async () => {
  require('../../scripts/catalog/build.cjs').build();
  published = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-contracts-'));
  require('../../scripts/prepare-pages.cjs').preparePages({
    out: published
  });
  server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    if (!pathname.startsWith('/resultx-design-system/')) {
      res.writeHead(404);
      return res.end();
    }
    let file = path.join(published, pathname.slice('/resultx-design-system/'.length));
    if (!file.startsWith(published + path.sep)) {
      res.writeHead(403);
      return res.end();
    }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      res.setHeader('Content-Type', {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
        '.json': 'application/json'
      }[path.extname(file)] || 'application/octet-stream');
      res.end(fs.readFileSync(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/resultx-design-system/catalog/`;
});
test.afterAll(async () => {
  await require('../../scripts/catalog/test-server.cjs').closeServer(server);
  if (published) fs.rmSync(published, {
    recursive: true,
    force: true
  });
});
function network(page) {
  const failures = [];
  page.on('response', r => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  page.on('request', r => {
    if (!r.url().startsWith(base)) failures.push('Externa: ' + r.url());
  });
  page.on('requestfailed', r => failures.push('Falha: ' + r.url()));
  page.on('pageerror', e => failures.push('JS: ' + e.message));
  return failures;
}
const rgb = c => c.startsWith('#') ? [0, 2, 4].map(i => parseInt((c.length === 4 ? [...c.slice(1)].map(x => x + x).join('') : c.slice(1)).slice(i, i + 2), 16)) : parseCssColor(c).slice(0, 3).map(Math.round);
function contrast(a, b) {
  const luminance = c => rgb(c).map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
async function measurements(page) {
  return page.locator('[data-contrast-pair]').evaluateAll(items => items.map(item => {
    const el = document.getElementById(item.dataset.target);
    if (!el) throw Error('Alvo não existe: ' + item.dataset.target);
    const s = getComputedStyle(el);
    const background = node => {
      while (node) {
        const c = getComputedStyle(node).backgroundColor;
        if (c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
        node = node.parentElement;
      }
      throw Error('Fundo não resolvido');
    };
    const kind = item.dataset.kind;
    const target = kind === 'texto do link' ? el.querySelector('a') : el;
    return {
      ...item.dataset,
      actualForeground: getComputedStyle(target)[kind === 'borda' ? 'borderTopColor' : kind === 'foco' ? 'outlineColor' : 'color'],
      actualBackground: background(['borda', 'foco'].includes(kind) ? el.parentElement : el),
      borderStyle: s.borderTopStyle,
      borderWidth: parseFloat(s.borderTopWidth),
      outlineStyle: s.outlineStyle,
      outlineWidth: parseFloat(s.outlineWidth)
    };
  }));
}
for (const b of brands) for (const theme of ['light', 'dark']) for (const d of definitions) test(`${b.id} ${theme} ${d.id}: estados, estilo, publicação`, async ({
  page
}) => {
  const failures = network(page);
  const url = base + `${b.id}/${theme}/${d.id}/`;
  await page.setViewportSize({
    width: 1440,
    height: 1000
  });
  expect((await page.goto(url)).status()).toBe(200);
  const frame = await (await page.locator('iframe').elementHandle()).contentFrame();
  await expect(frame.locator('h1')).toHaveText(d.title);
  const loaded = await frame.evaluate(async () => {
    const family = getComputedStyle(document.body).fontFamily.split(',')[0];
    const descriptor = `400 16px ${family}`;
    const faces = await document.fonts.load(descriptor);
    await document.fonts.ready;
    return {
      check: document.fonts.check(descriptor),
      loaded: faces.length > 0 && faces.every(face => face.status === 'loaded')
    };
  });
  expect(loaded).toEqual({
    check: true,
    loaded: true
  });
  expect(await frame.locator('link[data-brand]').count()).toBe(1);
  expect(await frame.locator('html').getAttribute('data-theme')).toBe(theme);
  for (const context of [page, frame]) {
    expect(await context.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toBe("default-src 'self'");
    expect(await context.locator('script:not([src]), [style]').count()).toBe(0);
  }
  expect(await page.locator('script').count()).toBe(0);
  expect(await frame.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
    return ids.filter((id, i) => ids.indexOf(id) !== i);
  })).toEqual([]);
  expect(await frame.evaluate(() => [...document.querySelectorAll('label[for], [aria-describedby]')].every(e => (e.hasAttribute('for') ? [e.htmlFor] : e.getAttribute('aria-describedby').split(/\s+/)).every(id => document.getElementById(id))))).toBe(true);
  expect(await frame.locator('script').count()).toBe(['confirm-dialog', 'data-table'].includes(d.id) ? 1 : 0);
  const pairResults = await measurements(frame);
  expect(pairResults.length).toBeGreaterThan(0);
  for (const pair of pairResults) {
    expect(rgb(pair.actualForeground), `${b.id}/${theme}/${d.id} ${pair.target} ${pair.kind}`).toEqual(rgb(pair.foreground));
    expect(rgb(pair.actualBackground), `${pair.target} ${pair.kind} fundo`).toEqual(rgb(pair.background));
    if (pair.kind === 'borda') {
      expect(pair.borderWidth).toBeGreaterThanOrEqual(1);
      expect(['none', 'hidden']).not.toContain(pair.borderStyle);
    }
    if (pair.kind === 'foco') {
      expect(pair.outlineWidth).toBeGreaterThanOrEqual(1);
      expect(pair.outlineStyle).toBe('solid');
    }
    expect(Number(pair.ratio)).toBeCloseTo(contrast(pair.actualForeground, pair.actualBackground), 6);
    expect(Number(pair.minimum)).toBe(pair.kind.startsWith('texto') ? 4.5 : 3);
    expect(pair.pending === 'true').toBe(Number(pair.ratio) < Number(pair.minimum));
  }
  const below = pairResults.filter(p => p.pending === 'true');
  await expect(frame.locator('[data-contrast-summary]')).toContainText(below.length ? 'abaixo do mínimo' : 'pares calculados');
  // Navegação da moldura preserva a página e o tema.
  for (const a of await page.locator('nav[aria-label="Marca"] a').all()) expect(await a.getAttribute('href')).toContain(`/${theme}/${d.id}/`);
  if (d.id === 'button') {
    const primary = frame.locator('[data-contract-state=normal] button').first();
    await primary.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(primary).toBeFocused();
    expect(await primary.evaluate(e => e.matches(':focus-visible'))).toBe(true);
    const properties = ['color', 'backgroundColor', 'borderTopColor', 'borderTopStyle'];
    for (const tag of ['button', 'a']) for (const variant of [0, 1, 2]) {
      const live = frame.locator(`[data-contract-state=normal] ${tag}.rx-button`).nth(variant);
      for (const state of ['hover', 'ativo']) {
        await live.hover();
        if (state === 'ativo') await page.mouse.down();
        try {
          const actual = await live.evaluate((el, props) => props.map(p => getComputedStyle(el)[p]), properties);
          const demo = await frame.locator(`[data-contract-state=${state}] ${tag}.rx-button`).nth(variant).evaluate((el, props) => props.map(p => getComputedStyle(el)[p]), properties);
          expect(actual, `${tag} ${variant} ${state}: exemplo estático igual à interação real`).toEqual(demo);
        } finally {
          if (state === 'ativo') await page.mouse.up();
        }
      }
    }
    await page.mouse.move(0, 0);
    // Os ensaios de active acima clicam links reais; começar o ensaio de teclado sem hash.
    await frame.evaluate(() => history.replaceState(null, '', location.pathname));
    const link = frame.locator('[data-contract-state=normal] a').first();
    await link.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(link).toBeFocused();
    await page.keyboard.press('Space');
    expect(new URL(frame.url()).hash).toBe('');
    await page.keyboard.press('Enter');
    expect(new URL(frame.url()).hash).toBe('#destination');
    await frame.evaluate(() => history.replaceState(null, '', location.pathname));
    for (const state of ['desabilitado', 'carregando']) for (const a of await frame.locator(`[data-contract-state=${state}] a`).all()) {
      await expect(a).not.toHaveAttribute('href');
      await expect(a).toHaveAttribute('tabindex', '-1');
    }
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({
      width,
      height: 1000
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await frame.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  if (process.env.CATALOG_EVIDENCE_DIR) {
    const folder = process.env.CATALOG_EVIDENCE_DIR;
    fs.mkdirSync(folder, {
      recursive: true
    });
    fs.writeFileSync(path.join(folder, `${b.id}-${theme}-${d.id}.json`), JSON.stringify(pairResults, null, 2));
    // 80 páginas em desktop + 20 recortes responsivos (botão/tabela): teto 100.
    for (const width of ['button', 'data-table'].includes(d.id) ? [1440, 390] : [1440]) {
      await page.setViewportSize({
        width,
        height: 1000
      });
      // Documento isolado: screenshot de elemento dentro de iframe não captura o conteúdo
      // além da viewport interna e pode registrar a moldura em vez do exemplo.
      expect((await page.goto(url + 'example.html')).status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      if (d.id === 'button') {
        const control = page.locator('[data-contract-state=normal] button').first();
        await control.focus();
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');
        await expect(control).toBeFocused();
      }
      await page.screenshot({
        path: path.join(folder, `${b.id}-${theme}-${d.id}-${width}.png`),
        fullPage: true,
        animations: 'disabled',
        caret: 'hide'
      });
    }
  }
  expect(failures).toEqual([]);
});
for (const b of brands) for (const theme of ['light', 'dark']) {
  test(`${b.id} ${theme}: diálogo modal e retorno do foco`, async ({
    page
  }) => {
    const failures = network(page);
    await page.goto(base + `${b.id}/${theme}/confirm-dialog/example.html`);
    const open = page.locator('#open-dialog'),
      dialog = page.locator('#confirm');
    await open.focus();
    await page.keyboard.press('Enter');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate(e => e.matches(':modal'))).toBe(true);
    await expect(page.locator('#cancel')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#confirm-action')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#cancel')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#confirm-action')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#cancel')).toBeFocused();
    await open.evaluate(e => e.focus());
    expect(await dialog.evaluate(e => e.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await open.click();
    await page.locator('#cancel').click();
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await checks['dialog-loading-error'](page);
    await page.locator('#confirm-action').click();
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    expect(await dialog.evaluate(e => e.returnValue)).toBe('confirmed');
    expect(failures).toEqual([]);
  });
  test(`${b.id} ${theme}: tabela ordena por Enter e Espaço`, async ({
    page
  }) => {
    const failures = network(page);
    await page.goto(base + `${b.id}/${theme}/data-table/example.html`);
    await tableHeaders(page);
    await tableSorting(page);
    expect(failures).toEqual([]);
  });
}
