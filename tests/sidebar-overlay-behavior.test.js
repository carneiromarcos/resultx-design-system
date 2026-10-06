/**
 * dist/sidebar-overlay.js — comportamento, num DOM mínimo (tests/lib/mini-dom.js)
 *
 * Achado do Revisor na #85: com a gaveta aberta, <main> e o header seguiam
 * expostos e focáveis (um atalho de teclado levava o foco para trás da
 * gaveta), e a gaveta não tinha semântica modal. Agora, enquanto aberta:
 *   - o painel é role="dialog" + aria-modal="true";
 *   - os irmãos de cada ancestral, do painel até o <body>, ficam [inert],
 *     menos o scrim (inert bloquearia o clique que fecha);
 * e tudo se desfaz ao fechar — pelo Escape, pelo scrim, pela API e quando a
 * janela cresce para o modo painel/rail (data-sidebar-media deixa de casar).
 *
 * Re-revisão da #85: o destino do foco era document.activeElement. Quando o
 * gatilho é ativado sem receber foco (Safari, button.click(), mousedown com
 * preventDefault), o destino era outro elemento — um campo do fundo, que fica
 * inerte — e após o Escape o foco caía no <body>. Como no menu-drawer da #83:
 * o clique registra event.currentTarget; a API sem invocador usa activeElement
 * só se estiver fora da gaveta e fora do fundo inerte, senão o gatilho.
 */

const { criarDocumento } = require('./lib/mini-dom');

function montar({ role, ariaModal, filhos } = {}) {
  const dom = criarDocumento();
  const { doc, el } = dom;
  const attrsAside = {
    id: 'nav',
    class: 'sidebar sidebar-overlay sidebar-panel',
    'aria-label': 'Navegação',
    'data-sidebar-overlay': '',
    'data-sidebar-media': '(max-width: 1024px)',
  };
  if (role) attrsAside.role = role;
  if (ariaModal !== undefined) attrsAside['aria-modal'] = ariaModal;
  const conteudo = filhos
    ? filhos(el)
    : [el('a', { href: '#a', id: 'item-a' }), el('a', { href: '#b', id: 'item-b' })];
  doc.body.appendChild(el('aside', attrsAside, ...conteudo));
  doc.body.appendChild(
    el(
      'div',
      { id: 'casca' },
      el(
        'header',
        { id: 'topo' },
        el('button', { id: 'gatilho', 'data-sidebar-toggle': 'nav', hidden: '' }),
        el('input', { id: 'busca' }),
      ),
      el(
        'main',
        { id: 'principal' },
        el('a', { href: '#x', id: 'link-fundo' }),
        el('textarea', { id: 'campo' }),
        el('button', { id: 'gatilho-2', 'data-sidebar-toggle': 'nav', hidden: '' }),
      ),
    ),
  );
  doc.body.appendChild(el('div', { id: 'ja-inerte', inert: '' }));
  const janela = dom.carregar('dist', 'sidebar-overlay.js');
  const q = (id) => doc.querySelector(`[id="${id}"]`);
  const scrim = doc.querySelector('.sidebar-scrim');
  return { ...dom, api: janela.ResultXSidebarOverlay, q, nav: q('nav'), scrim };
}

const abrir = ({ q }) => {
  q('gatilho').focus();
  q('gatilho').click();
};

describe('Fechada: nada muda para quem já consome', () => {
  test('sem role de diálogo e sem inert no fundo', () => {
    const { nav, q } = montar();
    expect(nav.hasAttribute('role')).toBe(false);
    expect(nav.hasAttribute('aria-modal')).toBe(false);
    expect(q('casca').hasAttribute('inert')).toBe(false);
  });

  test('o gatilho é revelado e ligado ao painel, como antes', () => {
    const { q } = montar();
    expect(q('gatilho').hidden).toBe(false);
    expect(q('gatilho').getAttribute('aria-controls')).toBe('nav');
    expect(q('gatilho').getAttribute('aria-expanded')).toBe('false');
  });
});

describe('Aberta: diálogo modal de verdade', () => {
  test('o painel vira role="dialog" com aria-modal="true"', () => {
    const ctx = montar();
    abrir(ctx);
    expect(ctx.nav.getAttribute('role')).toBe('dialog');
    expect(ctx.nav.getAttribute('aria-modal')).toBe('true');
    expect(ctx.nav.getAttribute('aria-label')).toBe('Navegação');
  });

  test('o fundo fica inerte; o scrim não (o clique nele fecha)', () => {
    const ctx = montar();
    abrir(ctx);
    expect(ctx.q('casca').hasAttribute('inert')).toBe(true);
    expect(ctx.scrim.hasAttribute('inert')).toBe(false);
    expect(ctx.nav.hasAttribute('inert')).toBe(false);
  });

  test('um atalho que foca o fundo não tira o foco da gaveta', () => {
    const ctx = montar();
    abrir(ctx);
    expect(ctx.nav.contains(ctx.doc.activeElement)).toBe(true);
    ctx.q('busca').focus(); /* o que um Ctrl+K faria */
    expect(ctx.nav.contains(ctx.doc.activeElement)).toBe(true);
  });
});

describe('Fechar desfaz tudo e devolve o foco ao gatilho', () => {
  test.each([
    ['Escape', ({ tecla }) => tecla('Escape')],
    ['clique no scrim', ({ scrim }) => scrim.click()],
    ['API close()', ({ api, nav }) => api.close(nav)],
  ])('%s', (_, fechar) => {
    const ctx = montar();
    abrir(ctx);
    fechar(ctx);
    expect(ctx.nav.hasAttribute('data-open')).toBe(false);
    expect(ctx.nav.hasAttribute('role')).toBe(false);
    expect(ctx.nav.hasAttribute('aria-modal')).toBe(false);
    expect(ctx.q('casca').hasAttribute('inert')).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.q('gatilho'));
    expect(ctx.q('gatilho').getAttribute('aria-expanded')).toBe('false');
  });

  test('a janela cresce para o modo painel: fecha e libera o fundo', () => {
    const ctx = montar();
    abrir(ctx);
    ctx.midia(false);
    expect(ctx.nav.hasAttribute('data-open')).toBe(false);
    expect(ctx.nav.hasAttribute('role')).toBe(false);
    expect(ctx.q('casca').hasAttribute('inert')).toBe(false);
  });

  test('quem já era inerte continua inerte', () => {
    const ctx = montar();
    abrir(ctx);
    ctx.tecla('Escape');
    expect(ctx.q('ja-inerte').hasAttribute('inert')).toBe(true);
  });

  test('um role que o consumidor pôs no painel volta ao fechar', () => {
    const ctx = montar({ role: 'navigation' });
    abrir(ctx);
    expect(ctx.nav.getAttribute('role')).toBe('dialog');
    ctx.tecla('Escape');
    expect(ctx.nav.getAttribute('role')).toBe('navigation');
  });

  test('abrir e fechar duas vezes não acumula inert', () => {
    const ctx = montar();
    abrir(ctx);
    ctx.tecla('Escape');
    abrir(ctx);
    ctx.tecla('Escape');
    expect(ctx.q('casca').hasAttribute('inert')).toBe(false);
  });
});

describe('Tab continua preso na gaveta aberta', () => {
  test('Tab no último volta ao primeiro; Shift+Tab no primeiro vai ao último', () => {
    const ctx = montar();
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    ctx.q('item-b').focus();
    expect(ctx.tecla('Tab')).toBe(false); /* preventDefault */
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    expect(ctx.tecla('Tab', { shiftKey: true })).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
  });
});

describe('Foco volta ao gatilho que abriu, mesmo sem ele ter recebido foco', () => {
  test('dois gatilhos: click() no SEGUNDO com o foco num campo do fundo → Escape → segundo', () => {
    const ctx = montar();
    ctx.q('campo').focus();
    ctx.q('gatilho-2').click(); /* como no Safari: o clique não foca o botão */
    expect(ctx.nav.contains(ctx.doc.activeElement)).toBe(true);
    ctx.tecla('Escape');
    expect(ctx.doc.activeElement).toBe(ctx.q('gatilho-2'));
  });

  test('dois gatilhos: click() no PRIMEIRO com o foco num campo do fundo → Escape → primeiro', () => {
    const ctx = montar();
    ctx.q('campo').focus();
    ctx.q('gatilho').click();
    ctx.tecla('Escape');
    expect(ctx.doc.activeElement).toBe(ctx.q('gatilho'));
  });

  test('os dois gatilhos são revelados e acompanham aria-expanded', () => {
    const ctx = montar();
    for (const id of ['gatilho', 'gatilho-2']) {
      expect(ctx.q(id).hidden).toBe(false);
      expect(ctx.q(id).getAttribute('aria-controls')).toBe('nav');
    }
    ctx.q('gatilho-2').click();
    expect(ctx.q('gatilho').getAttribute('aria-expanded')).toBe('true');
    expect(ctx.q('gatilho-2').getAttribute('aria-expanded')).toBe('true');
    ctx.tecla('Escape');
    expect(ctx.q('gatilho').getAttribute('aria-expanded')).toBe('false');
    expect(ctx.q('gatilho-2').getAttribute('aria-expanded')).toBe('false');
  });

  test('API sem invocador, foco num campo do fundo (que fica inerte) → volta ao primeiro gatilho', () => {
    const ctx = montar();
    ctx.q('campo').focus();
    ctx.api.open(ctx.nav);
    ctx.api.close(ctx.nav);
    expect(ctx.doc.activeElement).toBe(ctx.q('gatilho'));
  });

  test('API com invocador explícito → volta a ele', () => {
    const ctx = montar();
    ctx.api.open(ctx.nav, ctx.q('gatilho-2'));
    ctx.tecla('Escape');
    expect(ctx.doc.activeElement).toBe(ctx.q('gatilho-2'));
  });

  test('API sem invocador e sem foco em lugar nenhum → primeiro gatilho', () => {
    const ctx = montar();
    expect(ctx.doc.activeElement).toBe(ctx.doc.body);
    ctx.api.open(ctx.nav);
    ctx.tecla('Escape');
    expect(ctx.doc.activeElement).toBe(ctx.q('gatilho'));
  });
});

/**
 * Revisor da #86 (P2-2): um focável dentro de um ancestral [inert], desabilitado
 * ou com tabindex=-1 era escolhido como primeiro alvo; o .focus() falhava, o foco
 * ficava no <body> e o Tab não circulava. O mini-dom respeita inert por ancestral
 * no .focus(), como o navegador; visibilidade CSS NÃO é simulada aqui — essa
 * prova é do Playwright (visibility:hidden no primeiro alvo).
 */
describe('Revisor #86 (P2-2) — só alvos que aceitam o foco', () => {
  const comGrupoInerte = (el) => [
    el('div', { id: 'grupo', inert: '' }, el('a', { href: '#x', id: 'inerte-1' }), el('a', { href: '#y', id: 'inerte-2' })),
    el('a', { href: '#a', id: 'item-a' }),
    el('a', { href: '#b', id: 'item-b' }),
  ];

  test('primeiro grupo inerte: o foco inicial vai ao primeiro alvo válido', () => {
    const ctx = montar({ filhos: comGrupoInerte });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
  });

  test('primeiro grupo inerte: Tab no último volta ao primeiro VÁLIDO; Shift+Tab no primeiro vai ao último', () => {
    const ctx = montar({ filhos: comGrupoInerte });
    abrir(ctx);
    ctx.q('item-b').focus();
    expect(ctx.tecla('Tab')).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    expect(ctx.tecla('Tab', { shiftKey: true })).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
  });

  test('desabilitado e tabindex=-1 não são alvos', () => {
    const ctx = montar({
      filhos: (el) => [
        el('button', { id: 'off', disabled: '' }),
        el('a', { href: '#z', id: 'fora-do-tab', tabindex: '-1' }),
        el('a', { href: '#a', id: 'item-a' }),
      ],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
  });

  test('painel sem focáveis: o foco vai ao próprio painel (tabindex=-1) e Tab o mantém lá', () => {
    const ctx = montar({ filhos: (el) => [el('p', { id: 'texto' })] });
    abrir(ctx);
    expect(ctx.nav.getAttribute('tabindex')).toBe('-1');
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    expect(ctx.tecla('Tab')).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    expect(ctx.tecla('Tab', { shiftKey: true })).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
  });

  test('foco no próprio painel com alvos: Tab entra pelo primeiro, Shift+Tab pelo último', () => {
    const ctx = montar();
    abrir(ctx);
    ctx.nav.focus();
    expect(ctx.tecla('Tab')).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    ctx.nav.focus();
    expect(ctx.tecla('Tab', { shiftKey: true })).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
  });
});

describe('Revisor #86 (P3-1) — aria-modal preexistente volta ao fechar', () => {
  test.each([
    ['ausente', undefined, null],
    ['"false"', 'false', 'false'],
    ['"true"', 'true', 'true'],
  ])('aria-modal %s', (_, inicial, esperado) => {
    const ctx = montar({ ariaModal: inicial });
    abrir(ctx);
    expect(ctx.nav.getAttribute('aria-modal')).toBe('true');
    ctx.tecla('Escape');
    expect(ctx.nav.getAttribute('aria-modal')).toBe(esperado);
  });

  test('role e aria-modal do consumidor voltam juntos', () => {
    const ctx = montar({ role: 'navigation', ariaModal: 'false' });
    abrir(ctx);
    ctx.tecla('Escape');
    expect(ctx.nav.getAttribute('role')).toBe('navigation');
    expect(ctx.nav.getAttribute('aria-modal')).toBe('false');
  });
});

/**
 * Revisor da #86 (P2 restante): um controle dentro de <fieldset disabled> tem
 * .disabled === false, mas casa com :disabled e recusa o foco. Ele entrava na
 * lista e o trap o usava como ponta: Tab no último ficava no último e
 * Shift+Tab no primeiro podia cair no <body>.
 *
 * O que o mini-dom simula aqui, e o que não: há um STUB de matches(':disabled')
 * (próprio [disabled] ou ancestral fieldset[disabled] fora do primeiro
 * <legend>) e o .focus() recusa elementos desabilitados ou inertes. A
 * navegação nativa do Tab NÃO é simulada: estes testes provam o que o script
 * faz no keydown (que agora move o foco ele mesmo em todo Tab). A prova com a
 * navegação real do navegador é do Playwright.
 */
describe('Revisor #86 (P2) — <fieldset disabled> e alvos que recusam foco', () => {
  const comFieldsets = (el) => [
    el('fieldset', { id: 'fs-ini', disabled: '' }, el('button', { id: 'off-ini' })),
    el('a', { href: '#a', id: 'item-a' }),
    el(
      'fieldset',
      { id: 'fs-leg', disabled: '' },
      el('legend', {}, el('input', { id: 'na-legenda' })),
      el('input', { id: 'fora-da-legenda' }),
    ),
    el('a', { href: '#b', id: 'item-b' }),
    el('fieldset', { id: 'fs-fim', disabled: '' }, el('button', { id: 'off-fim' })),
  ];

  test('controle em fieldset disabled não é alvo; o do primeiro legend é', () => {
    const ctx = montar({ filhos: comFieldsets });
    expect(ctx.q('off-ini').disabled).toBeUndefined(); /* como .disabled === false no navegador */
    expect(ctx.q('off-ini').matches(':disabled')).toBe(true);
    expect(ctx.q('na-legenda').matches(':disabled')).toBe(false);
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
  });

  test('Tab percorre só os válidos e dá a volta, 10 repetições, nunca no <body>', () => {
    const ctx = montar({ filhos: comFieldsets });
    abrir(ctx);
    const ordem = ['na-legenda', 'item-b', 'item-a'];
    for (let i = 0; i < 10; i++) {
      expect(ctx.tecla('Tab')).toBe(false);
      expect(ctx.doc.activeElement).toBe(ctx.q(ordem[i % 3]));
    }
  });

  test('Shift+Tab no primeiro vai ao último, 10 repetições, nunca no <body>', () => {
    const ctx = montar({ filhos: comFieldsets });
    abrir(ctx);
    const ordem = ['item-b', 'na-legenda', 'item-a'];
    for (let i = 0; i < 10; i++) {
      expect(ctx.tecla('Tab', { shiftKey: true })).toBe(false);
      expect(ctx.doc.activeElement).toBe(ctx.q(ordem[i % 3]));
    }
  });

  test('um alvo que recusa o foco por motivo que o filtro não previu é pulado', () => {
    const ctx = montar({
      filhos: (el) => [
        el('a', { href: '#a', id: 'item-a' }),
        el('a', { href: '#b', id: 'item-b' }),
        el('a', { href: '#c', id: 'recusa' }),
      ],
    });
    /* Simulação declarada: este nó ignora .focus(), como um alvo que o
       navegador recusasse. É a ponta final da lista. */
    ctx.q('recusa').focus = () => {};
    abrir(ctx);
    ctx.q('item-b').focus();
    ctx.tecla('Tab');
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    ctx.tecla('Tab', { shiftKey: true });
    expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
  });

  test('nenhum alvo aceita o foco: o foco fica no próprio painel', () => {
    const ctx = montar({
      filhos: (el) => [el('fieldset', { disabled: '' }, el('button', { id: 'off' }))],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    ctx.tecla('Tab');
    expect(ctx.doc.activeElement).toBe(ctx.nav);
  });
});
