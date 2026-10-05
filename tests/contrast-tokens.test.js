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
const { extractBlock, parseDeclarations, failedChecks } = require('../scripts/build-brand-bridges');
const { ratio, contrastRatio, flatten, AA_NORMAL, AA_LARGE } = require('../scripts/lib/contrast');

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

/**
 * UNROUNDED contrast of a possibly translucent color as painted over an opaque
 * surface. Never compare a rounded ratio with a threshold: #139980 on #E8ECF0
 * is 2.99999:1, rounds to 3.00 and would pass a 3:1 gate.
 */
function paintedRatio(value, surfaceHex) {
  const { hex, alpha } = parseColor(value);
  const painted = alpha >= 1 ? hex : flatten(hex, surfaceHex, alpha);
  return contrastRatio(painted, surfaceHex);
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
    .map(({ s, r }) => `${label}: ${color} sobre ${s} = ${r.toFixed(5)}:1 (< ${min}:1)`);
}

describe('Limiar sem arredondamento', () => {
  // Mutacao que o Revisor encontrou na #82: arredondada da 3.00 e passava.
  test('#139980 reprova o anel de 3:1 sobre surface-3 claro (2.99999:1)', () => {
    expect(ratio('#139980', '#E8ECF0')).toBe(3); // o arredondamento esconderia a falha
    expect(failures('#139980', DS_SURFACES.light, AA_LARGE, 'mutacao')).toEqual([
      'mutacao: #139980 sobre #E8ECF0 = 2.99999:1 (< 3:1)',
    ]);
  });

  test('o gate do build das pontes tambem reprova #139980', () => {
    const check = {
      label: 'anel de foco sobre #E8ECF0',
      fg: '#139980',
      bg: '#E8ECF0',
      ratio: ratio('#139980', '#E8ECF0'), // 3 no relatorio
      required: AA_LARGE,
    };
    expect(failedChecks([check], 'mutacao/light')).toHaveLength(1);
    expect(failedChecks([{ ...check, fg: '#1D4ED8' }], 'ok/light')).toEqual([]);
  });
});

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

  /**
   * Superficies escuras de uma marca: as do DS mais as que a propria marca
   * declara no :root (--bg, --surface-N). Electia e Xscore tem surface-3/4
   * mais claras que qualquer superficie do DS.
   */
  function brandDarkSurfaces(root) {
    const own = Object.entries(root)
      .filter(([t, v]) => /^--(bg|surface-\d+)$/.test(t) && /^#[0-9a-fA-F]{3,6}$/.test(v))
      .map(([, v]) => v.toUpperCase());
    return [...new Set([...DS_SURFACES.dark.map((v) => v.toUpperCase()), ...own])];
  }

  /**
   * PENDENCIAS CONHECIDAS — decisao do Marcos, nao do implementador.
   * #848D97 passa no fundo e nas surfaces 1-2 destas marcas, mas reprova nas
   * surfaces 3 (#232B3B, linhas alternadas) e 4 (#2A3444, = --border):
   * 4.21:1 e 3.73:1. Sair desta lista exige escolher outra cor para o muted
   * da marca ou restringir o uso dele nessas superficies. Cada entrada e
   * conferida abaixo: se deixar de reprovar, o teste pede para remove-la.
   */
  const KNOWN_MUTED_GAPS = [
    'electia #232B3B', // surface-3
    'electia #2A3444', // surface-4
    'xscore #232B3B', // surface-3 (#848D97 vem da #76)
    'xscore #2A3444', // surface-4
  ];

  const brandMuted = BRANDS.map(({ id }) => {
    const root = parseDeclarations(extractBlock(read('brands', id, 'tokens', 'tokens.css'), ':root'));
    return { id, muted: root['--text-muted'], surfaces: brandDarkSurfaces(root) };
  }).filter((b) => b.muted);

  const mutedGaps = brandMuted.flatMap(({ id, muted, surfaces }) =>
    surfaces.filter((s) => paintedRatio(muted, s) < AA_NORMAL).map((s) => `${id} ${s}`)
  );

  test('marcas que redeclaram --text-muted no escuro passam no DS e nas proprias superficies', () => {
    expect(mutedGaps.filter((g) => !KNOWN_MUTED_GAPS.includes(g))).toEqual([]);
  });

  test('a lista de pendencias conhecidas continua verdadeira (nenhuma entrada obsoleta)', () => {
    expect(KNOWN_MUTED_GAPS.filter((g) => !mutedGaps.includes(g))).toEqual([]);
  });

  test.todo(
    'Electia e Xscore: --text-muted escuro em AA nas surfaces 3/4 da marca (#232B3B 4.21:1, #2A3444 3.73:1) — aguarda decisao do Marcos'
  );
});
