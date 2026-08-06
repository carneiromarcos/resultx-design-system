#!/usr/bin/env node
'use strict';

/**
 * ResultX Design System — brand bridge build
 *
 * Emits `brands/<id>/tokens/ds-bridge.css` for every brand declared in
 * scripts/brand-bridges.config.js.
 *
 * WHY THIS EXISTS
 * ---------------
 * tokens/tokens.css hardcodes one accent: teal #2DD4BF in dark, blue #1D4ED8
 * in light. A brand file next to it declares --purple / --gold and remaps
 * nothing, so a product importing both still renders teal. The bridge is the
 * missing translation layer: brand value in, DS semantic token out.
 *
 * It also fixes an accessibility bug that the single-accent assumption hides.
 * `--text-inverse` is the ink printed on top of `--accent-primary` (see
 * .btn-primary in components/components.css). The DS ships #0B0E14 in dark,
 * which is correct for teal (10.38:1) and illegal for Electia purple (2.55:1).
 * The ink is therefore not configured anywhere — it is MEASURED per brand, and
 * the build fails if no candidate reaches AA.
 *
 * The brand CSS files stay the single source of truth: this script only reads
 * values out of them. Re-run after editing any brands/<id>/tokens/tokens.css.
 *
 * Usage: npm run build:bridges
 */

const fs = require('fs');
const path = require('path');

const { BRANDS, INK_CANDIDATES, SURFACES } = require('./brand-bridges.config');
const { AA_NORMAL, ratio, pickInk, flatten, toRgbTriplet } = require('./lib/contrast');

const ROOT = path.resolve(__dirname, '..');

/** Alpha values copied from tokens/tokens.css so the bridge matches the DS. */
const ALPHA = {
  dark: { muted: 0.15, border: 0.2, sidebarActive: 0.15 },
  light: { muted: 0.12, border: 0.25, sidebarActive: null }, // light uses a solid fill
};

/** The sidebar stays dark in both themes — these are the DS sidebar backgrounds. */
const SIDEBAR_BG = { dark: '#080B12', light: '#0F1A2E' };

// ─────────────────────────────────────────────────────────────────────────────
// Reading brand tokens
// ─────────────────────────────────────────────────────────────────────────────

/** Extract the body of a top-level `selector { ... }` block, brace-balanced. */
function extractBlock(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`${escaped}\\s*\\{`, 'g').exec(css);
  if (!match) return null;
  let depth = 1;
  let pos = match.index + match[0].length;
  const start = pos;
  while (pos < css.length && depth > 0) {
    if (css[pos] === '{') depth += 1;
    if (css[pos] === '}') depth -= 1;
    pos += 1;
  }
  return css.slice(start, pos - 1);
}

/** `--purple: #6f32b1;` -> `{ '--purple': '#6f32b1' }` */
function parseDeclarations(block) {
  if (!block) return {};
  const out = {};
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/**
 * Resolve a brand token for a theme. The light scope inherits from :root, which
 * is what lets Electia redefine --purple-on-dark to #6f32b1 inside its light
 * block and have the bridge pick it up with no extra configuration.
 */
function makeResolver(brandId) {
  const file = path.join(ROOT, 'brands', brandId, 'tokens', 'tokens.css');
  if (!fs.existsSync(file)) {
    throw new Error(`Marca "${brandId}": arquivo de tokens nao encontrado em ${file}`);
  }
  const css = fs.readFileSync(file, 'utf-8');
  const root = parseDeclarations(extractBlock(css, ':root'));
  const light = parseDeclarations(extractBlock(css, '[data-theme="light"]'));

  return function resolve(token, theme) {
    if (token === null || token === undefined) return null;
    const value = theme === 'light' && light[token] !== undefined ? light[token] : root[token];
    if (value === undefined) {
      throw new Error(
        `Marca "${brandId}": o token ${token}, declarado em brand-bridges.config.js, ` +
          `nao existe em brands/${brandId}/tokens/tokens.css`
      );
    }
    if (!/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value)) {
      throw new Error(
        `Marca "${brandId}": o token ${token} vale "${value}" — a ponte so aceita hexadecimal solido, ` +
          `porque precisa medir contraste sobre ele`
      );
    }
    return value;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Resolving one theme into concrete DS token values
// ─────────────────────────────────────────────────────────────────────────────

function resolveTheme(brand, theme, resolve) {
  const roles = brand[theme];
  const accent = resolve(roles.accent, theme);
  const hover = resolve(roles.hover, theme);
  const secondary = resolve(roles.secondary, theme);
  const text = resolve(roles.text, theme);

  const ink = pickInk(accent, INK_CANDIDATES);
  const inkOnHover = pickInk(hover, INK_CANDIDATES);
  const surfaces = SURFACES[theme];
  const alpha = ALPHA[theme];

  // The active sidebar item: translucent accent over the sidebar background in
  // dark, a solid accent fill in light (the DS keeps the sidebar dark in both).
  const sidebarActiveBg =
    theme === 'dark' ? flatten(accent, SIDEBAR_BG.dark, alpha.sidebarActive) : accent;
  const sidebarTextActive = theme === 'dark' ? text || accent : ink.value;

  const checks = [
    {
      label: 'rotulo sobre o botao primario',
      fg: ink.value,
      bg: accent,
      ratio: ink.ratio,
      required: AA_NORMAL,
    },
    {
      label: 'rotulo sobre o botao em :hover',
      fg: ink.value,
      bg: hover,
      ratio: ratio(ink.value, hover),
      required: AA_NORMAL,
    },
    {
      label: 'item ativo do sidebar',
      fg: sidebarTextActive,
      bg: sidebarActiveBg,
      ratio: ratio(sidebarTextActive, sidebarActiveBg),
      required: AA_NORMAL,
    },
  ];

  if (text) {
    const mutedSurface = flatten(accent, surfaces.surface, alpha.muted);
    checks.push(
      {
        label: 'accent como texto sobre o fundo base',
        fg: text,
        bg: surfaces.base,
        ratio: ratio(text, surfaces.base),
        required: AA_NORMAL,
      },
      {
        label: 'accent como texto sobre o muted (tag, badge)',
        fg: text,
        bg: mutedSurface,
        ratio: ratio(text, mutedSurface),
        required: AA_NORMAL,
      }
    );
  }

  return { accent, hover, secondary, text, ink, inkOnHover, sidebarTextActive, checks };
}

// ─────────────────────────────────────────────────────────────────────────────
// Emitting CSS
// ─────────────────────────────────────────────────────────────────────────────

const rgba = (hex, alpha) => `rgba(${toRgbTriplet(hex)}, ${alpha})`;

function declarations(brand, theme, r, indent) {
  const pad = ' '.repeat(indent);
  const alpha = ALPHA[theme];
  const rgb = toRgbTriplet(r.accent);
  const lines = [];
  const push = (prop, value, note) =>
    lines.push(`${pad}${prop}: ${value};${note ? `   /* ${note} */` : ''}`);

  push('--accent-primary', r.accent, brand[theme].accent);
  push('--accent-primary-hover', r.hover, brand[theme].hover);
  push('--accent-primary-muted', rgba(r.accent, alpha.muted));
  if (r.secondary) push('--accent-secondary', r.secondary, brand[theme].secondary);

  lines.push('');
  push('--text-inverse', r.ink.value, `tinta medida sobre o accent: ${r.ink.ratio}:1`);
  if (r.text) {
    push(
      '--accent-primary-text',
      r.text,
      `${brand[theme].text} — ${ratio(r.text, SURFACES[theme].base)}:1 sobre o fundo`
    );
  } else {
    lines.push(
      `${pad}/* LACUNA DE MARCA: nenhuma variante do accent desta marca alcanca AA`,
      `${pad}   (4.5:1) como texto neste tema. Cai no texto neutro em vez de manter`,
      `${pad}   o accent do DS — que seria legivel, porem de outra marca (texto azul`,
      `${pad}   ao lado de botoes dourados). Perde-se a cor, nao a legibilidade.`,
      `${pad}   Some quando a marca ganhar uma tinta como --gold-ink do xscore.`,
      `${pad}   Ver docs/brand-bridge.md. */`
    );
    push('--accent-primary-text', 'var(--text-primary)');
  }

  lines.push('');
  push('--border-accent', rgba(r.accent, alpha.border));
  push('--focus-ring-color', rgba(r.accent, 0.5));

  lines.push('');
  push(
    '--sidebar-active-bg',
    theme === 'dark' ? rgba(r.accent, alpha.sidebarActive) : r.accent
  );
  push('--sidebar-text-active', r.sidebarTextActive);

  lines.push('');
  push('--shadow-glow', `0 0 20px rgba(${rgb}, 0.15)`);
  push('--shadow-glow-lg', `0 0 40px rgba(${rgb}, 0.2), 0 0 80px rgba(${rgb}, 0.08)`);

  lines.push('');
  push('--chart-gradient-start', rgba(r.accent, 0.25));
  push('--chart-gradient-end', rgba(r.accent, 0.02));
  push('--chart-line', r.text || r.accent);

  return lines.join('\n');
}

function emit(brand, dark, light) {
  const rule = (selector, theme, r) => `${selector} {\n${declarations(brand, theme, r, 2)}\n}`;
  const media = (scheme, theme, r) =>
    `@media (prefers-color-scheme: ${scheme}) {\n  :root:not([data-theme]) {\n` +
    `${declarations(brand, theme, r, 4)}\n  }\n}`;

  return `/* ============================================================================
   ${brand.label} — ponte para o ResultX Design System
   ARQUIVO GERADO por scripts/build-brand-bridges.js — nao editar a mao.
   Fonte dos valores: brands/${brand.id}/tokens/tokens.css
   Regenerar: npm run build:bridges

   O que faz
   ---------
   tokens/tokens.css entrega um accent so (teal no dark, azul no light). Esta
   ponte reescreve os tokens semanticos do DS com os valores desta marca, nos
   quatro escopos de tema que o DS usa — incluindo os dois blocos de
   prefers-color-scheme, sem os quais quem nao seta data-theme continua vendo
   teal.

   --text-inverse e a tinta impressa SOBRE o accent (.btn-primary). Nao foi
   escolhida: foi medida contra ${INK_CANDIDATES.join(' e ')}, e o build falha
   se nenhuma candidata alcancar 4.5:1.

   Como usar — importar DEPOIS dos tokens do DS:
     @import "resultx-design-system/tokens";
     @import "resultx-design-system/brands/${brand.id}/bridge";
   ============================================================================ */

/* Tokens independentes de tema. --text-on-accent carrega a mesma tinta que
   --text-inverse, porque os dois so aparecem sobre um preenchimento de accent. */
:root {
  --text-on-accent: ${dark.ink.value};${
    dark.secondary ? `\n  --accent-secondary-muted: ${rgba(dark.secondary, 0.12)};` : ''
  }
}

/* ---- Tema dark (padrao) ---- */
${rule('[data-theme="dark"]', 'dark', dark)}

/* ---- Tema light ---- */
${rule('[data-theme="light"]', 'light', light)}

/* ---- Auto-deteccao: sem data-theme, respeitar a preferencia do sistema ---- */
${media('dark', 'dark', dark)}

${media('light', 'light', light)}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────

function build({ write = true } = {}) {
  const failures = [];
  const gaps = [];
  const report = [];

  for (const brand of BRANDS) {
    const resolve = makeResolver(brand.id);
    const dark = resolveTheme(brand, 'dark', resolve);
    const light = resolveTheme(brand, 'light', resolve);

    for (const [theme, r] of [['dark', dark], ['light', light]]) {
      if (r.ink.value !== r.inkOnHover.value) {
        failures.push(
          `${brand.id}/${theme}: o accent (${r.accent}) e o hover (${r.hover}) pedem tintas ` +
            `diferentes (${r.ink.value} vs ${r.inkOnHover.value}), mas --text-inverse e um valor ` +
            `so. Escolher um hover mais proximo do accent em luminancia.`
        );
      }
      for (const c of r.checks) {
        if (c.ratio < c.required) {
          failures.push(
            `${brand.id}/${theme}: ${c.label} — ${c.fg} sobre ${c.bg} = ${c.ratio}:1, ` +
              `abaixo de ${c.required}:1`
          );
        }
      }
      if (!r.text) {
        gaps.push(`${brand.id}/${theme}: sem variante do accent aprovada em AA como texto`);
      }
      report.push({ brand: brand.id, theme, r });
    }

    if (write) {
      const outPath = path.join(ROOT, 'brands', brand.id, 'tokens', 'ds-bridge.css');
      fs.writeFileSync(outPath, emit(brand, dark, light), 'utf-8');
    }
  }

  return { failures, gaps, report };
}

function main() {
  const { failures, gaps, report } = build();

  console.log('\nPonte de marca — contraste medido (WCAG 2.2, AA = 4.5:1)\n');
  console.log(
    'marca'.padEnd(14) +
      'tema'.padEnd(7) +
      'accent'.padEnd(10) +
      'tinta'.padEnd(10) +
      'razao'.padEnd(8) +
      'accent como texto'
  );
  console.log('-'.repeat(80));
  for (const { brand, theme, r } of report) {
    console.log(
      brand.padEnd(14) +
        theme.padEnd(7) +
        r.accent.padEnd(10) +
        r.ink.value.padEnd(10) +
        `${r.ink.ratio}:1`.padEnd(8) +
        (r.text
          ? `${r.text} (${ratio(r.text, SURFACES[theme].base)}:1)`
          : 'LACUNA — cai no texto neutro')
    );
  }

  if (gaps.length > 0) {
    console.log('\nLacunas de marca (nao bloqueiam o build; pedem decisao de marca):');
    for (const g of gaps) console.log(`  - ${g}`);
  }

  if (failures.length > 0) {
    console.error('\nFALHA DE CONTRASTE:\n');
    for (const f of failures) console.error(`  - ${f}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nOK — ${BRANDS.length} pontes escritas em brands/<marca>/tokens/ds-bridge.css\n`);
}

if (require.main === module) {
  main();
}

module.exports = { build, makeResolver, resolveTheme, extractBlock, parseDeclarations, emit };
