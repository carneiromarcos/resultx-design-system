#!/usr/bin/env node
import fs from 'node:fs';
import crypto from 'node:crypto';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';

const prefix = process.env.RESULTX_PILOT_SCOPE || ':is(.rx-pilot, #rx-pilot-floor)';
const source = process.env.RESULTX_PILOT_SOURCE || 'adapters/css/pilot.css';
const scopedFile = process.env.RESULTX_PILOT_OUTPUT || 'adapters/css/pilot.scoped.css';
const aliasFile = process.env.RESULTX_PILOT_ALIASES || 'brands/emprega-mais/tokens/pilot-aliases.css';
const data = JSON.parse(fs.readFileSync('tokens/tokens.json', 'utf8'));
const edsFile = 'brands/emprega-mais/tokens/eds-root.css';
const edsRoot = postcss.parse(fs.readFileSync(edsFile, 'utf8'));
const eds = new Set();
edsRoot.walkDecls((d) => { if (d.prop.startsWith('--eds-')) eds.add(d.prop); });
const map = {
  '--text-primary': '--eds-ink-strong', '--text-secondary': '--eds-ink-medium',
  '--bg-surface-1': '--eds-surface', '--bg-surface-2': '--eds-surface-tonal',
  '--bg-surface-3': '--eds-surface-tonal-dark', '--color-error': '--eds-danger-ink',
  '--color-success': '--eds-success-ink', '--text-on-success': '--eds-surface',
  '--accent-primary-text': '--eds-brand-ink', '--font-body': '--eds-font-body',
  '--radius-md': '--eds-radius-btn',
};
const fallback = {
  '--space-2': 'semantic.foundation.space-2', '--space-3': 'semantic.foundation.space-3',
  '--space-4': 'semantic.foundation.space-4', '--space-6': 'semantic.foundation.space-6',
  '--focus-ring-width': 'semantic.core.shared.focus-ring-width', '--focus-ring-offset': 'semantic.core.shared.focus-ring-offset',
  '--font-regular': 'semantic.core.shared.font-regular', '--font-semibold': 'semantic.core.shared.font-semibold',
  '--font-bold': 'semantic.core.shared.font-bold', '--text-base': 'semantic.core.shared.text-base',
};
function token(path, seen = new Set()) {
  if (seen.has(path)) throw new Error(`Ciclo na fonte DTCG: ${path}`);
  seen.add(path);
  const node = path.split('.').reduce((v, part) => v?.[part], data);
  if (!node || !('$value' in node)) throw new Error(`Token DTCG ausente: ${path}`);
  const v = node.$value;
  if (typeof v === 'string' && /^\{[^{}]+\}$/.test(v)) return token(v.slice(1, -1), seen);
  if (typeof v === 'number') return String(v);
  if (v && typeof v === 'object' && 'value' in v && 'unit' in v) return `${v.value}${v.unit}`;
  throw new Error(`Tipo de token sem formato CSS: ${path}`);
}
function inKeyframes(rule) {
  for (let p = rule.parent; p; p = p.parent) if (p.type === 'atrule' && /keyframes$/i.test(p.name)) return true;
  return false;
}
const root = postcss.parse(fs.readFileSync(source, 'utf8'));
const consumed = new Set();
root.walkDecls((decl) => valueParser(decl.value).walk((n) => {
  if (n.type === 'function' && n.value === 'var') consumed.add(n.nodes[0].value);
}));
root.walkRules((rule) => {
  if (!inKeyframes(rule)) rule.selectors = rule.selectors.map((selector) => `${prefix} ${selector.trim()}`);
});
root.walkAtRules('layer', (layer) => {
  if (!layer.nodes) throw new Error('Declaração de ordem @layer não pode ser removida com segurança.');
  layer.replaceWith(...layer.nodes);
});
const lines = [...consumed].sort().map((name) => {
  if (map[name]) {
    if (!eds.has(map[name])) throw new Error(`Token da marca ausente: ${map[name]}`);
    return `  ${name}: var(${map[name]});`;
  }
  if (!fallback[name]) throw new Error(`Token consumido sem mapeamento: ${name}`);
  return `  ${name}: ${token(fallback[name])};`;
});
const aliases = `/* Gerado de tokens/tokens.json e dos tokens Emprega+; não editar. */\n${prefix} {\n${lines.join('\n')}\n}\n`;
const scoped = `${root.toString().trimEnd()}\n`;
for (const [file, content] of [[scopedFile, scoped], [aliasFile, aliases]]) {
  fs.writeFileSync(file, content);
  fs.writeFileSync(`${file}.sha256`, `${crypto.createHash('sha256').update(content).digest('hex')}\n`);
}
console.log(`Gerados ${scopedFile} e ${aliasFile}; ${consumed.size} aliases.`);
