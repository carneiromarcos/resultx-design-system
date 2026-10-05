/**
 * .cta-panel e .cta-dock — fechamento de landing (lote P, 05/10/2026)
 *
 * .cta-panel: painel escuro dentro da página clara. O escuro vem de
 *   data-theme="dark" no próprio elemento, então os tokens do DS (e a ponte
 *   da marca) resolvem no escopo escuro sem cor nenhuma no componente.
 * .cta-dock: barra de CTA do celular. Aparece quando o CTA do hero sai da
 *   tela (IntersectionObserver), some no desktop, respeita a área segura e
 *   reduced-motion, e não cobre o fim da página: é sticky no fim do fluxo,
 *   então o espaço que ocupa já está reservado.
 */

const { css, texto, regra, regras, valor, emReduzido } = require('./lib/css');

const painel = css('components', 'cta-panel.css');
const dock = css('components', 'cta-dock.css');
const dockJs = texto('dist', 'cta-dock.js');
const docPainel = texto('docs', 'components', 'cta-panel.md');

describe('.cta-panel', () => {
  test('superfície, texto e raio vêm de tokens do tema em que está', () => {
    const r = regra(painel, '.cta-panel');
    expect(valor(r, 'background')).toContain('var(--bg-base)');
    expect(valor(r, 'color')).toBe('var(--text-primary)');
    expect(valor(r, 'border-radius')).toBe('var(--radius-xl)');
    expect(valor(r, 'overflow')).toBe('hidden');
    expect(valor(r, 'isolation')).toBe('isolate');
  });

  test('os washes são o accent do tema misturado, não cor cravada', () => {
    expect(valor(regra(painel, '.cta-panel'), 'background')).toMatch(
      /color-mix\(in srgb, var\(--accent-primary\) \d+%, transparent\)/,
    );
  });

  test('o título tem tamanho ajustável por propriedade do componente', () => {
    // Sem definir a propriedade no painel: assim um ancestral (:root) a ajusta.
    expect(valor(regra(painel, '.cta-panel'), '--cta-panel-title-size')).toBeNull();
    expect(valor(regra(painel, '.cta-panel-title'), 'font-size')).toMatch(
      /^var\(--cta-panel-title-size, clamp\(/,
    );
  });

  test('o apoio usa --text-secondary (AA nos dois temas), não --text-muted', () => {
    expect(valor(regra(painel, '.cta-panel-lead'), 'color')).toBe('var(--text-secondary)');
    expect(painel).not.toContain('var(--text-muted)');
  });

  test('o secundário dentro do painel tem hover, focus-visible e active', () => {
    const seletores = regras(painel).map((r) => r.seletor);
    for (const estado of [':hover', ':focus-visible', ':active']) {
      expect(seletores).toContain(`.cta-panel .btn-secondary${estado}`);
    }
  });

  test('a marca de prova fica fora da árvore de acessibilidade', () => {
    expect(valor(regra(painel, '.cta-panel-proof li::before'), 'content')).toMatch(/\/\s*''/);
  });

  test('a doc manda pôr data-theme="dark" no elemento', () => {
    expect(docPainel).toContain('data-theme="dark"');
  });
});

describe('.cta-dock — layout', () => {
  test('é sticky no fim do fluxo: o espaço dele fica reservado', () => {
    const r = regra(dock, '.cta-dock');
    expect(valor(r, 'position')).toBe('sticky');
    expect(valor(r, '--cta-dock-offset')).toContain('env(safe-area-inset-bottom)');
    // O mesmo recuo gruda a barra no pé E reserva o lugar dela no fim.
    expect(valor(r, 'inset-block-end')).toBe('var(--cta-dock-offset)');
    expect(valor(r, 'margin-block-end')).toBe('var(--cta-dock-offset)');
    expect(valor(r, 'z-index')).toBe('var(--z-sticky)');
  });

  test('escondida = transparente, um recuo abaixo e fora do foco', () => {
    const r = regra(dock, '.cta-dock');
    expect(valor(r, 'visibility')).toBe('hidden');
    expect(valor(r, 'opacity')).toBe('0');
    // Desce exatamente o próprio recuo: mais que isso estica a rolagem no fim.
    expect(valor(r, 'transform')).toBe('translateY(var(--cta-dock-offset))');
    expect(valor(r, 'transition')).toMatch(/visibility 0s linear/);
  });

  test('[data-visible] mostra na hora', () => {
    const r = regra(dock, '.cta-dock[data-visible]');
    expect(valor(r, 'visibility')).toBe('visible');
    expect(valor(r, 'opacity')).toBe('1');
    expect(valor(r, 'transform')).toBe('none');
  });

  test('some no desktop', () => {
    expect(valor(regra(dock, '.cta-dock', { contexto: 'min-width: 1024px' }), 'display')).toBe('none');
  });

  test('reduced-motion tira a transição', () => {
    for (const seletor of ['.cta-dock', '.cta-dock[data-visible]']) {
      const r = regras(dock).find((x) => x.seletor === seletor && emReduzido(x));
      expect(r).toBeDefined();
      expect(valor(r.corpo, 'transition')).toBe('none');
    }
  });
});

describe('.cta-dock — comportamento (dist/cta-dock.js)', () => {
  test('observa com IntersectionObserver e liga data-visible', () => {
    expect(dockJs).toContain('IntersectionObserver');
    expect(dockJs).toContain('data-visible');
  });

  test('lê os dois marcos da própria barra', () => {
    expect(dockJs).toContain('data-cta-dock-after');
    expect(dockJs).toContain('data-cta-dock-until');
  });

  test('só aparece depois que o marco subiu para fora da tela', () => {
    expect(dockJs).toMatch(/boundingClientRect\.top\s*<\s*0/);
  });

  test('sem IntersectionObserver a barra fica escondida, sem erro', () => {
    expect(dockJs).toMatch(/typeof\s+IntersectionObserver\s*===?\s*['"]undefined['"]/);
  });

  test('expõe a API', () => {
    expect(dockJs).toContain('window.ResultXCtaDock');
  });
});
