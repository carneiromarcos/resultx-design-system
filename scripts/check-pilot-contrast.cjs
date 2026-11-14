#!/usr/bin/env node
const fs = require('fs');
const postcss = require('postcss');
const root = postcss.parse(fs.readFileSync('brands/emprega-mais/tokens/eds-root.css', 'utf8'));
const aliasRoot = postcss.parse(fs.readFileSync('brands/emprega-mais/tokens/pilot-aliases.css', 'utf8'));
const aliases = {};
aliasRoot.walkDecls((d) => { aliases[d.prop] = d.value; });
const themes = { light: {}, dark: {} };
root.walkRules((r) => { if (r.selector === ':root') r.walkDecls((d) => { themes.light[d.prop] = d.value; }); });
themes.dark = { ...themes.light };
root.walkRules((r) => { if (r.selector === '[data-theme="dark"]') r.walkDecls((d) => { themes.dark[d.prop] = d.value; }); });
function resolve(name, vars, visited = []) {
  if (visited.includes(name)) throw new Error(`Ciclo: ${name}`);
  const value = aliases[name] ?? vars[name];
  if (value === undefined) throw new Error(`Token ausente: ${name}`);
  return value.replace(/var\((--[\w-]+)(?:,\s*var\((--[\w-]+)\))?\)/g, (_, key, fallback) => {
    const target = aliases[key] !== undefined || vars[key] !== undefined ? key : fallback;
    if (!target) throw new Error(`Token ausente: ${key}`);
    return resolve(target, vars, [...visited, name]);
  });
}
function rgb(value) {
  const mix = /^color-mix\(in srgb,\s*(#[a-f\d]+)\s+([\d.]+)%,\s*(#[a-f\d]+)\)$/i.exec(value);
  if (mix) { const a = rgb(mix[1]), b = rgb(mix[3]), t = Number(mix[2]) / 100; return a.map((c, i) => c * t + b[i] * (1 - t)); }
  const m = /^#([a-f\d]{3}|[a-f\d]{6})$/i.exec(value);
  if (!m) throw new Error(`Cor não suportada: ${value}`);
  const hex = m[1].length === 3 ? [...m[1]].map((x) => x + x).join('') : m[1];
  return [0, 2, 4].map((n) => parseInt(hex.slice(n, n + 2), 16) / 255);
}
function luminance(c) {
  const linear = c.map((x) => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
function contrast(a, b) { const x = luminance(rgb(a)), y = luminance(rgb(b)); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
const pairs = [
  ['primário', '--text-inverse', '--accent-primary', 4.5],
  ['texto', '--text-primary', '--bg-surface-1', 4.5],
  ['texto hover', '--text-primary', '--bg-surface-3', 4.5],
  ['texto ativo', '--text-primary', '--bg-surface-2', 4.5],
  ['erro', '--color-error', '--bg-surface-1', 4.5],
  ['sucesso', '--text-on-success', '--color-success', 4.5],
  ['link', '--accent-primary-text', '--bg-surface-1', 4.5],
  ['borda', '--text-secondary', '--bg-surface-1', 3],
  ['borda sobre superfície 2', '--text-secondary', '--bg-surface-2', 3],
  ['borda sobre superfície 3', '--text-secondary', '--bg-surface-3', 3],
  ['foco', '--accent-primary-text', '--bg-surface-1', 3],
  ['foco sobre superfície 2', '--accent-primary-text', '--bg-surface-2', 3],
  ['foco sobre superfície 3', '--accent-primary-text', '--bg-surface-3', 3],
];
let failures = 0;
for (const [theme, vars] of Object.entries(themes)) for (const [label, foreground, background, min] of pairs) {
  const a = resolve(foreground, vars), b = resolve(background, vars), ratio = contrast(a, b);
  console.log(`${theme} | ${label} | ${foreground} / ${background} | ${ratio.toFixed(2)}:1 (mín. ${min}:1)`);
  if (ratio < min) failures++;
}
if (failures) { console.error(`Contrastes reprovados: ${failures}`); process.exitCode = 1; }
