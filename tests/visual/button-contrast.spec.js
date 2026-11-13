// Confere a medição do Jest contra estilos resolvidos pelo navegador, sem capturas.
const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');
const { measurement } = require('../lib/button-contrast');
const { parseColor, paint } = require('../lib/color');
const { contrastRatio } = require('../../scripts/lib/contrast');

const preview = pathToFileURL(path.resolve(__dirname, '../../tokens/themes/preview.html')).href;
const variants = ['primary', 'secondary', 'success', 'danger'];
const themes = ['dark', 'light', 'premium-light', 'sober-dark', 'vibrant-dark'];

function brighten(hex, factor) {
  return `#${[1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * factor)).toString(16).padStart(2, '0')).join('')}`;
}

test('contraste calculado corresponde aos estilos resolvidos pelo navegador', async ({ page }) => {
  await page.goto(preview);
  await page.addStyleTag({ url: pathToFileURL(path.resolve(__dirname, '../../components/components.css')).href });
  await page.addStyleTag({ content: 'body { background: var(--bg-base); } *, *::before, *::after { transition: none !important; animation: none !important; }' });
  await page.evaluate(() => { document.body.innerHTML = '<button class="btn">Teste</button>'; });
  const button = page.locator('button');

  for (const theme of [...themes, 'auto-dark', 'auto-light']) {
    const auto = theme.startsWith('auto-');
    const actualTheme = auto ? theme.slice(5) : theme;
    await page.emulateMedia({ colorScheme: actualTheme === 'light' ? 'light' : 'dark' });
    await page.evaluate(({ auto, themeName }) => {
      if (auto) delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = themeName;
    }, { auto, themeName: actualTheme });
    for (const variant of variants) {
      await button.evaluate((element, name) => { element.className = `btn btn-${name}`; }, variant);
      for (const hover of [false, true]) {
        if (hover) await button.hover();
        else await page.mouse.move(0, 0);
        const style = await button.evaluate((element) => {
          const css = getComputedStyle(element);
          return { hovered: element.matches(':hover'), color: css.color, background: css.backgroundColor, filter: css.filter,
            surface: getComputedStyle(document.body).backgroundColor };
        });
        expect(style.hovered, `${theme}/${variant}: hover`).toBe(hover);
        const surface = parseColor(style.surface).hex;
        let background = paint(style.background, surface);
        let foreground = paint(style.color, background);
        if (style.filter !== 'none') {
          const match = /^brightness\(([\d.]+)\)$/.exec(style.filter);
          expect(match, `${theme}/${variant}: filtro não suportado`).not.toBeNull();
          background = brighten(background, Number(match[1]));
          foreground = brighten(foreground, Number(match[1]));
        }
        const expected = measurement(actualTheme, variant, hover);
        const label = `${theme}/${variant}${hover ? ':hover' : ''}`;
        expect(foreground.toLowerCase(), `${label} texto`).toBe(expected.foreground.toLowerCase());
        expect(background.toLowerCase(), `${label} fundo`).toBe(expected.background.toLowerCase());
        expect(contrastRatio(foreground, background), `${label} contraste`).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
});
