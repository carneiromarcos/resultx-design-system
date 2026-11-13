'use strict';

// A ordem de inserção nesta lista e a ordem de cada declaração são relevantes.
const CSS_FILES = [
  'tokens/base/tokens-base.css',
  'tokens/tokens.css',
  'tokens/themes/_data-layer-shared.css',
  'tokens/themes/premium-light.css',
  'tokens/themes/sober-dark.css',
  'tokens/themes/vibrant-dark.css',
  ...['electia', 'emprega-mais', 'pdv', 'resultx', 'xscore'].flatMap((brand) => [
    `brands/${brand}/tokens/tokens.css`,
    `brands/${brand}/tokens/ds-bridge.css`,
  ]),
  'dist/tokens.theme.css',
  'dist/tokens.min.css',
];

const postcss = require('postcss');

/** CSS -> sequência ordenada de escopos e declarações; ignora somente comentários e espaços. */
function normalizeCss(source, file) {
  const root = postcss.parse(source, { from: file });
  const output = [];
  // Espaço dentro de string CSS é conteúdo, não formatação.
  const normalize = (value) => {
    let out = '';
    let quote = null;
    let escaped = false;
    let pendingSpace = false;
    for (const char of value.trim()) {
      if (quote) {
        out += char;
        if (escaped) escaped = false;
        else if (char === '\\') escaped = true;
        else if (char === quote) quote = null;
      } else if (char === '"' || char === "'") {
        if (pendingSpace && out) out += ' ';
        pendingSpace = false;
        quote = char;
        out += char;
      } else if (/\s/.test(char)) pendingSpace = true;
      else {
        if (pendingSpace && out) out += ' ';
        pendingSpace = false;
        out += char;
      }
    }
    return out;
  };
  function visit(node, scope) {
    if (node.type === 'comment') return;
    if (node.type === 'decl') {
      output.push(['decl', scope, node.prop, normalize(node.value), Boolean(node.important)]);
      return;
    }
    if (node.type === 'rule') {
      for (const child of node.nodes || []) visit(child, [...scope, ['selector', normalize(node.selector)]]);
      return;
    }
    if (node.type === 'atrule') {
      const descriptor = ['at', node.name, normalize(node.params)];
      if (!node.nodes) output.push(['statement', scope, descriptor]);
      else for (const child of node.nodes) visit(child, [...scope, descriptor]);
      return;
    }
    for (const child of node.nodes || []) visit(child, scope);
  }
  visit(root, []);
  return output;
}

module.exports = { CSS_FILES, normalizeCss };
