/**
 * Brand Bridge Tests
 *
 * Guards the contract that makes brands/<id>/tokens/ds-bridge.css trustworthy:
 *
 * 1. Every brand declared in the config has a bridge committed to the repo
 * 2. The committed bridge matches what the generator produces right now, so a
 *    change to a brand's tokens.css cannot silently drift from the bridge
 * 3. Every ink pairing clears WCAG AA — this is the bug the bridge exists to
 *    fix, so it must fail loudly rather than regress
 * 4. All four theme scopes are overridden, including the two
 *    prefers-color-scheme blocks the DS uses for auto-detection
 * 5. No DS teal survives inside a bridge
 * 6. Components no longer paint text with --accent-primary, which is a fill
 */

const fs = require('fs');
const path = require('path');

const { BRANDS } = require('../scripts/brand-bridges.config');
const { build, emit, makeResolver, resolveTheme } = require('../scripts/build-brand-bridges');
const { ratio, AA_NORMAL } = require('../scripts/lib/contrast');

const ROOT = path.resolve(__dirname, '..');
const BRAND_IDS = BRANDS.map((b) => b.id);
const bridgePath = (id) => path.join(ROOT, 'brands', id, 'tokens', 'ds-bridge.css');
const readBridge = (id) => fs.readFileSync(bridgePath(id), 'utf-8');

/** Matches a declaration, not a mention inside a comment. */
const declarationsOf = (css, token) =>
  css.match(new RegExp(`${token}:\\s*(#[0-9a-fA-F]{3,8}|var\\(|rgba?\\()`, 'g')) || [];

const DS_TEAL = ['#2DD4BF', '#5EEAD4', '45, 212, 191'];

describe('Brand bridge — arquivos gerados', () => {
  test.each(BRAND_IDS)('%s tem ds-bridge.css commitado', (id) => {
    expect(fs.existsSync(bridgePath(id))).toBe(true);
  });

  test.each(BRAND_IDS)(
    '%s: o arquivo commitado corresponde ao gerador (rode npm run build:bridges)',
    (id) => {
      const brand = BRANDS.find((b) => b.id === id);
      const resolve = makeResolver(id);
      const expected = emit(
        brand,
        resolveTheme(brand, 'dark', resolve),
        resolveTheme(brand, 'light', resolve)
      );
      expect(readBridge(id)).toBe(expected);
    }
  );
});

describe('Brand bridge — contraste WCAG AA', () => {
  test('nenhuma marca falha em nenhuma verificacao de contraste', () => {
    const { failures } = build({ write: false });
    expect(failures).toEqual([]);
  });

  test('a tinta do accent e a do hover sao a mesma cor em toda marca', () => {
    // --text-inverse e um valor so. Se o hover exigisse outra tinta, o rotulo
    // do botao ficaria ilegivel exatamente no estado de interacao.
    const { report } = build({ write: false });
    for (const { brand, theme, r } of report) {
      expect(`${brand}/${theme}: ${r.ink.value}`).toBe(`${brand}/${theme}: ${r.inkOnHover.value}`);
    }
  });

  test('nenhuma marca cai no texto neutro — todas tem tinta propria', () => {
    // Ate 07/08, Emprega+, PdV e ResultX nao tinham variante do dourado
    // aprovada em AA como texto no light, e --accent-primary-text caia em
    // var(--text-primary). As tres ganharam --*-gold-ink #866425. Remover o
    // token faz o gerador voltar ao neutro, e este teste reprova.
    for (const id of BRAND_IDS) {
      const css = readBridge(id);
      expect(`${id}: ${css.includes('--accent-primary-text: var(--text-primary)')}`).toBe(
        `${id}: false`
      );
      expect(`${id}: ${css.includes('LACUNA DE MARCA')}`).toBe(`${id}: false`);
    }
  });

  test('o build nao reporta lacuna nenhuma', () => {
    expect(build({ write: false }).gaps).toEqual([]);
  });

  test('toda tinta alcanca 4.5:1 sobre o accent da marca', () => {
    const { report } = build({ write: false });
    for (const { brand, theme, r } of report) {
      const measured = ratio(r.ink.value, r.accent);
      expect(`${brand}/${theme}: ${measured >= AA_NORMAL ? 'AA' : `${measured} ABAIXO DE 4.5`}`)
        .toBe(`${brand}/${theme}: AA`);
    }
  });
});

describe('Brand bridge — cobertura de escopo', () => {
  const SCOPES = [
    '[data-theme="dark"]',
    '[data-theme="light"]',
    '@media (prefers-color-scheme: dark)',
    '@media (prefers-color-scheme: light)',
  ];

  test.each(BRAND_IDS)('%s sobrescreve os quatro escopos de tema', (id) => {
    const css = readBridge(id);
    for (const scope of SCOPES) {
      expect(css).toContain(scope);
    }
    // Os blocos de auto-deteccao precisam da mesma especificidade do DS,
    // senao o teal do DS vence e a marca nao aparece para quem nao seta tema.
    expect(css).toContain(':root:not([data-theme])');
  });

  test.each(BRAND_IDS)('%s define --text-inverse nos quatro escopos', (id) => {
    // 2 blocos data-theme + 2 blocos de media query
    expect(declarationsOf(readBridge(id), '--text-inverse')).toHaveLength(4);
  });

  test.each(BRAND_IDS)('%s define --accent-primary-text nos quatro escopos', (id) => {
    // Presente sempre: valor de marca quando existe, texto neutro na lacuna.
    expect(declarationsOf(readBridge(id), '--accent-primary-text')).toHaveLength(4);
  });

  test.each(BRAND_IDS)('%s nao carrega nenhum teal do DS', (id) => {
    const css = readBridge(id);
    for (const teal of DS_TEAL) {
      expect(css).not.toContain(teal);
    }
  });
});

describe('DS — o papel de texto existe como default', () => {
  test('--accent-primary-text e declarado nos quatro escopos de tokens.css', () => {
    const css = fs.readFileSync(path.join(ROOT, 'tokens', 'tokens.css'), 'utf-8');
    expect(declarationsOf(css, '--accent-primary-text')).toHaveLength(4);
  });

  test('os componentes nao pintam texto com --accent-primary, que e preenchimento', () => {
    for (const file of ['components.css', 'data-cards.css', 'icons.css']) {
      const css = fs.readFileSync(path.join(ROOT, 'components', file), 'utf-8');
      // O lookbehind evita casar border-color / background-color / accent-color.
      const textUses = css.match(/(?<![-\w])color:\s*var\(--accent-primary\)/g) || [];
      expect({ file, textUses }).toEqual({ file, textUses: [] });
    }
  });
});
