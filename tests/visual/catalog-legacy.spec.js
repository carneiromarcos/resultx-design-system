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
const definitions = require('../../catalog/legacy.config.cjs');
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
  mode: 'serial'
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
async function pairDOM(locator, kind) {
  return locator.evaluate((el, kind) => {
    const s = getComputedStyle(el);
    const layers = node => {
      const a = [];
      while (node) {
        a.push(getComputedStyle(node).backgroundColor);
        node = node.parentElement;
      }
      return a.reverse();
    };
    return {
      color: s.color,
      backgrounds: layers(el),
      parent: layers(el.parentElement),
      border: s.borderTopColor,
      width: parseFloat(s.borderTopWidth),
      style: s.borderTopStyle,
      opacity: parseFloat(s.opacity),
      outline: s.outlineColor,
      outlineWidth: parseFloat(s.outlineWidth),
      outlineStyle: s.outlineStyle,
      offset: parseFloat(s.outlineOffset)
    };
  }, kind);
}
function painted(layers) {
  let current = [0, 0, 0, 0];
  for (const color of layers) {
    const a = rgba(color);
    if (a[3] === 1) current = a;else if (a[3]) current = over(a, current);
  }
  if (current[3] !== 1) throw Error('Fundo não opaco');
  return current;
}
for (const b of brands) for (const theme of ['light', 'dark']) for (const d of definitions) test(`${b.id} ${theme} ${d.id}: legado, subfamílias e contraste`, async ({
  page
}) => {
  const errors = [];
  page.on('response', r => {
    if (r.status() >= 400) errors.push(r.status() + ' ' + r.url());
  });
  page.on('request', r => {
    if (!r.url().startsWith(base)) errors.push('Externo: ' + r.url());
  });
  page.on('pageerror', e => errors.push(e.message));
  const prefix = base + `${b.id}/${theme}/${d.id}/`,
    file = d.successor ? 'legacy.html' : 'example.html';
  await page.setViewportSize({
    width: 1440,
    height: 1000
  });
  if (d.successor) {
    expect((await page.goto(prefix)).status()).toBe(200);
    const inner = await (await page.locator('iframe').elementHandle()).contentFrame();
    const disclosure = inner.locator('[data-legacy]');
    await expect(disclosure).not.toHaveAttribute('open');
    await expect(disclosure).toContainText('Para telas novas, use o ' + d.successor + ' acima.');
    await disclosure.locator('summary').click();
    const legacy = disclosure.locator('iframe');
    await expect(legacy).toBeVisible();
    await expect((await (await legacy.elementHandle()).contentFrame()).locator('h1')).toHaveText(d.title);
  }
  expect((await page.goto(prefix + file)).status()).toBe(200);
  expect(await page.locator('script').count()).toBe(0);
  expect(await page.locator('[style]').count()).toBe(0);
  expect(await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')).toBe("default-src 'self'");
  expect(await page.locator('link[data-brand]').count()).toBe(1);
  expect(await page.locator('html').getAttribute('data-theme')).toBe(theme);
  expect(await page.locator('body').innerText()).not.toMatch(/MBTI|\b[EI][NS][TF][JP]\b/);
  const font = await page.evaluate(async () => {
    const family = getComputedStyle(document.body).fontFamily.split(',')[0],
      descriptor = `400 16px ${family}`;
    const faces = await document.fonts.load(descriptor);
    await document.fonts.ready;
    return document.fonts.check(descriptor) && faces.length > 0 && faces.every(f => f.status === 'loaded');
  });
  expect(font).toBe(true);
  for (const family of d.families) expect(await page.locator(`[data-family="${family}"]`).count()).toBe(1);
  const report = await (await page.request.get(prefix + (d.successor ? 'legacy-contraste.json' : 'contraste.json'))).json(),
    measurements = [];
  for (const pair of report) {
    const target = page.locator(pair.target).first();
    expect(await target.count()).toBe(1);
    const actual = await pairDOM(target, pair.kind),
      fill = painted(actual.backgrounds),
      adjacent = painted(actual.parent);
    let foreground, background;
    if (pair.kind === 'texto') {
      foreground = over(rgba(actual.color), fill);
      background = fill;
    } else if (pair.kind === 'borda') {
      expect(actual.width).toBeGreaterThan(0);
      expect(['none', 'hidden']).not.toContain(actual.style);
      foreground = over(rgba(actual.border), fill);
      background = adjacent;
    } else {
      foreground = fill;
      background = adjacent;
    }
    expect(foreground.slice(0, 3)).toEqual(pair.foreground);
    expect(background.slice(0, 3)).toEqual(pair.background);
    const ratio = contrast(foreground, background);
    expect(ratio).toBeCloseTo(pair.ratio, 6);
    measurements.push({
      ...pair,
      actual,
      ratio
    });
  }
  const failed = measurements.filter(p => p.ratio < p.minimum);
  await expect(page.locator('[data-legacy-contrast]')).toContainText(failed.length ? 'abaixo do mínimo' : 'pares calculados');
  expect(await page.locator('[data-legacy-pair][data-pending]').count()).toBe(failed.length);
  for (const width of [390, 1440]) {
    await page.setViewportSize({
      width,
      height: 1000
    });
    expect(await page.evaluate(() => [...document.querySelectorAll('body > *, .catalog-family > *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => ({
      tag: e.tagName,
      class: e.className,
      right: e.getBoundingClientRect().right
    })))).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  if (d.id === 'segmented') {
    const radios = page.locator('[data-family=base] input');
    await radios.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(radios.nth(1)).toBeChecked();
    await page.keyboard.press('Space');
    await expect(radios.nth(1)).toBeChecked();
    await page.keyboard.press('Tab');
    expect(await radios.nth(1).evaluate(e => e === document.activeElement)).toBe(false);
  }
  if (d.id === 'navigation' || d.id === 'layout') await expect(page.locator('.catalog-pending')).toContainText('Próximo passo');
  const keyboardTarget = page.locator(d.id === 'segmented' ? '[data-family=base] input:checked' : 'main a[href],main button:not(:disabled),main input:not(:disabled),main select:not(:disabled),main textarea:not(:disabled)').first();
  let focus = null;
  if (await keyboardTarget.count()) {
    await keyboardTarget.focus();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(keyboardTarget).toBeFocused();
    expect(await keyboardTarget.evaluate(e => e.matches(':focus-visible'))).toBe(true);
    focus = await pairDOM(d.id === 'segmented' ? keyboardTarget.locator('..') : keyboardTarget, 'foco');
  }
  if (process.env.CATALOG_LEGACY_EVIDENCE_DIR) {
    const dir = process.env.CATALOG_LEGACY_EVIDENCE_DIR;
    fs.mkdirSync(dir, {
      recursive: true
    });
    fs.writeFileSync(path.join(dir, `${b.id}-${theme}-${d.id}.json`), JSON.stringify({
      brand: b.id,
      theme,
      component: d.id,
      measurements,
      focus,
      externalOrFailedRequests: errors
    }, null, 2));
    await page.screenshot({
      path: path.join(dir, `${b.id}-${theme}-${d.id}.png`),
      fullPage: true,
      animations: 'disabled',
      caret: 'hide'
    });
  }
  expect(errors).toEqual([]);
});
