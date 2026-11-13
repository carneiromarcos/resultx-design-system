// Os modelos guardam estrutura; cores e medidas devem vir da fonte DTCG.
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');
const namedColors = require('color-name');

const systemColors = new Set([
  'transparent', 'currentcolor', 'accentcolor', 'accentcolortext', 'activetext',
  'buttonborder', 'buttonface', 'buttontext', 'canvas', 'canvastext', 'field',
  'fieldtext', 'graytext', 'highlight', 'highlighttext', 'linktext', 'mark',
  'marktext', 'selecteditem', 'selecteditemtext', 'visitedtext',
]);
const colorFunctions = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix', 'device-cmyk', 'light-dark']);

// Cada exceção só vale para a declaração e o contexto explícitos abaixo.
function structural(decl) {
  const { prop, value, parent } = decl;
  const selector = parent.type === 'rule' ? parent.selector.trim() : '';
  const keyframes = parent.parent?.type === 'atrule' && /^(?:-webkit-)?keyframes$/i.test(parent.parent.name)
    ? parent.parent.params.trim() : '';
  if (prop === 'opacity' && /^(?:0|1)$/.test(value) &&
      (keyframes || selector.split(',').every((s) => /^\.(?:emp|rx)-reveal(?:\.d[123])?$/.test(s.trim())))) return true;
  if (prop === 'transform' && selector === 'to' && keyframes &&
      /^(?:translate[XY]\(0\)|scale\(1\))$/.test(value)) return true;
  if (prop === 'width' && keyframes === 'progress-fill' &&
      ((selector === 'from' && value === '0%') ||
       (selector === 'to' && value === 'var(--progress-value, 0%)'))) return true;
  if (prop === 'animation-delay' && /^\.rx-reveal\.d[123]$/.test(selector) &&
      value === `calc(${selector.slice(-1)} * var(--rx-reveal-step))`) return true;
  if (prop === 'animation-iteration-count' && value === '1' &&
      parent.parent?.type === 'atrule' && parent.parent.name === 'media' &&
      parent.parent.params.trim() === '(prefers-reduced-motion: reduce)') return true;
  if (prop === '-webkit-text-fill-color' && value === 'transparent' &&
      parent.nodes.some((d) => d.type === 'decl' && d.prop === 'background-clip' && d.value === 'text') &&
      parent.nodes.some((d) => d.type === 'decl' && d.prop === '-webkit-background-clip' && d.value === 'text')) return true;
  return false;
}

function violations(input, filename) {
  const root = postcss.parse(input, { from: filename });
  const errors = [];
  function inspect(text, node) {
    valueParser(text).walk((part) => {
      if (part.type === 'function' && colorFunctions.has(part.value.toLowerCase())) errors.push(`${node.source.start.line}: ${part.value}()`);
      if (part.type !== 'word') return;
      const word = part.value.toLowerCase();
      if (/^--[\w-]+$/.test(word) || /^__rx_[a-z]\d+__$/.test(word)) return;
      // Aceita nenhuma unidade ou número solto; abrange unidades presentes e futuras.
      if (/^#[\da-f]+$/i.test(word) || /^[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?(?:[a-z]+|%)?$/i.test(word) ||
          Object.hasOwn(namedColors, word) || systemColors.has(word)) errors.push(`${node.source.start.line}: ${part.value}`);
    });
  }
  root.walkDecls((decl) => { if (!structural(decl)) inspect(decl.value, decl); });
  root.walkAtRules((rule) => inspect(rule.params, rule));
  root.walkRules((rule) => {
    if (rule.parent?.type !== 'atrule' || !/^(?:-webkit-)?keyframes$/i.test(rule.parent.name)) return;
    for (const selector of rule.selector.split(',').map((s) => s.trim())) {
      if (/^(?:from|to)$/.test(selector)) continue;
      const match = /^(\d+(?:\.\d+)?)%$/.exec(selector);
      if (!match || Number(match[1]) > 100) errors.push(`${rule.source.start.line}: keyframe ${selector}`);
    }
  });
  return errors;
}

test('modelos não contêm valores visuais literais fora das exceções estruturais', () => {
  const dir = 'tokens/dtcg/layouts';
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.css.tmpl'))) {
    expect({ file, errors: violations(fs.readFileSync(path.join(dir, file), 'utf8'), file) }).toEqual({ file, errors: [] });
  }
});

test.each([
  ['cor nomeada', 'color: red'],
  ['unidade vw', 'width: 20vw'],
  ['escala literal', 'transform: scale(.5)'],
  ['percentual fora de keyframes', 'width: 40%'],
  ['cor no fallback de var', 'color: var(--cor, red)'],
  ['unidade no fallback de var', 'padding: var(--espaco, 1px)'],
  ['hexadecimal', 'color: #abc'],
  ['função de cor', 'background: rgb(1, 2, 3)'],
  ['outras unidades', 'width: calc(1ch + 1fr + 1vh + 1deg)'],
  ['transparência sem recorte', 'color: transparent'],
  ['zero percentual fora do progresso', 'width: 0%'],
  ['opacidade fora de animação', 'opacity: 0'],
  ['transformação fora de keyframes', 'transform: scale(1)'],
])('rejeita %s', (_, declaration) => {
  expect(violations(`a { ${declaration}; }`, 'bad.css').length).toBeGreaterThan(0);
});

test('aceita referências, placeholders e as exceções nos respectivos contextos', () => {
  const css = `@keyframes progress-fill { from { width: 0%; } to { width: var(--progress-value, 0%); } }
    @keyframes pulse { 0%, 50%, 100% { box-shadow: __RX_v1__; } to { transform: scale(1); opacity: 1; } }
    .rx-reveal.d2 { animation-delay: calc(2 * var(--rx-reveal-step)); opacity: 0; }
    .gradient { -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    a { padding: var(--spacing); color: __RX_v1__; }`;
  expect(violations(css, 'ok.css')).toEqual([]);
});
