// Os modelos guardam estrutura; cores e medidas devem vir da fonte DTCG.
// Exceções estruturais: 0 e 1 de opacidade/transformação, 0% de progresso,
// percentuais de keyframes, multiplicadores de ordem (1–3) e uma iteração.
// Transparent em texto recortado é condição funcional de background-clip.
// Valores em var() são resolvidos por tokens CSS ou por seus fallbacks.
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

function violations(input, filename) {
  const root = postcss.parse(input, { from: filename });
  const errors = [];
  function inspect(text, node) {
    valueParser(text).walk((part) => {
      if (part.type === 'function' && part.value.toLowerCase() === 'var') return false;
      if (part.type === 'function' && /^(rgba?|hsla?)$/i.test(part.value)) errors.push(`${node.source.start.line}: ${part.value}()`);
      if (part.type === 'word' && /#[0-9a-f]{3,8}\b|(?:^|[^a-z\d])[-+]?(?:\d*\.)?\d+(?:px|rem|em|ms|s)\b/i.test(part.value)) errors.push(`${node.source.start.line}: ${part.value}`);
      return undefined;
    });
  }
  root.walkDecls((decl) => inspect(decl.value, decl));
  root.walkAtRules((rule) => inspect(rule.params, rule));
  return errors;
}

test('modelos não contêm literais de cor, dimensão ou tempo fora de var()', () => {
  const dir = 'tokens/dtcg/layouts';
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.css.tmpl'))) {
    expect({ file, errors: violations(fs.readFileSync(path.join(dir, file), 'utf8'), file) }).toEqual({ file, errors: [] });
  }
});

test('varredura rejeita literais e aceita referências e parâmetros estruturais', () => {
  expect(violations('a { color: #abc; background: rgb(1, 2, 3); padding: 1px; animation: 2s; }', 'bad.css')).toHaveLength(4);
  expect(violations('a { padding: var(--padding, 1px); transform: translateY(0); width: 0%; color: __RX_v1__; }', 'ok.css')).toEqual([]);
});
