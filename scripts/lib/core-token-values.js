'use strict';

// Valores de infraestrutura das pontes saem do CSS núcleo gerado pelo DTCG.
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const { toRgb } = require('./contrast');

const file = path.resolve(__dirname, '../../tokens/tokens.css');
const root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });
function token(selector, name) {
  let value;
  root.walkRules((rule) => {
    if (rule.parent.type !== 'root' || rule.selector !== selector) return;
    rule.walkDecls(name, (decl) => { value = decl.value.trim(); });
  });
  if (!value) throw new Error(`Token ${name} ausente em ${selector} (${file})`);
  return value;
}
function opaqueHex(selector, name) {
  return `#${toRgb(token(selector, name)).map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}
function rgbaAlpha(selector, name) {
  const value = token(selector, name);
  const match = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0?(?:\.\d+)?|1(?:\.0+)?)\s*\)$/.exec(value);
  if (!match) throw new Error(`Token ${name} deve ser rgba para a ponte: ${value}`);
  return Number(match[1]);
}
const selector = (theme) => `[data-theme="${theme}"]`;
module.exports = { token, opaqueHex, rgbaAlpha, selector };
