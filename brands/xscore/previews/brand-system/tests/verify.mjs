import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
const evidence = path.join(root, 'brands/xscore/docs/qa');
fs.mkdirSync(evidence, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const name = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://local').pathname));
  if (!name.startsWith(root + path.sep) || !fs.existsSync(name) || !fs.statSync(name).isFile()) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', types[path.extname(name)] ?? 'text/plain'); res.end(fs.readFileSync(name));
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const report = { method: 'Local static documents; native links/details; no browser script in artifacts', chromium: browser.version(), scenarios: [] };
try {
  for (const width of [390, 1440]) for (const [file, theme] of [['index.html', 'dark'], ['light.html', 'light']]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('response', response => { if (response.status() >= 400) failures.push(`HTTP ${response.status()}`); });
    page.on('request', request => { if (new URL(request.url()).origin !== origin) failures.push('External request'); });
    await page.addInitScript(() => { window.cspViolations = []; document.addEventListener('securitypolicyviolation', e => window.cspViolations.push(e.violatedDirective)); });
    await page.goto(`${origin}/brands/xscore/previews/brand-system/${file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    assert.equal(await page.locator('script').count(), 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), width, 'Horizontal overflow');
    assert.deepEqual(await page.evaluate(() => window.cspViolations), []);
    const fonts = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family.replaceAll('"', '')));
    for (const family of ['Sora', 'Plus Jakarta Sans', 'Geist Mono']) assert.ok(fonts.includes(family), `${family}: FontFace not loaded`);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Pular para o conteúdo');
    await page.keyboard.press('Enter');
    await page.locator('.theme-link').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme === 'dark' ? 'light' : 'dark');
    await page.goBack({ waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(evidence, `brand-${width}-${theme}.png`) });
    await page.locator('#ds-logo').screenshot({ path: path.join(evidence, `logo-${width}-${theme}.png`) });
    // Text-only contrast sampling. Gradients and images remain outside this measurement.
    const pairs = await page.evaluate(() => {
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      const rgba = color => { ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1); return [...ctx.getImageData(0, 0, 1, 1).data]; };
      const compose = (fg, bg) => { const a = fg[3] / 255; return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)); };
      const lum = c => c.map(v => { const n = v / 255; return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }).reduce((a, n, i) => a + n * [.2126, .7152, .0722][i], 0);
      return [...document.querySelectorAll('h1,h2,h3,p,code,summary,a,th,td,dt,dd,figcaption')].filter(el => el.getClientRects().length && el.textContent.trim()).flatMap(el => {
        const chain = []; for (let n = el; n; n = n.parentElement) chain.unshift(n);
        if (chain.some(n => getComputedStyle(n).backgroundImage !== 'none')) return [];
        let bg = [255, 255, 255]; for (const n of chain) bg = compose(rgba(getComputedStyle(n).backgroundColor), bg);
        const s = getComputedStyle(el), fg = compose(rgba(s.color), bg), a = lum(fg), b = lum(bg);
        const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
        const minimum = parseFloat(s.fontSize) >= 24 || parseFloat(s.fontSize) >= 18.66 && Number(s.fontWeight) >= 700 ? 3 : 4.5;
        return [{ text: el.textContent.trim().slice(0, 70), ratio: Number(ratio.toFixed(2)), minimum }];
      });
    });
    const lowContrast = pairs.filter(pair => pair.ratio < pair.minimum);
    assert.equal(failures.length, 0, failures.join('; '));
    report.scenarios.push({ width, theme, pageErrors: 0, cspViolations: 0, externalRequests: 0, horizontalOverflow: false, fonts, nativeThemeNavigation: true, textPairs: pairs.length, lowContrast });
    await context.close();
  }
} finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
  fs.writeFileSync(path.join(evidence, 'brand-system-browser.json'), JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report));
assert.equal(report.scenarios.length, 4);
assert.equal(report.scenarios.flatMap(s => s.lowContrast).length, 0, 'Color findings require matrix entries and coordination, never silent token changes');
