/**
 * Lote P (05/10/2026) — convenções comuns aos componentes promovidos do
 * protótipo de landing do Electia (brands/electia/previews/prototypes/
 * electia-landing-talio-2026-10-05.html, aprovado na #80).
 *
 * Cada arquivo novo de components/ precisa:
 *   1. ser importado pelo agregador (e por isso chegar ao bundle);
 *   2. usar só tokens — nada de hex, rgb() ou hsl() cravado;
 *   3. animar só transform e opacity, e ter um bloco de reduced-motion;
 *   4. caber em 400 linhas.
 * Os scripts de comportamento vivem em dist/ (como sidebar-overlay.js), são
 * alcançáveis pelo mapa de exports e não persistem nada.
 */

const { css, read, exists, texto, keyframes, propsDoKeyframe, regras, valor } = require('./lib/css');

const PKG = JSON.parse(read('package.json'));

const ARQUIVOS = [
  'header-float.css',
  'menu-drawer.css',
  'btn-sheen.css',
  'cta-panel.css',
  'cta-dock.css',
  'stage-chip.css',
];

const SCRIPTS = [
  ['header-float.js', './header-float'],
  ['menu-drawer.js', './menu-drawer'],
  ['cta-dock.js', './cta-dock'],
];

describe('Lote P — entrega', () => {
  const agregador = read('components', 'components.css');

  test.each(ARQUIVOS)('%s existe e é importado pelo agregador com url()', (arquivo) => {
    expect(exists('components', arquivo)).toBe(true);
    expect(agregador).toContain(`@import url('./${arquivo}')`);
  });

  test.each(ARQUIVOS)('%s é publicado pelo campo "files"', (arquivo) => {
    expect(PKG.files).toContain(`components/${arquivo}`);
  });

  test.each([
    '.header-float',
    '.header-float-bar',
    '.menu-drawer',
    '.menu-drawer-scrim',
    '.btn-sheen',
    '.cta-panel',
    '.cta-dock',
    '.stage-chip',
    '.stage-chip-count',
  ])('%s chega ao bundle construído', (classe) => {
    expect(read('dist', 'components.min.css')).toContain(classe);
  });

  test.each(SCRIPTS)('dist/%s existe e está no mapa de exports', (arquivo, chave) => {
    expect(exists('dist', arquivo)).toBe(true);
    expect(PKG.exports[chave]).toBe(`./dist/${arquivo}`);
  });

  test.each(SCRIPTS)('dist/%s não persiste nada e não ouve scroll', (arquivo) => {
    const js = texto('dist', arquivo);
    expect(js).not.toMatch(/localStorage|sessionStorage/);
    expect(js).not.toMatch(/addEventListener\(\s*['"]scroll['"]/);
  });
});

describe.each(ARQUIVOS)('Lote P — convenções de %s', (arquivo) => {
  const fonte = css('components', arquivo);

  test('nenhuma cor cravada (hex, rgb, hsl)', () => {
    expect(fonte.length).toBeGreaterThan(0);
    expect(fonte).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(fonte).not.toMatch(/\b(rgba?|hsla?)\(/);
  });

  test('keyframes só mexem em transform e opacity', () => {
    for (const { nome, corpo } of keyframes(fonte)) {
      for (const prop of propsDoKeyframe(corpo)) {
        expect({ nome, prop }).toEqual({ nome, prop: expect.stringMatching(/^(transform|opacity)$/) });
      }
    }
  });

  test('nenhuma transição em propriedade de layout', () => {
    const transicoes = [...fonte.matchAll(/transition(?:-property)?\s*:\s*([^;]+);/g)].map((m) => m[1]);
    for (const t of transicoes) {
      expect(t).not.toMatch(/\b(all|width|height|top|left|right|bottom|margin|padding|inset)\b/);
    }
  });

  // Achado do Revisor na #83: opacity 0,8 / 0,65 no hover/active da marca
  // baixava o selo de 12 px a 3,15:1 sobre o vidro. Opacidade parcial em
  // elemento com texto muda o contraste medido; só pseudo-elementos
  // decorativos (sombra, reflexo) podem ficar translúcidos.
  test('nenhum elemento com texto fica translúcido em estado nenhum', () => {
    for (const { seletor, corpo, contexto } of regras(fonte)) {
      if (contexto.some((c) => /prefers-reduced-motion/.test(c))) continue;
      if (/::(before|after)\s*$/.test(seletor)) continue;
      const op = valor(corpo, 'opacity');
      if (op === null) continue;
      const n = Number(op);
      // 1 = opaco; 0 só como estado escondido, junto de visibility: hidden.
      const escondido = n === 0 && valor(corpo, 'visibility') === 'hidden';
      expect({ seletor, opacity: op, ok: n === 1 || escondido }).toEqual({
        seletor,
        opacity: op,
        ok: true,
      });
    }
  });

  test('tem bloco prefers-reduced-motion', () => {
    if (!/transition|animation/.test(fonte)) return;
    expect(fonte).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  });

  test('cabe em 400 linhas', () => {
    expect(read('components', arquivo).split('\n').length).toBeLessThanOrEqual(400);
  });
});

describe('Lote P — o protótipo da #80 consome o DS', () => {
  const PROTOTIPO = [
    'brands',
    'electia',
    'previews',
    'prototypes',
    'electia-landing-talio-2026-10-05.html',
  ];
  const html = read(...PROTOTIPO);
  const estilo = (/<style>([\s\S]*?)<\/style>/.exec(html) || ['', ''])[1];

  test('não sobra bloco CANDIDATO no CSS da página', () => {
    expect(html).not.toMatch(/CANDIDATO components\//);
  });

  test.each([
    '.header-float-bar {',
    '.menu-drawer {',
    '.btn-sheen::',
    '.cta-panel {',
    '.cta-dock {',
    '@keyframes btn-sheen-pass',
    '--ease-sheen:',
  ])('o protótipo não redefine %s', (trecho) => {
    expect(estilo).not.toContain(trecho);
  });

  test.each(['header-float.js', 'menu-drawer.js', 'cta-dock.js'])(
    'carrega dist/%s em vez de reimplementar o comportamento',
    (arquivo) => {
      expect(html).toContain(`dist/${arquivo}`);
    },
  );
});
