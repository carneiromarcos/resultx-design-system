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
 * 2. --text-muted, dark AND light, against every text surface (WCAG 1.4.3,
 *    >= 4.5:1, unrounded), kept strictly below --text-secondary on each one
 *    so the hierarchy survives. Covered in the four DS scopes and wherever a
 *    brand's tokens.css redeclares it (:root = dark, [data-theme="light"]),
 *    against the DS surfaces plus every brand surface IN EFFECT in that theme
 *    (--bg, --surface-N, inherited from :root included). A gate also requires
 *    each brand's light theme to declare every surface it uses.
 *    A brand surface equal to that scope's --border (surface-4 in Electia and
 *    Xscore) is a border tone, not a text surface: --text-secondary also fails
 *    there in the dark (4.08:1). Text on it uses --text-primary.
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

describe('--text-muted — WCAG 1.4.3 (>= 4.5:1) em toda superficie de texto, claro e escuro', () => {
  const up = (v) => String(v).trim().toUpperCase();
  const isHex = (v) => /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(String(v).trim());

  /** Tokens de superficie que uma marca declara por conta propria. */
  const OWN_SURFACE = /^--(bg|surface-\d+)$/;

  /**
   * Uma linha por escopo onde --text-muted vale: os quatro do DS e, em cada
   * marca que o redeclara, :root (escuro) e [data-theme="light"] (claro).
   * Superficies = as do DS no tema + as que a marca declara NAQUELE bloco,
   * menos as que sao o proprio --border do escopo (tom de borda, nao fundo de
   * texto — ver `excluded`).
   */
  const dsRows = dsScopes.map(({ scope, theme, decls }) => ({
    label: `DS ${scope}`,
    theme,
    muted: decls['--text-muted'],
    secondary: decls['--text-secondary'],
    surfaces: DS_SURFACES[theme].map(up),
    excluded: [],
  }));

  const brandFiles = BRANDS.map(({ id }) => {
    const css = read('brands', id, 'tokens', 'tokens.css');
    return {
      id,
      root: parseDeclarations(extractBlock(css, ':root')),
      light: parseDeclarations(extractBlock(css, '[data-theme="light"]')),
    };
  });

  const brandRows = brandFiles.flatMap(({ id, root, light }) =>
    [
      { theme: 'dark', block: ':root', own: root, resolved: root },
      { theme: 'light', block: '[data-theme="light"]', own: light, resolved: { ...root, ...light } },
    ]
      .filter(({ own }) => own['--text-muted'] !== undefined)
      .map(({ theme, block, own, resolved }) => {
        const border = resolved['--border'] && up(resolved['--border']);
        // Cascata EFETIVA: o claro herda do :root tudo o que nao redeclara, e o
        // que herda tambem e pintado. Enumerar so `own` deixava escapar as
        // superficies escuras que o claro da Electia herdava (2,45 / 2,17:1).
        const ownSurfaces = Object.entries(resolved).filter(([t, v]) => OWN_SURFACE.test(t) && isHex(v));
        const textSurfaces = ownSurfaces.filter(([, v]) => up(v) !== border).map(([, v]) => up(v));
        const dsSecondary = dsRows.find((r) => r.theme === theme).secondary;
        return {
          label: `${id} ${block}`,
          theme,
          muted: own['--text-muted'],
          secondary: resolved['--text-secondary'] ?? dsSecondary,
          surfaces: [...new Set([...DS_SURFACES[theme].map(up), ...textSurfaces])],
          excluded: ownSurfaces.filter(([, v]) => up(v) === border).map(([t, v]) => `${id} ${theme} ${t} ${up(v)}`),
        };
      })
  );

  const rows = [...dsRows, ...brandRows];

  /**
   * HERANCA CRUZADA — o tema claro de uma marca herda do :root toda superficie
   * que nao redeclara. Superficie escura vigente no tema claro e bug (foi o
   * caso da surface-3/4 da Electia ate 05/10/2026). Cada --bg / --surface-N
   * vigente num tema precisa ser declarada no proprio tema, salvo as excecoes
   * abaixo, conferidas uma a uma (entrada obsoleta tambem reprova).
   *
   * PdV: o bloco claro so troca --gold-ink; fundo e superficies seguem navy
   * nos dois temas. Pendencia registrada, nao decisao deste teste.
   */
  const INHERITED_SURFACE_EXCEPTIONS = [
    'pdv light --bg',
    'pdv light --surface-1',
    'pdv light --surface-2',
    'pdv light --surface-3',
    'pdv light --surface-4',
  ];

  const inheritedSurfaces = brandFiles.flatMap(({ id, root, light }) =>
    Object.keys(root)
      .filter((t) => OWN_SURFACE.test(t) && light[t] === undefined)
      .map((t) => `${id} light ${t}`)
  );

  test('gate: toda superficie vigente no tema claro de cada marca e declarada no proprio tema', () => {
    expect(inheritedSurfaces.filter((g) => !INHERITED_SURFACE_EXCEPTIONS.includes(g))).toEqual([]);
  });

  test('gate: as excecoes de heranca continuam verdadeiras (nenhuma entrada obsoleta)', () => {
    expect(INHERITED_SURFACE_EXCEPTIONS.filter((g) => !inheritedSurfaces.includes(g))).toEqual([]);
  });

  test('cobre os quatro escopos do DS e Electia/Xscore nos dois temas', () => {
    expect(rows.map((r) => r.label)).toEqual(
      expect.arrayContaining([
        'electia :root',
        'electia [data-theme="light"]',
        'xscore :root',
        'xscore [data-theme="light"]',
      ])
    );
    expect(rows).toHaveLength(dsScopes.length + brandRows.length);
  });

  test('alcanca AA (>= 4.5:1, sem arredondar) em toda superficie de texto de cada escopo', () => {
    const found = rows.flatMap(({ label, muted, surfaces }) => failures(muted, surfaces, AA_NORMAL, label));
    expect(found).toEqual([]);
  });

  test('continua estritamente abaixo de --text-secondary em toda superficie (hierarquia)', () => {
    const inverted = rows.flatMap(({ label, muted, secondary, surfaces }) =>
      surfaces
        .filter((s) => !(paintedRatio(muted, s) < paintedRatio(secondary, s)))
        .map((s) => `${label}: muted ${muted} nao fica abaixo de secondary ${secondary} sobre ${s}`)
    );
    expect(inverted).toEqual([]);
  });

  test('DS: os dois escopos de cada tema usam o mesmo valor', () => {
    for (const theme of ['dark', 'light']) {
      const values = dsRows.filter((r) => r.theme === theme).map((r) => r.muted);
      expect(new Set(values).size).toBe(1);
    }
  });

  test('uma linguagem so: a marca que redeclara usa o mesmo valor do DS no tema', () => {
    const drift = brandRows
      .filter((r) => up(r.muted) !== up(dsRows.find((d) => d.theme === r.theme).muted))
      .map((r) => `${r.label}: ${r.muted}`);
    expect(drift).toEqual([]);
  });

  test('a marca que redeclara no :root redeclara tambem no claro (senao o muted escuro vaza para o tema claro)', () => {
    const leaking = brandFiles
      .filter(({ root, light }) => root['--text-muted'] !== undefined && light['--text-muted'] === undefined)
      .map(({ id }) => id);
    expect(leaking).toEqual([]);
  });

  /**
   * Superficie = --border nao e fundo de texto. Hoje sao as surface-4 de
   * Electia e Xscore, nos dois temas. Lista explicita para que um
   * novo caso apareca no diff em vez de sumir da cobertura em silencio.
   */
  test('so o tom de borda fica fora da cobertura, e e exatamente a surface-4', () => {
    expect(brandRows.flatMap((r) => r.excluded)).toEqual([
      'electia dark --surface-4 #2A3444',
      'electia light --surface-4 #D1D9E0',
      'xscore dark --surface-4 #2A3444',
      'xscore light --surface-4 #D1D9E0',
    ]);
  });

  test('o motivo da exclusao segue valido: no escuro nem --text-secondary passa AA no tom de borda', () => {
    const secondaryDark = dsRows.find((r) => r.theme === 'dark').secondary;
    expect(paintedRatio(secondaryDark, '#2A3444')).toBeLessThan(AA_NORMAL);
  });

  test.each(BRANDS.map((b) => b.id))('ponte %s nao redeclara --text-muted nem --text-secondary (herda do DS)', (id) => {
    const scopes = themeScopes(read('brands', id, 'tokens', 'ds-bridge.css'));
    const redeclared = scopes
      .filter(({ decls }) => decls['--text-muted'] !== undefined || decls['--text-secondary'] !== undefined)
      .map(({ scope }) => scope);
    expect(redeclared).toEqual([]);
  });
});
