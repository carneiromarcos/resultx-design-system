const {
  test,
  expect
} = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const http = require('http');
const {
  brands
} = require('../../catalog/bindings.config');
let server, base;
test.use({
  launchOptions: process.env.CATALOG_CHROME ? {
    executablePath: process.env.CATALOG_CHROME
  } : undefined
});
test.describe.configure({mode: 'serial'});
test.beforeAll(async () => {
  // Sempre reconstruir: a pasta pode ser sobra de uma geração que falhou.
  require('../../scripts/catalog/build.cjs').build();
  const root = path.resolve(__dirname, '../../_site');
  server = http.createServer((req, res) => {
    let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) {
      res.writeHead(403);
      return res.end();
    }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      res.setHeader('Content-Type', {
        '.css': 'text/css',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.html': 'text/html'
      }[path.extname(file)] || 'text/plain');
      res.end(fs.readFileSync(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => {
  await require('../../scripts/catalog/test-server.cjs').closeServer(server);
  server = undefined;
});
async function doc(page, brand, theme) {
  const response = await page.goto(`${base}/catalog/${brand}/${theme}/fundacoes/example.html`);
  expect(response.status()).toBe(200);
}
async function dataDoc(page, brand, theme) {
  const response = await page.goto(`${base}/catalog/${brand}/${theme}/data-cards/example.html`);
  expect(response.status()).toBe(200);
}
test('a — ligação resolve dimensões, fonte e superfície da marca', async ({
  page
}) => {
  await doc(page, 'emprega', 'dark');
  let r = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return ['--radius-md', '--emp-radius-md', '--font-body', '--emp-font-sans'].map(x => s.getPropertyValue(x).trim());
  });
  expect(r[0]).not.toBe('');
  expect(r[1]).not.toBe('');
  expect(r[0]).toBe(r[1]);
  expect(r[2]).toBe(r[3]);
  await doc(page, 'resultx', 'light');
  r = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    return ['--bg-surface-1', '--rx-surface-1'].map(x => s.getPropertyValue(x).trim());
  });
  expect(r[0]).not.toBe('');
  expect(r[1]).not.toBe('');
  expect(r[0]).toBe(r[1]);
});
test('b — fontes reais do Xscore carregam sem substituição silenciosa', async ({
  page
}) => {
  await doc(page, 'xscore', 'dark');
  for (const font of ['Plus Jakarta Sans', 'Geist Mono']) {
    const r = await page.evaluate(async f => {
      await document.fonts.load(`400 16px "${f}"`);
      await document.fonts.ready;
      return {
        check: document.fonts.check(`16px "${f}"`),
        loaded: [...document.fonts].some(x => x.family.replaceAll('"', '').replaceAll("'", '') === f && x.status === 'loaded')
      };
    }, font);
    expect(r).toEqual({
      check: true,
      loaded: true
    });
  }
});
test('c — tema explícito isolado da preferência do navegador', async ({
  page
}) => {
  for (const b of brands) for (const theme of ['light', 'dark']) {
    await page.emulateMedia({
      colorScheme: 'dark'
    });
    await doc(page, b.id, theme);
    expect(await page.locator('html').getAttribute('data-theme')).toBe(theme);
    expect(await page.locator('link[data-brand]').count()).toBe(1);
    const first = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim());
    await page.emulateMedia({
      colorScheme: 'light'
    });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim())).toBe(first);
  }
});
for (const b of brands) for (const theme of ['light', 'dark']) test(`${b.id} ${theme}: amostras decorativas têm tinta, contraste e rótulo`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await dataDoc(page, b.id, theme);
  for (const color of ['cyan', 'magenta', 'purple']) {
    const sample = page.locator(`.dl-coin--soft-${color}`).first();
    await expect(sample).toHaveAttribute('aria-hidden', 'true');
    const result = await sample.evaluate(el => {
      const css = getComputedStyle(el);
      const parentText = el.parentElement.innerText;
      const rgb = value => value.match(/[\d.]+/g).slice(0, 3).map(Number);
      const luminance = value => rgb(value).map(c => c / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((a, c, i) => a + c * [.2126, .7152, .0722][i], 0);
      const a = luminance(css.color), b = luminance(css.backgroundColor);
      return { fg: css.color, bg: css.backgroundColor, label: parentText.trim(), ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
    });
    expect(result.label).toMatch(new RegExp({ cyan: 'Ciano', magenta: 'Magenta', purple: 'Roxo' }[color]));
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.fg).not.toBe(result.bg);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
for (const b of brands) for (const theme of ['light', 'dark']) for (const width of [390, 1440]) test(`${b.id} ${theme} ${width}: fundações, rede, contraste e evidência`, async ({
  page
}) => {
  await page.setViewportSize({
    width,
    height: 1000
  });
  const errors = [];
  page.on('response', r => {
    if (r.status() >= 400) errors.push(r.status() + ' ' + r.url());
  });
  page.on('request', r => {
    if (!r.url().startsWith(base + '/')) errors.push('Externo: ' + r.url());
  });
  await doc(page, b.id, theme);
  await page.evaluate(() => document.fonts.ready);
  for (const family of ['Sora', 'Inter', 'JetBrains Mono']) expect(await page.evaluate(async f => {
    await document.fonts.load(`400 16px "${f}"`);
    return document.fonts.check(`16px "${f}"`);
  }, family)).toBe(true);
  expect(await page.locator('h1').textContent()).toBe(b.label);
  expect(await page.locator('script').count()).toBe(0);
  expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toBe("default-src 'self'");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('body').innerText()).not.toMatch(/MBTI|\b[EI][NS][TF][JP]\b/);
  const measurements = [];
  for (const state of ['success', 'warning', 'error', 'info']) {
    const pair = await page.locator('.state-' + state).evaluate(e => ({
      fg: getComputedStyle(e).color,
      bg: getComputedStyle(e).backgroundColor
    }));
    const l = c => {
      const rgb = c.match(/[\d.]+/g).slice(0, 3).map(Number);
      return rgb.map(x => x / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((a, x, i) => a + x * [.2126, .7152, .0722][i], 0);
    };
    const x = l(pair.fg),
      y = l(pair.bg);
    const contrast = (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
    measurements.push({state, ...pair, contrast});
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  }
  expect(errors).toEqual([]);
  if (process.env.CATALOG_EVIDENCE_DIR) {
    fs.mkdirSync(process.env.CATALOG_EVIDENCE_DIR, {
      recursive: true
    });
    fs.writeFileSync(path.join(process.env.CATALOG_EVIDENCE_DIR, `${b.id}-${theme}-${width}.json`), JSON.stringify({brand:b.id, theme, width, externalOrFailedRequests:errors, measurements}, null, 2));
    await page.screenshot({
      path: path.join(process.env.CATALOG_EVIDENCE_DIR, `${b.id}-${theme}-${width}.png`),
      fullPage: true
    });
  }
  await page.goto(`${base}/catalog/${b.id}/${theme}/fundacoes/`);
  expect(await page.locator('h1').count()).toBe(1);
  await page.keyboard.press('Tab');
  expect(await page.locator('nav[aria-label="Marca"] a').first()).toBeFocused();
  expect(await page.locator('nav[aria-label="Marca"] a').first().evaluate(e => parseFloat(getComputedStyle(e).outlineWidth))).toBeGreaterThan(0);
  for (const link of await page.locator('nav[aria-label="Marca"] a').all()) expect(await link.getAttribute('href')).toContain(`/${theme}/`);
  expect(await page.locator('header').evaluate(e => getComputedStyle(e).fontFamily)).toMatch(/^Inter/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
