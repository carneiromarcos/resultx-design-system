// Renderiza as 9 demos do hub (pages/) como PNGs para galeria visual
// em brands/emprega-mais/mockups/dashboards/.
// Uso: node scripts/render-dashboards.mjs (executar a partir de design-system/)

import { chromium } from 'playwright';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dsRoot = join(__dirname, '..');
const inPath = join(dsRoot, 'demos');
const outPath = join(dsRoot, 'brands/emprega-mais/mockups/dashboards');

const pages = [
  'dashboard',
  'login',
  'candidatos',
  'employer-jobs',
  'employer-job-applicants',
  'triagem',
  '404',
  'positioning-wheel-demo',
  'electia-copiloto',
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();

for (const p of pages) {
  try {
    await page.goto(`file://${join(inPath, p + '.html')}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.screenshot({ path: join(outPath, p + '.png'), fullPage: true });
    console.log(`✓ ${p}.png`);
  } catch (err) {
    console.log(`✗ ${p}.png — ${err.message}`);
  }
}

await browser.close();
console.log('done');
