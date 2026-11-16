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
const definitions = require('../../catalog/extended.config.cjs');
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
async function tabTo(page, locator, max = 60) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    if (await locator.evaluate(e => e === document.activeElement)) return;
  }
  throw Error('O controle não foi alcançado por Tab');
}
async function moduleCase(page, id) {
  if (id === 'sidebar-overlay' || id === 'menu-drawer') {
    const sidebar = id === 'sidebar-overlay',
      opener = page.locator(sidebar ? '#sidebar-open' : '#menu-open'),
      panel = page.locator(sidebar ? '#catalog-sidebar' : '#catalog-menu');
    await expect(panel).toHaveAttribute(sidebar ? 'data-sidebar-ready' : 'data-menu-drawer-ready', '');
    await tabTo(page, opener);
    await page.keyboard.press('Enter');
    await expect(panel).toHaveAttribute('data-open', '');
    await expect(panel).toHaveAttribute('aria-modal', 'true');
    const first = panel.locator('button').first(),
      last = panel.locator('a').last();
    await expect(first).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(last).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(opener).toBeFocused();
    await expect(panel).not.toHaveAttribute('data-open');
    await page.keyboard.press('Space');
    await expect(first).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(opener).toBeFocused();
    if (!sidebar) await expect(panel).toHaveAttribute('inert', '');
  } else if (id === 'split-pane') {
    const h = page.locator('[data-family=resizable] .split-pane-handle');
    await expect(h).toHaveAttribute('role', 'separator');
    await tabTo(page, h);
    const initial = Number(await h.getAttribute('aria-valuenow'));
    await page.keyboard.press('ArrowLeft');
    expect(Number(await h.getAttribute('aria-valuenow'))).toBe(initial - 16);
    await page.keyboard.press('Home');
    expect(await h.getAttribute('aria-valuenow')).toBe(await h.getAttribute('aria-valuemin'));
    await page.keyboard.press('End');
    expect(await h.getAttribute('aria-valuenow')).toBe(await h.getAttribute('aria-valuemax'));
    await page.keyboard.press('Enter');
    expect(Number(await h.getAttribute('aria-valuenow'))).toBe(initial);
    await expect(h).toBeFocused();
    await expect(h).toHaveJSProperty('tabIndex', 0);
  } else if (id === 'disclosure') {
    const d = page.locator('[data-family=default] .disclosure'),
      s = d.locator('summary');
    await expect(d).toHaveAttribute('data-disclosure-ready', '');
    await tabTo(page, s);
    await page.keyboard.press('Enter');
    await expect(d).toHaveAttribute('data-state', 'open');
    await expect(s).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.locator('#disclosure-link')).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Space');
    await expect(d).not.toHaveAttribute('open');
    await expect(s).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(d).toHaveAttribute('data-state', 'open');
    await page.reload();
    await expect(d).toHaveAttribute('data-state', 'open');
  } else if (id === 'header-float') {
    const h = page.locator('[data-header-float]'),
      a = page.locator('#header-brand');
    await expect(h).toHaveAttribute('data-header-float-ready', '');
    await tabTo(page, a);
    await page.keyboard.press('PageDown');
    await expect(h).toHaveAttribute('data-scrolled', '');
    await expect(a).toBeFocused();
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+ArrowUp' : 'Control+Home');
    await expect(h).not.toHaveAttribute('data-scrolled');
    await expect(a).toBeFocused();
  } else if (id === 'cta-dock') {
    await page.setViewportSize({
      width: 390,
      height: 900
    });
    const dock = page.locator('[data-cta-dock]');
    await expect(dock).toHaveAttribute('data-cta-dock-ready', '');
    await expect(dock).not.toHaveAttribute('data-visible');
    await page.keyboard.press('PageDown');
    await expect(dock).toHaveAttribute('data-visible', '');
    // O módulo só observa a rolagem; o link usa o teclado e destino nativos.
    const a = page.locator('#dock-action');
    await a.focus();
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Tab');
    await expect(a).toBeFocused();
    expect(await a.evaluate(e => e.matches(':focus-visible'))).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.locator('#cta-final')).toBeInViewport();
    await expect(dock).not.toHaveAttribute('data-visible');
  }
}
function painted(colors) {
  let c = [0, 0, 0, 0];
  for (const value of colors) {
    const a = rgba(value);
    if (a[3] === 1) c = a;else if (a[3]) c = over(a, c);
  }
  expect(c[3]).toBe(1);
  return c;
}
for (const b of brands) for (const theme of ['light', 'dark']) for (const d of definitions) test(`${b.id} ${theme} ${d.id}: fonte, escopo, teclado e apresentação`, async ({
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
  const url = base + `${b.id}/${theme}/${d.id}/example.html`;
  if (process.env.CATALOG_OMIT_MODULE && d.id === process.env.CATALOG_OMIT_MODULE) await page.route(`**/behaviors/${d.id}.js`, r => r.fulfill({
    status: 200,
    contentType: 'text/javascript',
    body: ''
  }));
  await page.setViewportSize({
    width: 1440,
    height: 900
  });
  expect((await page.goto(url)).status()).toBe(200);
  expect(await page.locator('link[data-brand]').count()).toBe(1);
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
  const scripts = await page.locator('script').evaluateAll(els => els.map(e => e.getAttribute('src').split('/').pop()));
  expect(scripts).toEqual(require('../../catalog/script-policy.cjs').allowedScripts(d.id).map(f => path.basename(f)));
  const loaded = await page.evaluate(async () => {
    const family = getComputedStyle(document.body).fontFamily.split(',')[0],
      font = `400 16px ${family}`,
      faces = await document.fonts.load(font);
    await document.fonts.ready;
    return document.fonts.check(font) && faces.length > 0 && faces.every(f => f.status === 'loaded');
  });
  expect(loaded).toBe(true);
  for (const family of d.families) await expect(page.locator(`[data-family="${family}"]`)).toHaveCount(1);
  expect(await page.locator('body').innerText()).not.toMatch(/MBTI|\b[EI][NS][TF][JP]\b/);
  const pairs = await (await page.request.get(url.replace('example.html', 'contraste.json'))).json(),
    measured = [];
  for (const pair of pairs) {
    const actual = await page.locator(pair.target).first().evaluate(e => {
      const backgrounds = [];
      for (let n = e; n; n = n.parentElement) backgrounds.unshift(getComputedStyle(n).backgroundColor);
      return {
        color: getComputedStyle(e).color,
        backgrounds
      };
    });
    const bg = painted(actual.backgrounds),
      ink = over(rgba(actual.color), bg);
    expect(ink.slice(0, 3)).toEqual(pair.foreground);
    expect(bg.slice(0, 3)).toEqual(pair.background);
    expect(contrast(ink, bg)).toBeCloseTo(pair.ratio, 6);
    measured.push({
      ...pair,
      actual
    });
  }
  expect(await page.locator('[data-extended-pair][data-pending]').count()).toBe(pairs.filter(p => p.ratio < p.minimum).length);
  await moduleCase(page, d.id);
  if (d.id === 'tooltip') {
    const a = page.locator('.tooltip-wrapper').first();
    await a.focus();
    await expect(a.locator('.tooltip')).toHaveCSS('opacity', '1');
  }
  if (d.id === 'toast' || d.id === 'composite') await expect(page.locator('.catalog-pending')).toContainText('só o visual');
  for (const width of [390, 1440]) {
    await page.setViewportSize({
      width,
      height: 900
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (d.id === 'split-pane' && width === 390) await expect(page.locator('.split-pane-handle').first()).toBeHidden();
    if (d.id === 'cta-dock' && width === 1440) await expect(page.locator('.cta-dock')).toBeHidden();
  }
  await page.emulateMedia({
    reducedMotion: 'reduce'
  });
  if (d.id === 'disclosure') {
    await page.locator('summary').first().focus();
    await page.keyboard.press('Space');
    await expect(page.locator('[data-family=default] .disclosure')).not.toHaveAttribute('open');
  }
  if (process.env.CATALOG_EXTENDED_EVIDENCE_DIR) {
    const dir = process.env.CATALOG_EXTENDED_EVIDENCE_DIR;
    fs.mkdirSync(dir, {
      recursive: true
    });
    fs.writeFileSync(path.join(dir, `${b.id}-${theme}-${d.id}.json`), JSON.stringify({
      brand: b.id,
      theme,
      component: d.id,
      measured,
      errors
    }, null, 2));
    // 60 interactives + 30 static samples + 10 mobile overlay samples = 100.
    if (scripts.length || theme === 'light') {
      await page.setViewportSize({
        width: d.id === 'cta-dock' ? 390 : 1440,
        height: 900
      });
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+ArrowUp' : 'Control+Home');
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
      if (d.id === 'sidebar-overlay') await page.locator('#sidebar-open').click();
      if (d.id === 'menu-drawer') await page.locator('#menu-open').click();
      if (d.id === 'cta-dock') {
        await page.keyboard.press('PageDown');
        await expect(page.locator('.cta-dock')).toHaveAttribute('data-visible', '');
      }
      await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      await page.screenshot({
        path: path.join(dir, `${b.id}-${theme}-${d.id}.png`),
        animations: 'disabled',
        caret: 'hide',
        fullPage: !['sidebar-overlay', 'menu-drawer', 'cta-dock', 'header-float'].includes(d.id)
      });
      if (d.id === 'sidebar-overlay') {
        await page.setViewportSize({
          width: 390,
          height: 900
        });
        await page.screenshot({
          path: path.join(dir, `${b.id}-${theme}-${d.id}-390.png`),
          animations: 'disabled',
          caret: 'hide'
        });
      }
    }
  }
  expect(errors).toEqual([]);
});
