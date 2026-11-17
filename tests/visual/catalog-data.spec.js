const {
  test,
  expect
} = require('@playwright/test');
const fs = require('fs'),
  path = require('path'),
  http = require('http'),
  os = require('os');
const {
  brands
} = require('../../catalog/bindings.config');
const definitions = require('../../catalog/data.config.cjs');
const {
  rgba,
  over,
  contrast
} = require('../../scripts/catalog/legacy.cjs');
let server, base, published;
test.use({
  launchOptions: process.env.CATALOG_CHROME ? {
    executablePath: process.env.CATALOG_CHROME
  } : undefined
});
test.describe.configure({
  mode: 'default'
});
test.beforeAll(async () => {
  require('../../scripts/catalog/build.cjs').build();
  published = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-legacy-'));
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
const {
  sampleData
} = require('../../scripts/catalog/data.cjs');
const {
  fromOklabChannels
} = require('../../scripts/lib/color');
const {
  parseCssColor
} = require('./lib/css-color');
function cssColor(s) {
  if (s.startsWith('oklab(')) {
    const parts = s.slice(6, -1).split('/'),
      v = parts[0].match(/[+-]?(?:\d*\.)?\d+(?:e[+-]?\d+)?%?/gi);
    const lab = v.map((n, i) => n.endsWith('%') ? parseFloat(n) * (i === 0 ? .01 : .004) : Number(n));
    return fromOklabChannels(lab).concat(parts[1] === undefined ? 1 : parseFloat(parts[1]) / (parts[1].includes('%') ? 100 : 1));
  }
  const c = parseCssColor(s);
  return c.slice(0, 3).concat(c[3] ?? 1);
}
function painted(layers) {
  let c = [0, 0, 0, 0];
  for (const value of layers) {
    const a = cssColor(value);
    if (a[3] === 1) c = a;else if (a[3]) c = over(a, c);
  }
  expect(c[3]).toBe(1);
  return c;
}
for (const b of brands) for (const theme of ['light', 'dark']) for (const d of definitions) test(`${b.id} ${theme} ${d.id}: subfamílias, dados, rede e contraste`, async ({
  page
}) => {
  const errors = [];
  page.on('response', r => {
    if (r.status() >= 400) errors.push(r.status() + ' ' + r.url());
  });
  page.on('request', r => {
    if (!r.url().startsWith(base)) errors.push('Externo ' + r.url());
  });
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => {
    if (m.type() === 'error') errors.push(m.text());
  });
  const prefix = base + `${b.id}/${theme}/${d.id}/`;
  await page.setViewportSize({
    width: 1440,
    height: 1000
  });
  expect((await page.goto(prefix + 'example.html')).status()).toBe(200);
  await expect(page.locator('script')).toHaveCount(0);
  await expect(page.locator('[style]')).toHaveCount(0);
  await expect(page.locator('link[data-brand]')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  expect(await page.locator('body').innerText()).not.toMatch(/MBTI|\b[EI][NS][TF][JP]\b/);
  const loaded = await page.evaluate(async () => {
    const family = getComputedStyle(document.body).fontFamily.split(',')[0],
      font = `400 16px ${family}`,
      faces = await document.fonts.load(font);
    await document.fonts.ready;
    return document.fonts.check(font) && faces.length > 0 && faces.every(f => f.status === 'loaded');
  });
  expect(loaded).toBe(true);
  for (const family of d.families) await expect(page.locator(`[data-family="${family}"]`)).toHaveCount(1);
  const pairs = await (await page.request.get(prefix + 'contraste.json')).json(),
    measurements = [];
  for (const p of pairs) {
    const actual = await page.locator(p.target).first().evaluate(e => {
      const layers = [];
      for (let n = e; n; n = n.parentElement) layers.unshift(getComputedStyle(n).backgroundColor);
      return {
        color: getComputedStyle(e).color,
        layers
      };
    });
    const bg = painted(actual.layers),
      ink = over(cssColor(actual.color), bg),
      ratio = contrast(ink, bg);
    for (let i = 0; i < 3; i++) {
      expect(Math.abs(ink[i] - p.foreground[i]), p.target + ' tinta').toBeLessThan(.1);
      expect(Math.abs(bg[i] - p.background[i]), p.target + ' fundo').toBeLessThan(.1);
    }
    // Precisão de conversão dos canais; o lado do piso WCAG deve coincidir sem arredondar.
    expect(ratio >= p.minimum).toBe(p.ratio >= p.minimum);
    expect(ratio).toBeCloseTo(p.ratio, 3);
    measurements.push({
      ...p,
      actual,
      ratio
    });
  }
  await expect(page.locator('[data-data-pair][data-pending]')).toHaveCount(pairs.filter(p => p.ratio < p.minimum).length);
  await expect(page.locator('[data-data-contrast]')).toContainText(pairs.some(p => p.ratio < p.minimum) ? 'abaixo do mínimo' : 'textos medidos');
  for (const table of await page.locator('table').all()) expect(await table.evaluate(t => [...t.tBodies].flatMap(body => [...body.rows]).every(row => [...row.cells].every(c => t.tHead?.rows[0]?.cells[c.cellIndex]?.getAttribute('scope') === 'col')))).toBe(true);
  if (d.id === 'data-cards') {
    await expect(page.locator('[data-pending-role]')).toHaveCount(3);
    for (const role of ['--surface-accent-cyan', '--surface-accent-magenta', '--surface-accent-purple']) {
      await expect(page.locator(`[data-pending-role="${role}"]`)).toContainText('amostra incompleta');
      expect(await page.locator('html').evaluate((e, key) => getComputedStyle(e).getPropertyValue(key).trim(), role)).toBe('');
    }
    await expect(page.locator('[data-family=status] .dl-status')).toHaveCount(5);
    for (const donut of await page.locator('.dl-donut').all()) expect(await donut.evaluate(e => {
      const box = e.getBoundingClientRect(),
        label = e.querySelector('.dl-donut-label').getBoundingClientRect();
      return label.left >= box.left && label.right <= box.right;
    })).toBe(true);
    const data = sampleData(process.cwd());
    for (const n of data.series) await expect(page.locator('[data-family=chart] figcaption')).toContainText(String(n));
    const link = page.locator('.dl-statcard--compact');
    await link.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(link).toBeFocused();
    expect(await link.evaluate(e => e.matches(':focus-visible'))).toBe(true);
    await page.keyboard.press('Enter');
    await expect.poll(() => new URL(page.url()).hash).toBe('#data-destination');
  } else {
    await expect(page.locator('[data-family=enhanced-table] th[aria-sort]')).toHaveAttribute('aria-sort', 'ascending');
    const first = page.locator('.chart-period-btn').first();
    await first.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(first).toBeFocused();
    await expect(page.locator('.catalog-pending')).toContainText('só estados visuais');
  }
  for (const width of [390, 1440]) {
    await page.setViewportSize({
      width,
      height: 1000
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const wrap of await page.locator('.table-wrap,.dl-table-wrap').all()) {
      expect(await wrap.evaluate(e => ['auto', 'scroll'].includes(getComputedStyle(e).overflowX))).toBe(true);
    }
  }
  if (process.env.CATALOG_DATA_EVIDENCE_DIR) {
    const dir = process.env.CATALOG_DATA_EVIDENCE_DIR;
    fs.mkdirSync(dir, {
      recursive: true
    });
    fs.writeFileSync(path.join(dir, `${b.id}-${theme}-${d.id}.json`), JSON.stringify({
      brand: b.id,
      theme,
      component: d.id,
      measurements,
      errors
    }, null, 2));
    await page.emulateMedia({
      reducedMotion: 'reduce'
    });
    await page.setViewportSize({
      width: 1440,
      height: 1000
    });
    if (d.id === 'data-cards' && (theme === 'light' || b.id === 'resultx')) for (const family of d.families) {
      const box = page.locator(`[data-family="${family}"]`);
      await box.screenshot({
        path: path.join(dir, `${b.id}-${theme}-${family}.png`),
        animations: 'disabled',
        caret: 'hide'
      });
    }
    if (d.id === 'data-patterns' && theme === 'light') await page.screenshot({
      path: path.join(dir, `${b.id}-${theme}-${d.id}.png`),
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
    if (d.id === 'data-cards' && theme === 'light') {
      await page.setViewportSize({
        width: 390,
        height: 1000
      });
      await page.locator('[data-family=table]').screenshot({
        path: path.join(dir, `${b.id}-${theme}-table-390.png`),
        animations: 'disabled',
        caret: 'hide'
      });
    }
  }
  expect(errors).toEqual([]);
});
