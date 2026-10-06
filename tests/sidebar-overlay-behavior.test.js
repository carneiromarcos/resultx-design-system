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

/**
 * A navegação nativa do Tab NÃO é simulada no mini-dom. Dentro da gaveta quem
 * navega é o navegador; o script só age nas bordas, pelas sentinelas. Estes
 * ajudantes reproduzem o único efeito do navegador que importa aqui: Tab
 * depois da última parada FOCA a sentinela do fim; Shift+Tab antes da
 * primeira FOCA a do início (com relatedTarget = quem tinha o foco). A prova
 * com Tab de verdade é do Playwright.
 */
const sentinelas = ({ nav }) => nav.children.filter((c) => c.hasAttribute('data-sidebar-sentinel'));
const tabDepoisDoUltimo = (ctx) => sentinelas(ctx)[1].focus();
const shiftTabAntesDoPrimeiro = (ctx) => sentinelas(ctx)[0].focus();

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

describe('Tab continua preso na gaveta aberta (sentinelas nas bordas)', () => {
  test('aberta: uma sentinela no início (tabindex=1) e outra no fim (tabindex=0), vazias e aria-hidden', () => {
    const ctx = montar();
    abrir(ctx);
    const [inicio, fim] = sentinelas(ctx);
    expect(ctx.nav.children[0]).toBe(inicio);
    expect(ctx.nav.children[ctx.nav.children.length - 1]).toBe(fim);
    expect(inicio.getAttribute('tabindex')).toBe('1');
    expect(fim.getAttribute('tabindex')).toBe('0');
    for (const s of [inicio, fim]) {
      expect(s.getAttribute('aria-hidden')).toBe('true');
      expect(s.children).toHaveLength(0);
    }
  });

  test('fechada: as sentinelas saem', () => {
    const ctx = montar();
    abrir(ctx);
    ctx.tecla('Escape');
    expect(sentinelas(ctx)).toHaveLength(0);
  });

  test('Tab depois do último volta ao primeiro; Shift+Tab antes do primeiro vai ao último', () => {
    const ctx = montar();
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    ctx.q('item-b').focus();
    tabDepoisDoUltimo(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    shiftTabAntesDoPrimeiro(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
  });

  test('Tab numa parada de verdade NÃO é interceptado (o navegador navega)', () => {
    const ctx = montar();
    abrir(ctx);
    expect(ctx.tecla('Tab')).toBe(true);
    expect(ctx.tecla('Tab', { shiftKey: true })).toBe(true);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
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

  test('primeiro grupo inerte: as bordas pulam o grupo inerte', () => {
    const ctx = montar({ filhos: comGrupoInerte });
    abrir(ctx);
    ctx.q('item-b').focus();
    tabDepoisDoUltimo(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
    shiftTabAntesDoPrimeiro(ctx);
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

  test('painel sem focáveis: o foco vai ao próprio painel (tabindex=-1) e lá fica', () => {
    const ctx = montar({ filhos: (el) => [el('p', { id: 'texto' })] });
    abrir(ctx);
    expect(ctx.nav.getAttribute('tabindex')).toBe('-1');
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    expect(ctx.tecla('Tab')).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    expect(ctx.tecla('Tab', { shiftKey: true })).toBe(false);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    tabDepoisDoUltimo(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    shiftTabAntesDoPrimeiro(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
  });

  test('foco no próprio painel com alvos: Tab entra pelo primeiro, Shift+Tab pelo último (único caso de borda no keydown)', () => {
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
 * lista e virava ponta do ciclo.
 *
 * O que o mini-dom simula aqui, e o que não: há um STUB de matches(':disabled')
 * (próprio [disabled] ou ancestral fieldset[disabled] fora do primeiro
 * <legend>) e o .focus() recusa elementos desabilitados ou inertes. A
 * navegação nativa do Tab NÃO é simulada (ver os ajudantes de sentinela no
 * topo). A prova com Tab de verdade é do Playwright.
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

  test('bordas, 10 repetições: depois do último → primeiro válido; antes do primeiro → último válido', () => {
    const ctx = montar({ filhos: comFieldsets });
    abrir(ctx);
    for (let i = 0; i < 10; i++) {
      ctx.q('item-b').focus();
      tabDepoisDoUltimo(ctx);
      expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
      shiftTabAntesDoPrimeiro(ctx);
      expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
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
    ctx.q('item-a').focus();
    shiftTabAntesDoPrimeiro(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-b'));
    tabDepoisDoUltimo(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
  });

  test('nenhum alvo aceita o foco: o foco fica no próprio painel', () => {
    const ctx = montar({
      filhos: (el) => [el('fieldset', { disabled: '' }, el('button', { id: 'off' }))],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
    tabDepoisDoUltimo(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.nav);
  });
});

/**
 * Revisor da #86 (regressões do Tab gerenciado): o script não pode tomar o
 * Tab de quem o consumiu (um editor que indenta) e a escolha das pontas segue
 * a ordem do navegador — contenteditable entra, grupo de radio vale uma
 * parada (o marcado, ou o primeiro), tabindex positivo vem antes.
 */
describe('Revisor #86 — navegação nativa por dentro, bordas pelo script', () => {
  test('Tab consumido por um widget (defaultPrevented) não move o foco', () => {
    const ctx = montar({
      filhos: (el) => [
        el('a', { href: '#a', id: 'item-a' }),
        el('textarea', { id: 'editor' }),
        el('a', { href: '#b', id: 'item-b' }),
      ],
    });
    ctx.q('editor').addEventListener('keydown', (e) => {
      if (e.key === 'Tab') e.preventDefault(); /* indenta */
    });
    abrir(ctx);
    ctx.q('editor').focus();
    ctx.tecla('Tab', { alvo: ctx.q('editor') });
    expect(ctx.doc.activeElement).toBe(ctx.q('editor'));
  });

  test('Escape consumido por um widget (defaultPrevented) não fecha a gaveta', () => {
    const ctx = montar();
    ctx.q('item-a').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') e.preventDefault(); /* ex.: combobox fechando a lista */
    });
    abrir(ctx);
    ctx.tecla('Escape', { alvo: ctx.q('item-a') });
    expect(ctx.nav.hasAttribute('data-open')).toBe(true);
    ctx.tecla('Escape');
    expect(ctx.nav.hasAttribute('data-open')).toBe(false);
  });

  test('Tab no próprio painel com defaultPrevented: o script não age', () => {
    const ctx = montar();
    ctx.nav.addEventListener('keydown', (e) => e.preventDefault());
    abrir(ctx);
    ctx.nav.focus();
    ctx.tecla('Tab', { alvo: ctx.nav });
    expect(ctx.doc.activeElement).toBe(ctx.nav);
  });

  test('contenteditable conta como parada (entra no foco inicial e nas bordas)', () => {
    const ctx = montar({
      filhos: (el) => [el('div', { id: 'edit', contenteditable: '' }), el('a', { href: '#a', id: 'item-a' })],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('edit'));
    ctx.q('item-a').focus();
    tabDepoisDoUltimo(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('edit'));
  });

  test('contenteditable="false" não conta', () => {
    const ctx = montar({
      filhos: (el) => [el('div', { id: 'nao', contenteditable: 'false' }), el('a', { href: '#a', id: 'item-a' })],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
  });

  const radios = (marcado) => (el) => [
    el('a', { href: '#a', id: 'item-a' }),
    ...[1, 2, 3].map((n) =>
      el('input', { type: 'radio', name: 'r', id: `r${n}`, ...(marcado === n ? { checked: '' } : {}) }),
    ),
  ];

  test('grupo de radio como última parada: Shift+Tab antes do primeiro vai ao MARCADO (2º)', () => {
    const ctx = montar({ filhos: radios(2) });
    abrir(ctx);
    shiftTabAntesDoPrimeiro(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('r2'));
  });

  test('grupo de radio sem marcado: vale o primeiro do grupo', () => {
    const ctx = montar({ filhos: radios(null) });
    abrir(ctx);
    shiftTabAntesDoPrimeiro(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('r1'));
  });

  test('grupo de radio como primeira parada: o foco inicial vai ao marcado', () => {
    const ctx = montar({
      filhos: (el) => [
        ...[1, 2, 3].map((n) => el('input', { type: 'radio', name: 'r', id: `r${n}`, ...(n === 2 ? { checked: '' } : {}) })),
        el('a', { href: '#a', id: 'item-a' }),
      ],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('r2'));
  });

  test('tabindex positivo vem antes na ordem: é a primeira parada', () => {
    const ctx = montar({
      filhos: (el) => [el('a', { href: '#a', id: 'item-a' }), el('button', { id: 'pos', tabindex: '2' })],
    });
    abrir(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('pos'));
    shiftTabAntesDoPrimeiro(ctx);
    expect(ctx.doc.activeElement).toBe(ctx.q('item-a'));
  });
});

/**
 * Revisor da #86 (P2 novo): ao deduplicar o grupo de rádios, o representante
 * ficava na posição do PRIMEIRO rádio do grupo, não na do marcado. Caso do
 * Revisor: r1 (não marcado), "Ajuda", r2 (marcado). Ordem nativa: Ajuda → r2;
 * o script calculava r2 → Ajuda, e Tab em r2 voltava a r2.
 *
 * A regra copiada da navegação nativa do Chrome (medida sem a gaveta): o grupo
 * (mesmo name, escopado pelo form dono) vale uma parada, na posição de DOM do
 * rádio escolhido — o marcado, se ele aceitar foco; senão o primeiro rádio
 * válido do grupo, nos dois sentidos. O mini-dom não tem
 * compareDocumentPosition: aqui vale o fallback por posição na lista (que
 * querySelectorAll já entrega em ordem de documento). A comparação com a
 * ordem nativa real é do Playwright.
 */
describe('Revisor #86 — representante do grupo de rádio na posição do escolhido', () => {
  const radio = (el, id, extra = {}) => el('input', { type: 'radio', name: 'r', id, ...extra });
  const bordas = (ctx) => {
    tabDepoisDoUltimo(ctx);
    const primeiro = ctx.doc.activeElement.id;
    shiftTabAntesDoPrimeiro(ctx);
    const ultimo = ctx.doc.activeElement.id;
    return [primeiro, ultimo];
  };

  test.each([
    ['caso do Revisor: r1, Ajuda, r2 marcado', (el) => [radio(el, 'r1'), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r2', { checked: '' })], ['ajuda', 'r2']],
    ['marcado no fim, depois de dois não marcados', (el) => [radio(el, 'r1'), radio(el, 'r2'), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r3', { checked: '' })], ['ajuda', 'r3']],
    ['nenhum marcado: vale o primeiro, nos dois sentidos', (el) => [radio(el, 'r1'), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r2'), radio(el, 'r3')], ['r1', 'ajuda']],
    ['marcado desabilitado: vale o primeiro válido', (el) => [radio(el, 'r1'), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r2', { checked: '', disabled: '' }), radio(el, 'r3')], ['r1', 'ajuda']],
    ['marcado inerte: vale o primeiro válido', (el) => [radio(el, 'r1'), el('a', { href: '#h', id: 'ajuda' }), el('span', { inert: '' }, radio(el, 'r2', { checked: '' })), radio(el, 'r3')], ['r1', 'ajuda']],
    ['dois forms com o mesmo name: dois grupos', (el) => [
      el('form', { id: 'f1' }, radio(el, 'a1'), radio(el, 'a2', { checked: '' })),
      el('a', { href: '#h', id: 'ajuda' }),
      el('form', { id: 'f2' }, radio(el, 'b1', { checked: '' }), radio(el, 'b2')),
    ], ['a2', 'b1']],
    ['fieldsets diferentes, mesmo name, sem form: um grupo só', (el) => [
      el('fieldset', {}, radio(el, 'a1'), radio(el, 'a2')),
      el('a', { href: '#h', id: 'ajuda' }),
      el('fieldset', {}, radio(el, 'b1', { checked: '' })),
    ], ['ajuda', 'b1']],
  ])('%s', (_, filhos, esperado) => {
    const ctx = montar({ filhos });
    abrir(ctx);
    expect(ctx.doc.activeElement.id).toBe(esperado[0]); /* foco inicial = primeira parada */
    for (let i = 0; i < 10; i++) expect(bordas(ctx)).toEqual(esperado);
  });
});

/**
 * P3 da aprovação da #86: sem rádio marcado, o representante era o primeiro
 * válido em ordem de DOM, antes de considerar o tabindex. Medido no Chrome
 * (sequência completa a partir do início do documento): sem marcado, a
 * parada é o primeiro rádio na ordem SEQUENCIAL — tabindex positivo
 * crescente, depois DOM —, a mesma no Tab e no Shift+Tab. Como no bloco
 * anterior, o mini-dom usa o fallback de posição; a comparação com o nativo
 * é do Playwright.
 */
describe('P3 da #86 — sem marcado, o representante segue a ordem sequencial', () => {
  const radio = (el, id, extra = {}) => el('input', { type: 'radio', name: 'r', id, ...extra });

  test.each([
    ['r1, Ajuda, r2 tabindex=2: abre em r2 e cicla r2 ↔ Ajuda', (el) => [radio(el, 'r1'), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r2', { tabindex: '2' })], ['r2', 'ajuda']],
    ['r1 tabindex=3, Ajuda, r2 tabindex=2: o menor positivo vence', (el) => [radio(el, 'r1', { tabindex: '3' }), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r2', { tabindex: '2' })], ['r2', 'ajuda']],
    ['marcado sem tabindex vence o positivo não marcado', (el) => [radio(el, 'r1', { checked: '' }), el('a', { href: '#h', id: 'ajuda' }), radio(el, 'r2', { tabindex: '2' })], ['r1', 'ajuda']],
  ])('%s', (_, filhos, [primeiro, ultimo]) => {
    const ctx = montar({ filhos });
    abrir(ctx);
    expect(ctx.doc.activeElement.id).toBe(primeiro);
    for (let i = 0; i < 10; i++) {
      tabDepoisDoUltimo(ctx);
      expect(ctx.doc.activeElement.id).toBe(primeiro);
      shiftTabAntesDoPrimeiro(ctx);
      expect(ctx.doc.activeElement.id).toBe(ultimo);
    }
  });
});
