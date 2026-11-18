'use strict';
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const { build } = require('./build-brand-bridges');
const { BRANDS, INK_CANDIDATES } = require('./brand-bridges.config');
const { contrastRatio, pickInk, AA_NORMAL } = require('./lib/contrast');
const ROOT = path.resolve(__dirname, '..');
const ratio = (fg, bg) => contrastRatio(fg, bg);
const fmt = n => `${n.toFixed(2)}:1`;
function declarations(file, selector) {
  const root = postcss.parse(fs.readFileSync(file, 'utf8'), { from: file });
  let values = {};
  root.walkRules(rule => {
    if (postcss.list.comma(rule.selector).includes(selector)) rule.walkDecls(d => { values[d.prop] = d.value; });
  });
  return values;
}
function evaluate(root = ROOT) {
  const results = [], failures = [];
  const measure = (label, fg, bg, min = AA_NORMAL) => {
    const value = ratio(fg, bg);
    results.push({ label, foreground: fg, background: bg, ratio: value, min });
    if (value < min) failures.push(`${label}: ${fmt(value)} abaixo de ${min}:1 (${fg} sobre ${bg})`);
    return value;
  };
  const coreFile = path.join(root, 'tokens/tokens.css');
  const themes = [
    ['dark', declarations(coreFile, '[data-theme="dark"]')],
    ['light', declarations(coreFile, '[data-theme="light"]')],
    ['premium-light', declarations(path.join(root, 'tokens/themes/premium-light.css'), '[data-theme="premium-light"]')],
    ['sober-dark', declarations(path.join(root, 'tokens/themes/sober-dark.css'), '[data-theme="sober-dark"]')],
    ['vibrant-dark', declarations(path.join(root, 'tokens/themes/vibrant-dark.css'), '[data-theme="vibrant-dark"]')],
  ];
  for (const [theme, vars] of themes) {
    for (const color of ['cyan', 'magenta', 'purple']) {
      measure(`${theme} decorative ${color}`, vars[`--ink-decorative-${color}`], vars[`--surface-decorative-${color}`]);
    }
    measure(`${theme} danger strong`, vars['--on-danger-strong'], vars['--danger-strong']);
  }
  const bridge = build({ write: false });
  for (const { brand, theme, r } of bridge.report) {
    const best = pickInk(r.accent, INK_CANDIDATES);
    if (r.ink.value !== best.value) failures.push(`${brand}/${theme}: tinta da marca ${r.ink.value} não é a de maior contraste (${best.value})`);
    measure(`${brand}/${theme} texto sobre accent`, r.ink.value, r.accent);
    measure(`${brand}/${theme} texto sobre hover`, r.ink.value, r.hover);
    for (const c of r.checks.filter(item => item.label.startsWith('accent como texto'))) {
      measure(`${brand}/${theme} ${c.label}`, c.fg, c.bg);
    }
  }
  for (const sample of ['#E85D04', '#EF4444']) {
    const white = ratio('#FFFFFF', sample), chosen = pickInk(sample, INK_CANDIDATES);
    if (white >= 3 && white < 4.5 && chosen.value === '#FFFFFF') failures.push(`seleção de tinta aceitou branco ${fmt(white)} em ${sample}`);
  }
  const pdvFile = path.join(root, 'brands/pdv/tokens/tokens.css');
  const pdv = declarations(pdvFile, ':root');
  const pdvLight = { ...pdv, ...declarations(pdvFile, '[data-theme="light"]') };
  for (const [theme, vars] of [['base', pdv], ['light', pdvLight]]) {
    measure(`PdV ${theme} perigo sobre surface-1`, vars['--color-error-text'], vars['--surface-1']);
    measure(`PdV ${theme} perigo sobre surface-2`, vars['--color-error-text'], vars['--surface-2']);
    measure(`PdV ${theme} indisponível sobre surface-2`, vars['--text-unavailable'], vars['--surface-2']);
    measure(`PdV ${theme} indisponível sobre surface-3`, vars['--text-unavailable'], vars['--surface-3']);
    if (vars['--text-unavailable'] === vars['--gray-100']) failures.push(`PdV ${theme}: texto indisponível não difere visualmente do texto normal`);
  }
  return { results, failures };
}
function main() {
  const { results, failures } = evaluate();
  console.log('\nC-cor-1 — contrastes medidos no build (WCAG 2.x; texto ≥ 4,5:1)\n');
  for (const r of results) console.log(`${r.label.padEnd(46)} ${r.foreground} sobre ${r.background} = ${fmt(r.ratio)}`);
  if (failures.length) {
    console.error('\nFALHA C-cor-1:\n' + failures.map(f => `- ${f}`).join('\n'));
    process.exitCode = 1;
  } else console.log(`\nPASS: ${results.length} pares medidos; nenhuma falha.`);
}
if (require.main === module) main();
module.exports = { evaluate };
