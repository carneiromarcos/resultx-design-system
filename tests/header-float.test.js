/**
 * .header-float — navbar flutuante (lote P, 05/10/2026)
 *
 * Decisões do Marcos que estes testes guardam:
 *   - o vidro usa o token --glass-strong-bg (0,92 no claro), não valor cru;
 *   - a sombra extra só aparece ao rolar, via [data-scrolled], que vem de um
 *     IntersectionObserver numa sentinela — nenhum scroll handler;
 *   - a 320 px a pílula não estoura: abaixo de 360 px ela compacta.
 */

const { css, texto, regra, regras, valor, emReduzido } = require('./lib/css');

const fonte = css('components', 'header-float.css');
const js = texto('dist', 'header-float.js');

describe('Pílula', () => {
  test('é sticky, afastada do topo por token, na camada sticky', () => {
    const r = regra(fonte, '.header-float');
    expect(valor(r, 'position')).toBe('sticky');
    expect(valor(r, 'top')).toMatch(/^var\(--/);
    expect(valor(r, 'z-index')).toBe('var(--z-sticky)');
  });

  test('o vidro é --glass-strong-bg com o desfoque forte do DS', () => {
    const r = regra(fonte, '.header-float-bar');
    expect(valor(r, 'background')).toBe('var(--glass-strong-bg)');
    expect(valor(r, 'backdrop-filter')).toContain('var(--glass-strong-blur)');
    expect(valor(r, '-webkit-backdrop-filter')).toContain('var(--glass-strong-blur)');
    expect(valor(r, 'min-block-size')).toBe('var(--header-height)');
  });
});

describe('Sombra ao rolar', () => {
  test('a sombra extra mora num ::after que só anima opacity', () => {
    const r = regra(fonte, '.header-float-bar::after');
    expect(valor(r, 'opacity')).toBe('0');
    expect(valor(r, 'box-shadow')).toMatch(/^var\(--elevation-/);
    expect(valor(r, 'transition')).toMatch(/^opacity\b/);
  });

  test('[data-scrolled] acende a sombra', () => {
    const r = regra(fonte, '.header-float[data-scrolled] .header-float-bar::after');
    expect(valor(r, 'opacity')).toBe('1');
  });

  test('o script usa IntersectionObserver numa sentinela e põe data-scrolled', () => {
    expect(js).toContain('IntersectionObserver');
    expect(js).toContain('data-header-float-sentinel');
    expect(js).toContain('data-scrolled');
  });

  test('sem IntersectionObserver o script sai quieto (fica a sombra base)', () => {
    expect(js).toMatch(/typeof\s+IntersectionObserver\s*===?\s*['"]undefined['"]/);
  });

  test('cria a sentinela quando a página não traz uma', () => {
    expect(js).toContain("createElement('div')");
    expect(js).toContain("setAttribute('aria-hidden', 'true')");
  });

  test('expõe uma API pequena, como sidebar-overlay.js', () => {
    expect(js).toContain('window.ResultXHeaderFloat');
  });
});

describe('Responsivo', () => {
  test('abaixo de 1024 px os links somem e o botão de menu aparece', () => {
    expect(valor(regra(fonte, '.header-float-menu'), 'display')).toBe('none');
    const contexto = 'max-width: 1023.98px';
    expect(valor(regra(fonte, '.header-float-links', { contexto }), 'display')).toBe('none');
    expect(valor(regra(fonte, '.header-float-menu', { contexto }), 'display')).not.toBe('none');
  });

  test('abaixo de 360 px a pílula compacta e o selo da marca sai da vista', () => {
    const contexto = 'max-width: 359.98px';
    expect(valor(regra(fonte, '.header-float .header-float-brand-tag', { contexto }), 'display')).toBe('none');
    // A pílula alarga: a sobra lateral (que define a largura) encolhe.
    expect(valor(regra(fonte, '.header-float', { contexto }), '--header-float-gutter')).toBe(
      'var(--space-2)',
    );
    expect(regra(fonte, '.header-float-bar', { contexto })).toMatch(/padding-inline/);
  });

  test('os alvos de toque do celular têm 44 px', () => {
    const r = regra(fonte, '.header-float-icon', { contexto: 'max-width: 1023.98px' });
    expect(r).toMatch(/inline-size:\s*44px/);
    expect(r).toMatch(/block-size:\s*44px/);
  });
});

describe('Estados', () => {
  const seletores = regras(fonte).map((r) => r.seletor);

  test.each(['.header-float-links a', '.header-float-brand', '.header-float-icon'])(
    '%s tem hover, focus-visible e active',
    (base) => {
      for (const estado of [':hover', ':focus-visible', ':active']) {
        expect(seletores).toContain(`${base}${estado}`);
      }
    },
  );

  test('a marca dá feedback sem mexer na tinta nem na opacidade do texto', () => {
    // #83: opacity 0,65 no :active levava o selo de 12 px a 3,15:1.
    for (const estado of ['', ':hover', ':active', ':focus-visible']) {
      const r = regra(fonte, `.header-float-brand${estado}`);
      expect(valor(r, 'opacity')).toBeNull();
      expect(valor(r, 'color')).toBe(estado ? null : 'var(--text-primary)');
    }
    expect(valor(regra(fonte, '.header-float-brand:hover'), 'text-decoration-line')).toBe('underline');
    expect(valor(regra(fonte, '.header-float-brand:active'), 'transform')).toMatch(/^translateY/);
  });

  test('texto secundário sobre o vidro usa a tinta medida, não --text-secondary puro', () => {
    // #83: o selo caía a 4,14:1 no escuro com um botão teal sob o vidro.
    expect(valor(regra(fonte, '.header-float-bar'), '--header-float-ink-muted')).toMatch(
      /^color-mix\(in oklab, var\(--text-secondary\) \d+%, var\(--text-primary\)\)$/,
    );
    expect(valor(regra(fonte, '.header-float-brand-tag'), 'color')).toBe(
      'var(--header-float-ink-muted, var(--text-secondary))',
    );
    expect(valor(regra(fonte, '.header-float-links a'), 'color')).toBe('var(--header-float-ink-muted)');
  });

  test('o foco usa o anel do DS', () => {
    const r = regra(fonte, '.header-float-icon:focus-visible');
    expect(valor(r, 'outline')).toContain('var(--focus-ring-color)');
  });

  test('reduced-motion desliga as transições', () => {
    const reduzidas = regras(fonte).filter(emReduzido);
    const alvo = reduzidas.find((r) => r.seletor === '.header-float-bar::after');
    expect(alvo).toBeDefined();
    expect(valor(alvo.corpo, 'transition')).toBe('none');
  });
});
