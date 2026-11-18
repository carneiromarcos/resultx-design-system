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

// C-cor-1 is additive: only these new declarations are excluded from the
// v2.10.0 comparison. Every other legacy declaration, scope and order remains
// under the E1 contract.
const C_COR1_ADDITIVE_TOKENS = new Set([
  '--surface-decorative-cyan', '--surface-decorative-magenta', '--surface-decorative-purple',
  '--ink-decorative-cyan', '--ink-decorative-magenta', '--ink-decorative-purple',
  '--danger-strong', '--on-danger-strong', '--color-error-text', '--text-unavailable',
]);

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

function withoutCcor1Additions(normalized) {
  return normalized.filter((entry) => {
    if (entry[0] !== 'decl') return true;
    const name = entry[2];
    const inlineThemeName = name.startsWith('--color-') ? `--${name.slice('--color-'.length)}` : name;
    return !C_COR1_ADDITIVE_TOKENS.has(name) && !C_COR1_ADDITIVE_TOKENS.has(inlineThemeName);
  });
}

function withoutCcor1TypeScriptAdditions(source) {
  const names = new Set([...C_COR1_ADDITIVE_TOKENS].map(name => name.slice(2)));
  const lines = source.split('\n').filter(line => {
    const token = /^\s*"([\w-]+)":/.exec(line);
    return !token || !names.has(token[1]);
  });
  for (let i = 1; i < lines.length; i++) {
    if (/^\s*}\s+as const;/.test(lines[i])) lines[i - 1] = lines[i - 1].replace(/,\s*$/, '');
  }
  return lines.join('\n');
}

module.exports = { CSS_FILES, normalizeCss, C_COR1_ADDITIVE_TOKENS, withoutCcor1Additions, withoutCcor1TypeScriptAdditions };
