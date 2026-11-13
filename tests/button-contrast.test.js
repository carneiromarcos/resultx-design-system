/** WCAG AA para botões: dívidas conhecidas não podem piorar nem permanecer após correção. */
const postcss = require('postcss');
const fs = require('fs');
const { contrastRatio } = require('../scripts/lib/contrast');
const { parseColor, paint } = require('./lib/color');

const read = (path) => fs.readFileSync(path, 'utf8');
const tokenCss = postcss.parse(read('tokens/tokens.css'));
const componentCss = postcss.parse(read('components/components.css'));
const themes = ['dark', 'light', 'premium-light', 'sober-dark', 'vibrant-dark'];
const variants = ['primary', 'secondary', 'success', 'danger']; // warning não existe.
const debt = {
  'dark/danger:hover': 3.18477,
  'light/danger': 4.01094,
  'light/danger:hover': 3.70108,
  'premium-light/secondary:hover': 1.69260,
  'premium-light/success': 3.30210,
  'premium-light/success:hover': 3.73593,
  'premium-light/danger': 3.77171,
  'premium-light/danger:hover': 3.09620,
  'sober-dark/primary': 4.11785,
  'sober-dark/success': 2.31549,
  'sober-dark/success:hover': 2.08883,
  'sober-dark/danger': 3.80958,
  'sober-dark/danger:hover': 3.43502,
  'vibrant-dark/primary:hover': 3.91319,
  'vibrant-dark/success': 2.21306,
  'vibrant-dark/success:hover': 1.82280,
  'vibrant-dark/danger': 3.83142,
  'vibrant-dark/danger:hover': 3.56066,
};

function declarations(root, selector) {
  const result = {};
  root.walkRules((rule) => {
    if (rule.parent.type !== 'root' || rule.selector !== selector) return;
    rule.walkDecls((decl) => { result[decl.prop] = decl.value; });
  });
  return result;
}
function tokens(theme) {
  const base = { ...declarations(tokenCss, ':root'), ...declarations(tokenCss, '[data-theme="dark"]') };
  const source = ['dark', 'light'].includes(theme) ? tokenCss : postcss.parse(read(`tokens/themes/${theme}.css`));
  return { ...base, ...declarations(source, `[data-theme="${theme}"]`) };
}
function resolve(value, vars) {
  if (!value) throw new Error('Declaração de cor ausente');
  return value.replace(/var\((--[\w-]+)\)/g, (_, name) => {
    if (!vars[name]) throw new Error(`Token ausente: ${name}`);
    return resolve(vars[name], vars);
  });
}
function brighten(hex, amount) {
  return `#${[1, 3, 5].map((i) => Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * amount)).toString(16).padStart(2, '0')).join('')}`;
}
function measurement(theme, variant, hover) {
  const vars = tokens(theme);
  const base = declarations(componentCss, `.btn-${variant}`);
  const state = hover ? declarations(componentCss, `.btn-${variant}:hover`) : {};
  const scoped = declarations(componentCss, `[data-theme="${theme}"] .btn-${variant}`);
  const props = { ...base, ...scoped, ...state };
  let background = paint(resolve(props.background, vars), parseColor(vars['--bg-base']).hex);
  let foreground = paint(resolve(props.color, vars), background);
  if (props.filter) {
    const match = /^brightness\(([\d.]+)\)$/.exec(props.filter);
    if (!match) throw new Error(`Filtro não suportado: ${props.filter}`);
    background = brighten(background, Number(match[1]));
    foreground = brighten(foreground, Number(match[1]));
  }
  return { ratio: contrastRatio(foreground, background), foreground, background };
}

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

test('dark automático usa o mesmo token do dark explícito', () => {
  const explicit = declarations(componentCss, '[data-theme="dark"] .btn-success').color;
  let automatic;
  componentCss.walkAtRules('media', (media) => {
    if (media.params !== '(prefers-color-scheme: dark)') return;
    media.walkRules(':root:not([data-theme]) .btn-success', (rule) => {
      rule.walkDecls('color', (decl) => { automatic = decl.value; });
    });
  });
  expect(explicit).toBe('var(--text-on-success)');
  expect(automatic).toBe(explicit);
});
