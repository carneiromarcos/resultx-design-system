/**
 * .menu-drawer — gaveta de menu (lote P, 05/10/2026)
 *
 * Decisão do Marcos: componente próprio, sem reaproveitar .sidebar-overlay.
 * O contrato:
 *   - role=dialog modal; o botão leva aria-expanded e aria-controls;
 *   - Escape fecha e devolve o foco ao botão; Tab fica preso dentro;
 *   - o corpo rola sozinho (667×375 e 320×320) e o fundo trava;
 *   - sem o script, a gaveta ainda abre e fecha por :target (links reais).
 */

const { css, texto, regra, regras, valor, emReduzido } = require('./lib/css');

const fonte = css('components', 'menu-drawer.css');
const js = texto('dist', 'menu-drawer.js');

describe('Painel', () => {
  test('é fixo na camada modal e nasce fora da tela e fora do foco', () => {
    const r = regra(fonte, '.menu-drawer');
    expect(valor(r, 'position')).toBe('fixed');
    expect(valor(r, 'z-index')).toBe('var(--z-modal)');
    expect(valor(r, 'visibility')).toBe('hidden');
    expect(valor(r, 'transform')).toContain('translateX(100%)');
  });

  test('ao fechar, a visibilidade espera a saída; ao abrir, vira na hora', () => {
    // Se a visibilidade transicionasse ao abrir, o painel ainda estaria
    // invisível quando o script chama .focus(), e o foco falharia calado
    // (lição de .sidebar-overlay).
    expect(valor(regra(fonte, '.menu-drawer'), 'transition')).toMatch(/visibility 0s linear \S+/);
    const aberto = regra(fonte, '.menu-drawer[data-open]');
    expect(valor(aberto, 'visibility')).toBe('visible');
    expect(valor(aberto, 'transform')).toBe('none');
    expect(valor(aberto, 'transition')).not.toMatch(/visibility/);
  });

  test('o corpo rola sozinho e não vaza a rolagem para a página', () => {
    const r = regra(fonte, '.menu-drawer-body');
    expect(valor(r, 'overflow-y')).toBe('auto');
    expect(valor(r, 'min-block-size')).toBe('0');
    expect(valor(r, 'overscroll-behavior')).toBe('contain');
    expect(valor(regra(fonte, '.menu-drawer'), 'max-block-size')).toBe('100dvh');
  });

  test('cabeçalho fixo: o Fechar fica sempre à vista', () => {
    expect(valor(regra(fonte, '.menu-drawer-head'), 'flex')).toBe('none');
  });

  test('respeita a área segura do aparelho', () => {
    expect(fonte).toContain('env(safe-area-inset-top)');
    expect(fonte).toContain('env(safe-area-inset-bottom)');
  });
});

describe('Scrim', () => {
  test('fica abaixo da gaveta, na camada de overlay', () => {
    const r = regra(fonte, '.menu-drawer-scrim');
    expect(valor(r, 'z-index')).toBe('var(--z-overlay)');
    expect(valor(r, 'background')).toBe('var(--bg-overlay)');
    expect(valor(regra(fonte, '.menu-drawer-scrim[data-open]'), 'opacity')).toBe('1');
  });
});

describe('Sem o script', () => {
  test(':target abre a gaveta enquanto o script não a assumiu', () => {
    const r = regra(fonte, '.menu-drawer:target:not([data-menu-drawer-ready])');
    expect(valor(r, 'visibility')).toBe('visible');
    expect(valor(r, 'transform')).toBe('none');
    expect(
      regra(fonte, '.menu-drawer:target:not([data-menu-drawer-ready]) + .menu-drawer-scrim'),
    ).toMatch(/opacity:\s*1/);
  });

  test('o script marca a gaveta como assumida', () => {
    expect(js).toContain('data-menu-drawer-ready');
  });
});

describe('Estados', () => {
  const seletores = regras(fonte).map((r) => r.seletor);

  test.each(['.menu-drawer-close', '.menu-drawer-nav a'])('%s tem hover, focus-visible e active', (base) => {
    for (const estado of [':hover', ':focus-visible', ':active']) {
      expect(seletores).toContain(`${base}${estado}`);
    }
  });

  test('o Fechar tem alvo de 44 px', () => {
    const r = regra(fonte, '.menu-drawer-close');
    expect(valor(r, 'inline-size')).toBe('44px');
    expect(valor(r, 'block-size')).toBe('44px');
  });

  test('os itens de navegação têm alvo de 48 px', () => {
    expect(valor(regra(fonte, '.menu-drawer-nav a'), 'min-block-size')).toBe('48px');
  });

  test('sob reduce, nenhum descendente transiciona a visibility herdada', () => {
    // Achado da validação de 05/10: com a regra global de 0,01 ms do DS, o
    // .menu-drawer-head (transition-property: all, o padrão) ficava hidden
    // por um quadro, o Fechar herdava, e o foco de abertura falhava calado.
    const r = regras(fonte).find((x) => x.seletor === '.menu-drawer *' && emReduzido(x));
    expect(r).toBeDefined();
    expect(valor(r.corpo, 'transition-property')).toBe('none');
  });

  test.each(['.menu-drawer', '.menu-drawer[data-open]', '.menu-drawer-scrim', '.menu-drawer-scrim[data-open]'])(
    'reduced-motion tira a transição de %s',
    (seletor) => {
      const r = regras(fonte).find((x) => x.seletor === seletor && emReduzido(x));
      expect(r).toBeDefined();
      expect(valor(r.corpo, 'transition')).toBe('none');
    },
  );
});

describe('Comportamento (dist/menu-drawer.js)', () => {
  test('vira diálogo modal com nome', () => {
    expect(js).toContain("setAttribute('role', 'dialog')");
    expect(js).toContain("setAttribute('aria-modal', 'true')");
  });

  test('o botão leva aria-controls e aria-expanded', () => {
    expect(js).toContain("setAttribute('aria-controls'");
    expect(js).toContain("setAttribute('aria-expanded'");
  });

  test('o link de fallback vira <button> de verdade', () => {
    expect(js).toContain("createElement('button')");
    expect(js).toContain("removeAttribute('href')");
  });

  test('se o foco de abertura falhar, tenta de novo no quadro seguinte', () => {
    expect(js).toContain('function focarPrimeiro');
    expect(js).toMatch(/if \(!focarPrimeiro\(el\)\) \{\s*requestAnimationFrame/);
  });

  test('Escape fecha e o foco volta para quem abriu', () => {
    expect(js).toContain("event.key === 'Escape'");
    expect(js).toContain('_devolverFocoPara');
  });

  test('Tab fica preso dentro da gaveta', () => {
    expect(js).toContain('function prenderTab');
    expect(js).toContain("event.key === 'Tab'");
    expect(js).toContain('event.shiftKey');
  });

  test('a rolagem do fundo trava e é restaurada, não zerada', () => {
    expect(js).toContain('_overflowAnterior');
    expect(js).toContain("style.overflow = 'hidden'");
  });

  test('a gaveta não sobrevive à janela crescer', () => {
    expect(js).toContain('data-menu-drawer-media');
    expect(js).toContain('matchMedia');
  });

  test('clicar num link da gaveta fecha sem roubar o foco do destino', () => {
    expect(js).toMatch(/closest\('a\[href\]'\)/);
  });

  test('anuncia a troca de estado e expõe a API', () => {
    expect(js).toContain("'menudrawertoggle'");
    expect(js).toContain('window.ResultXMenuDrawer');
  });
});
