/** WCAG AA para botões: dívidas conhecidas não podem piorar nem permanecer após correção. */
const { declarations, measurement, componentCss } = require('./lib/button-contrast');
const themes = ['dark', 'light', 'premium-light', 'sober-dark', 'vibrant-dark'];
const variants = ['primary', 'secondary', 'success', 'danger']; // warning não existe.
const debt = {};


test('contraste dos botões não cria nem agrava dívidas WCAG AA', () => {
  const problems = [];
  for (const theme of themes) for (const variant of variants) for (const hover of [false, true]) {
    const key = `${theme}/${variant}${hover ? ':hover' : ''}`;
    const { ratio, foreground, background } = measurement(theme, variant, hover);
    if (ratio < 4.5 && !(key in debt)) problems.push(`${key}: NOVO ${ratio.toFixed(5)}:1 (${foreground} sobre ${background})`);
    else if (ratio < 4.5 && ratio + 0.0000051 < debt[key]) problems.push(`${key}: PIOROU ${ratio.toFixed(5)} < ${debt[key]}`);
    else if (ratio >= 4.5 && key in debt) problems.push(`${key}: CORRIGIDO ${ratio.toFixed(5)}: remover da dívida`);
  }
  const validKeys = new Set(themes.flatMap((theme) => variants.flatMap((variant) =>
    [false, true].map((hover) => `${theme}/${variant}${hover ? ':hover' : ''}`))));
  for (const key of Object.keys(debt)) if (!validKeys.has(key)) problems.push(`${key}: dívida sem par correspondente`);
  expect(problems).toEqual([]);
});

test('success usa texto sobre sucesso por padrão, inclusive no dark automático', () => {
  expect(declarations(componentCss, '.btn-success').color).toBe('var(--text-on-success)');
});
