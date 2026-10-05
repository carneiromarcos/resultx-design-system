/**
 * Contrast Tests — DS tokens and brand bridges
 *
 * Measures, from the CSS sources, two pairs that affect every product:
 *
 * 1. --focus-ring-color against every surface of its theme (WCAG 1.4.11,
 *    non-text contrast, >= 3:1). A translucent ring is composited over the
 *    surface first: rgba(29, 78, 216, 0.5) on white is what the eye sees, not
 *    #1D4ED8. Covered in tokens/tokens.css (four scopes) and in every
 *    brands/<id>/tokens/ds-bridge.css (four scopes).
 * 2. --text-muted in the dark theme against every DS dark surface
 *    (WCAG 1.4.3, >= 4.5:1), kept below --text-secondary so the hierarchy
 *    survives. Also checked where a brand's tokens.css redeclares it in its
 *    dark scope (:root), because that file is exported and loads after the DS.
 */

const fs = require('fs');
const path = require('path');

const { BRANDS } = require('../scripts/brand-bridges.config');
const { extractBlock, parseDeclarations } = require('../scripts/build-brand-bridges');
const { ratio, flatten, AA_NORMAL, AA_LARGE } = require('../scripts/lib/contrast');

const ROOT = path.resolve(__dirname, '..');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');

const SURFACE_TOKENS = ['--bg-base', '--bg-surface-1', '--bg-surface-2', '--bg-surface-3'];

/** The four theme scopes the DS (and every bridge) declares. */
function themeScopes(css) {
  const media = (scheme) => {
    const block = extractBlock(css, `@media (prefers-color-scheme: ${scheme})`);
    return block && extractBlock(block, ':root:not([data-theme])');
  };
  return [
    { scope: '[data-theme="dark"]', theme: 'dark', decls: parseDeclarations(extractBlock(css, '[data-theme="dark"]')) },
    { scope: '[data-theme="light"]', theme: 'light', decls: parseDeclarations(extractBlock(css, '[data-theme="light"]')) },
    { scope: '@media dark', theme: 'dark', decls: parseDeclarations(media('dark')) },
    { scope: '@media light', theme: 'light', decls: parseDeclarations(media('light')) },
  ];
}

/** `#abc` | `#aabbcc` | `rgba(r, g, b, a)` -> `{ hex, alpha }` */
function parseColor(value) {
  const v = String(value).trim();
  if (/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(v)) return { hex: v, alpha: 1 };
  const m = v.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (!m) throw new Error(`Cor nao suportada pelo teste de contraste: "${value}"`);
  const hex = `#${[m[1], m[2], m[3]].map((c) => Number(c).toString(16).padStart(2, '0')).join('')}`;
  return { hex, alpha: m[4] === undefined ? 1 : Number(m[4]) };
}

/** Contrast of a possibly translucent color as painted over an opaque surface. */
function paintedRatio(value, surfaceHex) {
  const { hex, alpha } = parseColor(value);
  const painted = alpha >= 1 ? hex : flatten(hex, surfaceHex, alpha);
  return ratio(painted, surfaceHex);
}

const dsCss = read('tokens', 'tokens.css');
const dsScopes = themeScopes(dsCss);

/** DS surfaces per theme, read from the DS itself (not copied). */
const DS_SURFACES = {
  dark: SURFACE_TOKENS.map((t) => dsScopes[0].decls[t]),
  light: SURFACE_TOKENS.map((t) => dsScopes[1].decls[t]),
};

/** Every failing pair as a readable string, so the diff names the culprit. */
function failures(color, surfaces, min, label) {
  return surfaces
    .map((s) => ({ s, r: paintedRatio(color, s) }))
    .filter(({ r }) => r < min)
    .map(({ s, r }) => `${label}: ${color} sobre ${s} = ${r}:1 (< ${min}:1)`);
}

describe('Superficies do DS', () => {
  test('os quatro escopos declaram as quatro superficies como hex solido', () => {
    for (const { scope, decls } of dsScopes) {
      for (const t of SURFACE_TOKENS) {
        expect(`${scope} ${t}: ${parseColor(decls[t]).alpha}`).toBe(`${scope} ${t}: 1`);
      }
    }
  });
});

describe('Anel de foco — WCAG 1.4.11 (>= 3:1 contra toda superficie do tema)', () => {
  test('DS: --focus-ring-color nos quatro escopos de tokens.css', () => {
    const found = dsScopes.flatMap(({ scope, theme, decls }) =>
      failures(decls['--focus-ring-color'], DS_SURFACES[theme], AA_LARGE, `DS ${scope}`)
    );
    expect(found).toEqual([]);
  });

  test.each(BRANDS.map((b) => b.id))('ponte %s: --focus-ring-color nos quatro escopos', (id) => {
    const scopes = themeScopes(read('brands', id, 'tokens', 'ds-bridge.css'));
    const found = scopes.flatMap(({ scope, theme, decls }) => {
      expect(decls['--focus-ring-color']).toBeDefined();
      return failures(decls['--focus-ring-color'], DS_SURFACES[theme], AA_LARGE, `${id} ${scope}`);
    });
    expect(found).toEqual([]);
  });
});

describe('--text-muted do tema escuro — WCAG 1.4.3 (>= 4.5:1)', () => {
  const darkScopes = dsScopes.filter((s) => s.theme === 'dark');

  test('DS: alcanca AA contra o fundo e todas as superficies escuras', () => {
    const found = darkScopes.flatMap(({ scope, decls }) =>
      failures(decls['--text-muted'], DS_SURFACES.dark, AA_NORMAL, `DS ${scope}`)
    );
    expect(found).toEqual([]);
  });

  test('DS: os dois escopos escuros usam o mesmo valor', () => {
    expect(darkScopes[1].decls['--text-muted']).toBe(darkScopes[0].decls['--text-muted']);
  });

  test('DS: muted continua abaixo de secondary em toda superficie (hierarquia)', () => {
    for (const { scope, decls } of darkScopes) {
      for (const s of DS_SURFACES.dark) {
        const muted = paintedRatio(decls['--text-muted'], s);
        const secondary = paintedRatio(decls['--text-secondary'], s);
        expect(`${scope} sobre ${s}: ${muted < secondary}`).toBe(`${scope} sobre ${s}: true`);
      }
    }
  });

  test('marcas que redeclaram --text-muted no escopo escuro nao reprovam', () => {
    // O :root de brands/<id>/tokens/tokens.css e o tema escuro da marca e e
    // exportado (./brands/*/tokens). Xscore foi corrigido na #76 (#848D97).
    const found = BRANDS.flatMap(({ id }) => {
      const root = parseDeclarations(extractBlock(read('brands', id, 'tokens', 'tokens.css'), ':root'));
      const muted = root['--text-muted'];
      return muted ? failures(muted, DS_SURFACES.dark, AA_NORMAL, `marca ${id}`) : [];
    });
    expect(found).toEqual([]);
  });
});
