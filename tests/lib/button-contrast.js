const postcss = require('postcss');
const fs = require('fs');
const { contrastRatio } = require('../../scripts/lib/contrast');
const { parseColor, paint } = require('./color');
const read = (path) => fs.readFileSync(path, 'utf8');
const tokenCss = postcss.parse(read('tokens/tokens.css'));
const componentCss = postcss.parse(read('components/components.css'));

function declarations(root, selector) {
  const result = {};
  root.walkRules((rule) => {
    if (rule.parent.type !== 'root' || rule.selector !== selector) return;
    rule.walkDecls((decl) => { result[decl.prop] = decl.value; });
  });
  return result;
}
function tokens(theme) {
  const base = declarations(tokenCss, ':root');
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
  const scoped = declarations(componentCss, `:where([data-theme="${theme}"]) .btn-${variant}`);
  const scopedState = hover ? declarations(componentCss, `:where([data-theme="${theme}"]) .btn-${variant}:hover`) : {};
  const props = { ...base, ...state, ...scoped, ...scopedState };
  let background = paint(resolve(props.background, vars), parseColor(vars['--bg-base']).hex);
  // Uma declaração com var() ausente é inválida e color herda do pai.
  let foreground;
  try { foreground = paint(resolve(props.color, vars), background); }
  catch (error) {
    if (!error.message.startsWith('Token ausente:')) throw error;
    foreground = paint(resolve(vars['--text-primary'], vars), background);
  }
  if (props.filter && props.filter !== 'none') {
    const match = /^brightness\(([\d.]+)\)$/.exec(props.filter);
    if (!match) throw new Error(`Filtro não suportado: ${props.filter}`);
    background = brighten(background, Number(match[1]));
    foreground = brighten(foreground, Number(match[1]));
  }
  return { ratio: contrastRatio(foreground, background), foreground, background };
}


module.exports = { declarations, measurement, componentCss };
