const {
  test,
  expect
} = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const {
  brands
} = require('../../catalog/bindings.config');
const {
  preparePages
} = require('../../scripts/prepare-pages.cjs');
let server, base, out;
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
  out = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-published-'));
  preparePages({
    out
  });
  server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(req.url.split('?')[0]);
    // Testa a hospedagem em subdiretório do GitHub Pages, não apenas na raiz.
    if (!pathname.startsWith('/resultx-design-system/')) {
      res.writeHead(404);
      return res.end();
    }
    let file = path.join(out, pathname.slice('/resultx-design-system/'.length));
    if (file !== out && !file.startsWith(out + path.sep)) {
      res.writeHead(403);
      return res.end();
    }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      res.setHeader('Content-Type', {
        '.html': 'text/html',
        '.css': 'text/css',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.js': 'text/javascript'
      }[path.extname(file)] || 'text/plain');
      res.end(fs.readFileSync(file));
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}/resultx-design-system/`;
});
test.afterAll(async () => {
  await require('../../scripts/catalog/test-server.cjs').closeServer(server);
  if (out) fs.rmSync(out, {
    recursive: true,
    force: true
  });
});
async function loadedFont(page, family) {
  const result = await page.evaluate(async family => {
    const faces = await document.fonts.load(`400 16px "${family}"`);
    await document.fonts.ready;
    return {
      check: document.fonts.check(`16px "${family}"`),
      loaded: faces.length > 0 && faces.every(face => face.status === 'loaded')
    };
  }, family);
  expect(result).toEqual({
    check: true,
    loaded: true
  });
}
test('publicação inclui catálogo e fontes na árvore final', async ({
  request
}) => {
  for (const url of ['catalog/eletia/light/fundacoes/', 'assets/fonts/inter/Inter-Regular.woff2']) expect.soft((await request.get(base + url)).status(), url).toBe(200);
});
test('entrada e URLs antigas continuam acessíveis', async ({
  request
}) => {
  for (const url of ['', 'docs/viewer.html', 'tokens/themes/preview.html', 'brands/resultx/previews/brand-system.html']) expect((await request.get(base + url)).status(), url).toBe(200);
  const root = path.resolve(__dirname, '../../demos');
  for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) expect((await request.get(base + 'demos/' + file)).status()).toBe(200);
  const viewer = await (await request.get(base + 'docs/viewer.html')).text();
  expect(viewer).toContain('../catalog/');
});
for (const b of brands) for (const theme of ['light', 'dark']) test(`publicado ${b.id} ${theme}: rede, fontes e navegação`, async ({
  page
}) => {
  const failures = [];
  page.on('response', r => {
    if (r.status() >= 400) failures.push(r.status() + ' ' + r.url());
  });
  page.on('request', r => {
    if (!r.url().startsWith(base)) failures.push('Externa: ' + r.url());
  });
  page.on('requestfailed', r => failures.push('Falha: ' + r.url()));
  const response = await page.goto(base + `catalog/${b.id}/${theme}/fundacoes/`);
  expect(response.status()).toBe(200);
  await loadedFont(page, 'Inter');
  const frame = page.frameLocator('iframe');
  await expect(frame.locator('h1')).toHaveText(b.label);
  const content = await page.locator('iframe').elementHandle();
  const inner = await content.contentFrame();
  for (const family of b.id === 'xscore' ? ['Sora', 'Inter', 'JetBrains Mono', 'Plus Jakarta Sans', 'Geist Mono'] : ['Sora', 'Inter', 'JetBrains Mono']) await loadedFont(inner, family);
  await expect(page.locator('[data-catalog-notice]')).toContainText('Próximo passo');
  await expect(frame.locator('[data-catalog-notice]')).toContainText('Próximo passo');
  expect(await page.locator('script').count()).toBe(0);
  expect(await frame.locator('script').count()).toBe(0);
  expect(await inner.locator('body').innerText()).not.toMatch(/MBTI|\b[EI][NS][TF][JP]\b/);
  expect(failures).toEqual([]);
});
test('índice publicado apresenta as cinco marcas e segue os links locais', async ({
  page
}) => {
  const failures = [];
  page.on('response', r => {
    if (r.status() >= 400) failures.push(r.url());
  });
  page.on('request', r => {
    if (!r.url().startsWith(base)) failures.push(r.url());
  });
  page.on('requestfailed', r => failures.push(r.url()));
  await page.setViewportSize({
    width: 390,
    height: 900
  });
  const response = await page.goto(base + 'catalog/');
  expect(response.status()).toBe(200);
  await loadedFont(page, 'Inter');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('h1')).toHaveText('Catálogo de marcas');
  for (const b of brands) {
    const link = page.locator(`[data-brand-entry="${b.id}"]`);
    await expect(link).toContainText(b.label);
    const response = await page.request.get(new URL(await link.getAttribute('href'), page.url()).href);
    expect(response.status()).toBe(200);
  }
  await expect(page.locator('[data-catalog-notice]')).toContainText('Próximo passo');
  expect(failures).toEqual([]);
});
test('preview antigo carrega suas fontes locais publicadas', async ({
  page
}) => {
  const failures = [];
  page.on('response', r => {
    if (r.status() >= 400) failures.push(r.status() + ' ' + r.url());
  });
  await page.goto(base + 'tokens/themes/preview.html');
  for (const family of ['Inter', 'Sora', 'JetBrains Mono']) await loadedFont(page, family);
  expect(failures).toEqual([]);
});
