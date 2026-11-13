'use strict';

/**
 * Marca ResultX (v2.0, 09/10/2026): tema grafite, Sora/Inter, logos e vitrine.
 * Guarda tres coisas que ja quebraram em outras marcas: fonte DTCG e
 * tokens.css divergindo, arquivo de marca prometido e ausente, e caminho
 * relativo do viewer apontando para fora do lugar.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'brands', 'resultx');
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf8');
const css = read('brands', 'resultx', 'tokens', 'tokens.css');
const source = JSON.parse(read('tokens', 'tokens.json'));
const resolve = (value) => {
  if (typeof value !== 'string' || !/^\{[^{}]+\}$/.test(value)) return value;
  const token = value.slice(1, -1).split('.').reduce((node, key) => node[key], source);
  return resolve(token.$value);
};
const dtcg = (name) => {
  const value = resolve(source.brand.resultx.base[name].$value);
  if (typeof value === 'object' && value.colorSpace === 'srgb') return value.hex;
  if (typeof value === 'object' && value.unit) return value.value + value.unit;
  return value;
};

/** `--rx-x: value;` do primeiro bloco :root. */
const rootBlock = css.slice(css.indexOf('\n:root {'), css.indexOf('\n[data-theme="light"] {'));
const decl = (name) => {
  const m = new RegExp(`${name}:\\s*([^;]+);`).exec(rootBlock);
  return m ? m[1].trim() : undefined;
};
const norm = (v) => String(v).toLowerCase().replace(/\s+/g, '');

describe('ResultX — tokens: tema grafite e fontes', () => {
  test('o chao padrao e o grafite do ecossistema', () => {
    expect(decl('--rx-bg')).toBe('#0B0E14');
    expect(decl('--rx-surface-1')).toBe('#111620');
  });

  test('fontes: Sora, Inter e JetBrains Mono (sem Poppins/Roboto)', () => {
    expect(decl('--rx-font-heading')).toMatch(/^'Sora'/);
    expect(decl('--rx-font-body')).toMatch(/^'Inter'/);
    expect(decl('--rx-font-mono')).toMatch(/^'JetBrains Mono'/);
    expect(css).not.toMatch(/Poppins|Roboto/);
  });

  test('sem navy: nenhum token do tema padrao usa #1B2A4A', () => {
    expect(rootBlock.toLowerCase()).not.toContain('#1b2a4a');
  });

  test.each([
    'rx-bg', 'rx-surface-1', 'rx-surface-2', 'rx-surface-3', 'rx-border',
    'rx-text', 'rx-text-secondary', 'rx-text-muted', 'rx-gold', 'rx-purple',
    'rx-success', 'rx-reveal-duration', 'rx-lift-distance', 'rx-header-bar-min',
  ])('fonte DTCG e tokens.css concordam em --%s', (name) => {
    expect(norm(decl('--' + name))).toBe(norm(dtcg(name)));
  });
});

describe('ResultX — assets de logo existem', () => {
  const files = [
    'resultx-logo-on-dark.svg',
    'resultx-logo-on-light.svg',
    'resultx-logo-on-dark-1200.png',
    'resultx-logo-on-light-1200.png',
    'resultx-favicon.svg',
    'resultx-icon-16.png',
    'resultx-icon-32.png',
    'resultx-icon-180.png',
    'resultx-icon-512.png',
  ];
  test.each(files)('%s', (f) => {
    expect(fs.statSync(path.join(BRAND, 'assets', 'logo', f)).size).toBeGreaterThan(300);
  });

  test('o favicon nao depende de fonte instalada', () => {
    expect(read('brands', 'resultx', 'assets', 'logo', 'resultx-favicon.svg')).not.toMatch(/<text/);
  });
});

describe('ResultX — vitrine e viewer', () => {
  const preview = read('brands', 'resultx', 'previews', 'brand-system.html');
  const viewer = read('docs', 'viewer.html');

  /** Todo href/src local de um HTML, resolvido a partir da pasta dele. */
  const missing = (html, fromDir) =>
    [...html.matchAll(/(?:href|src)="([^"#]+)"/g)]
      .map((m) => m[1])
      .filter((u) => !/^(https?:|data:|mailto:|javascript:)/.test(u))
      .filter((u) => !fs.existsSync(path.resolve(fromDir, u.split('?')[0])));

  test('todo caminho local da vitrine existe', () => {
    expect(missing(preview, path.join(BRAND, 'previews'))).toEqual([]);
  });

  test('todo caminho local do viewer existe a partir de docs/', () => {
    expect(missing(viewer, path.join(ROOT, 'docs'))).toEqual([]);
  });

  test('o viewer lista a vitrine da ResultX', () => {
    expect(viewer).toContain('../brands/resultx/previews/brand-system.html');
  });

  test('a vitrine nao usa a orb de IA', () => {
    expect(preview).not.toMatch(/brand-orb/);
  });
});

describe('ResultX — contraste AA (>= 4,5:1) nos dois temas', () => {
  const { contrastRatio } = require('../scripts/lib/contrast');
  const AA = 4.5;

  /** Declaracoes `--x: #hex;` de um bloco, lidas do tokens.css (fonte dos valores). */
  const declsOf = (block) =>
    Object.fromEntries([...block.matchAll(/(--rx-[\w-]+):\s*(#[0-9a-fA-F]{3,6})\s*;/g)].map((m) => [m[1], m[2]]));
  const lightStart = css.indexOf('\n[data-theme="light"] {');
  const lightBlock = css.slice(lightStart, css.indexOf('\n}', lightStart));
  const dark = declsOf(rootBlock);
  const light = { ...dark, ...declsOf(lightBlock) };
  const bridge = read('brands', 'resultx', 'tokens', 'ds-bridge.css');
  const inkOnAccent = /--text-on-accent:\s*(#[0-9a-fA-F]{6})/.exec(bridge)[1];

  const themes = [
    ['escuro', dark],
    ['claro', light],
  ];
  const surfaces = (t) => ['--rx-bg', '--rx-surface-1', '--rx-surface-2', '--rx-surface-3'].map((k) => [k, t[k]]);

  test.each(themes)('tema %s: texto, secundario e muted sobre todas as superficies', (_, t) => {
    const falhas = [];
    for (const fg of ['--rx-text', '--rx-text-secondary', '--rx-text-muted']) {
      for (const [name, bg] of surfaces(t)) {
        const r = contrastRatio(t[fg], bg);
        if (r < AA) falhas.push(`${fg} ${t[fg]} sobre ${name} ${bg} = ${r.toFixed(2)}`);
      }
    }
    expect(falhas).toEqual([]);
  });

  test.each(themes)('tema %s: dourado como texto (--rx-gold-ink) sobre o fundo e as superficies', (_, t) => {
    const falhas = surfaces(t)
      .map(([name, bg]) => [name, contrastRatio(t['--rx-gold-ink'], bg)])
      .filter(([, r]) => r < AA)
      .map(([name, r]) => `gold-ink ${t['--rx-gold-ink']} sobre ${name} = ${r.toFixed(2)}`);
    expect(falhas).toEqual([]);
  });

  test('tinta do botao (--text-on-accent) sobre o preenchimento dourado', () => {
    expect(inkOnAccent.toUpperCase()).toBe('#0B0E14');
    expect(contrastRatio(inkOnAccent, dark['--rx-gold'])).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(inkOnAccent, dark['--rx-gold-light'])).toBeGreaterThanOrEqual(AA);
  });
});
