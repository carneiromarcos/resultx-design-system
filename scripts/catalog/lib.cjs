'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const postcss = require('postcss');
const {allowedScripts} = require('../../catalog/script-policy.cjs');
const {dataRoles} = require('../../catalog/bindings.config.js');
function coverage(root) {
  const m = yaml.load(fs.readFileSync(path.join(root, 'catalog/manifest.yaml'), 'utf8'));
  const expected = ['contracts', 'docs/components'].flatMap(d => fs.readdirSync(path.join(root, d)).filter(f => /\.(yaml|md)$/.test(f)).map(f => `${d}/${f}`));
  const core = fs.readFileSync(path.join(root, 'components/components.css'), 'utf8');
  postcss.parse(core).walkAtRules('import', rule => {
    const target = rule.params.match(/['"]([^'"]+)['"]/);
    if (!target || !target[1].startsWith('./')) throw Error('Import não local: ' + rule.params);
    expected.push(path.posix.join('components', target[1]));
  });
  const excluded = m.excluded || [];
  const entries = m.pages || [];
  const blocks = entries.flatMap(e=>e.legacy ? [e,e.legacy] : [e]);
  for (const e of excluded) if (!e.reason?.trim()) throw Error('Exclusão sem motivo: ' + e.file);
  const covered = new Set([...excluded.map(e => e.file), ...blocks.flatMap(e => [e.contract, ...(e.sources || [])])]);
  for (const f of expected) if (!covered.has(f)) throw Error('Sem entrada no manifesto: ' + f);
  for (const f of [...covered, ...blocks.flatMap(e => [e.recipe, ...(e.css || []), ...(e.js || [])])].filter(Boolean)) if (!fs.existsSync(path.join(root, f))) throw Error('Referência ausente: ' + f);
  for (const e of blocks) {
    const allowed = allowedScripts(e.id);
    if (JSON.stringify(e.js || []) !== JSON.stringify(allowed)) throw Error('JavaScript fora da autorização do catálogo: ' + e.id);
    const html = fs.readFileSync(path.join(root, e.recipe), 'utf8');
    if (/\bstyle\s*=|<style\b|<script\b|#[\da-f]{3,8}\b|\d+(?:px|rem|ms)\b/i.test(html)) throw Error('Literal ou código na receita: ' + e.recipe);
  }
  return {
    manifest: m,
    expected
  };
}
function declarations(root, file, theme, seen = new Set()) {
  if (seen.has(file)) return {};
  seen.add(file);
  const tree = postcss.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const out = {};
  tree.each(node => {
    if (node.type === 'atrule' && node.name === 'import') {
      const target = node.params.match(/['"]([^'"]+)['"]/);
      if (target) Object.assign(out, declarations(root, path.join(path.dirname(file), target[1]), theme, seen));
    }
    if (node.type === 'rule' && (node.selector === ':root' || node.selector === `[data-theme="${theme}"]`)) node.walkDecls(d => {
      if (d.prop.startsWith('--')) out[d.prop] = d.value;
    });
  });
  return out;
}
function resolve(values, name, seen = []) {
  if (seen.includes(name)) throw Error('Ciclo: ' + [...seen, name].join(' -> '));
  const v = values[name];
  if (v === undefined || !v.trim()) throw Error('Papel vazio: ' + name);
  return v.replace(/var\((--[\w-]+)\)/g, (_, n) => resolve(values, n, [...seen, name]));
}
function bindings(root, brand, theme) {
  const core = declarations(root, 'tokens/tokens.css', theme);
  const own = declarations(root, `brands/${brand.dir}/tokens/tokens.css`, theme);
  const bridge = declarations(root, `brands/${brand.dir}/tokens/ds-bridge.css`, theme);
  const vals = brand.id === 'pdv' && theme === 'light' ? {
    ...own,
    ...core,
    ...bridge
  } : {
    ...core,
    ...own,
    ...bridge
  };
  const aliases = {
    ...dataRoles,
    ...brand.common,
    ...brand[theme]
  };
  for (const [role, token] of Object.entries(aliases)) {
    if (!/^--[\w-]+$/.test(token) || !vals[token] || role === token) throw Error('Ligação inválida: ' + role);
    vals[role] = `var(${token})`;
  }
  for (const [s, t] of Object.entries(brand.statuses)) {
    if (!vals[t]) throw Error('Estado sem origem: ' + t);
    vals['--catalog-' + s] = `var(${t})`;
    aliases['--catalog-' + s] = t;
  }
  for (const k of ['--bg-base', '--bg-surface-1', '--text-primary', '--font-body', '--font-heading', '--font-mono', '--radius-md', '--shadow-md', '--accent-primary', ...Object.keys(aliases)]) resolve(vals, k);
  return {
    values: vals,
    aliases
  };
}
function luminance(hex) {
  const c = hex.match(/^#([\da-f]{6}|[\da-f]{3})$/i);
  if (!c) throw Error('Cor não opaca: ' + hex);
  let h = c[1];
  if (h.length === 3) h = [...h].map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((a, x, i) => a + x * [.2126, .7152, .0722][i], 0);
}
function ratio(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
module.exports = {
  coverage,
  declarations,
  resolve,
  bindings,
  ratio
};
