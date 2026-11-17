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
async function loadedFont(page, family, weight = 400) {
  const result = await page.evaluate(async ({family, weight}) => {
    const faces = await document.fonts.load(`${weight} 16px "${family}"`);
    await document.fonts.ready;
    return {
      check: document.fonts.check(`${weight} 16px "${family}"`),
      loaded: faces.length > 0 && faces.every(face => face.status === 'loaded')
    };
  }, {family, weight});
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

const publishedBrands = [
  {id: 'emprega-mais', files: ['index.html', 'dark.html'], fonts: [['Inter', 400], ['Inter', 500], ['Inter', 600], ['Sora', 600], ['JetBrains Mono', 400]]},
  {id: 'xscore', files: ['index.html', 'light.html'], fonts: [['Plus Jakarta Sans', 400], ['Plus Jakarta Sans', 600], ['Sora', 600], ['Sora', 700], ['Geist Mono', 400]]}
];
for (const brand of publishedBrands) for (const file of brand.files) test(`brand system publicado ${brand.id}/${file}: recursos e links internos`, async ({page, request}) => {
  const failures = [];
  page.on('response', response => {if (response.status() >= 400) failures.push(response.status() + ' ' + response.url());});
  page.on('request', req => {if (!req.url().startsWith(base)) failures.push('Externa: ' + req.url());});
  page.on('requestfailed', req => failures.push('Falha: ' + req.url()));
  await page.setViewportSize({width: 390, height: 900});
  const response = await page.goto(base + `brands/${brand.id}/previews/brand-system/${file}`);
  expect(response.status()).toBe(200);
  for (const [family, weight] of brand.fonts) await loadedFont(page, family, weight);
  await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute('content', "default-src 'self'");
  expect(await page.locator('script').count()).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  const links = await page.locator('a[href], link[href], img[src]').evaluateAll(elements => elements.map(element => element.href || element.src));
  const published = new URL('https://carneiromarcos.github.io/resultx-design-system/');
  for (const value of new Set(links)) {
    let url = new URL(value);
    // URLs absolutas do catálogo oficial são verificadas na mesma árvore local.
    if (url.origin === published.origin && url.pathname.startsWith(published.pathname)) url = new URL(url.pathname.slice(published.pathname.length) + url.hash, base);
    if (url.origin !== new URL(base).origin) continue; // Fonte no GitHub é navegação externa, não renderização.
    if (url.hash) {
      const html = await (await request.get(url.href)).text();
      const id = decodeURIComponent(url.hash.slice(1));
      expect(html.includes(`id="${id}"`) || html.includes(`id='${id}'`), url.href).toBe(true);
    }
    expect((await request.get(url.href)).status(), url.href).toBe(200);
  }
  expect(failures).toEqual([]);
});

test('URLs excluídas das duas marcas respondem 404', async ({request}) => {
  for (const file of [
    'brands/emprega-mais/previews/prototypes/emprega-mais-ecossistema-2026-10-06.html',
    'brands/emprega-mais/previews/_archive/design-system-v1.html',
    'brands/emprega-mais/mockups/dashboards/dashboard.png',
    'brands/emprega-mais/brand-guidelines.html',
    'brands/xscore/previews/brand-system/build.cjs',
    'brands/xscore/docs/qa/brand-1440-dark.png'
  ]) expect((await request.get(base + file)).status(), file).toBe(404);
});
