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

function montar({ role } = {}) {
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
  doc.body.appendChild(
    el('aside', attrsAside, el('a', { href: '#a', id: 'item-a' }), el('a', { href: '#b', id: 'item-b' })),
  );
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
