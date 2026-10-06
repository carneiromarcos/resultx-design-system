/**
 * ResultX Design System — Sidebar overlay
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/sidebar-overlay.js"></script>
 *
 * API:
 *   ResultXSidebarOverlay.init(root)  — enhance every [data-sidebar-overlay]
 *   ResultXSidebarOverlay.open(el[, invocador])   — invocador: where focus
 *                                                   returns on close
 *   ResultXSidebarOverlay.close(el)
 *   ResultXSidebarOverlay.toggle(el[, invocador])
 *
 * Markup:
 *   <button data-sidebar-toggle="nav" aria-expanded="false" hidden>Menu</button>
 *   <aside class="sidebar sidebar-overlay" id="nav" data-sidebar-overlay>…</aside>
 *
 * The trigger ships `hidden` and the script reveals it: without JavaScript the
 * panel cannot open, and a button that does nothing is worse than no button.
 *
 * Behavior:
 *   - Creates its own .sidebar-scrim when the page has none
 *   - Escape closes; clicking the scrim closes
 *   - Focus moves into the panel on open and returns, on close, to the
 *     trigger that opened it: event.currentTarget of the click, never
 *     document.activeElement. In Safari (and with button.click(), or a
 *     pointer whose mousedown is prevented) the click does not focus the
 *     button, so activeElement would be whatever had focus before — a field
 *     in the page that the drawer makes inert. Every [data-sidebar-toggle]
 *     for the panel works, not just the first. Opened by the API without an
 *     invocador, focus returns to activeElement only if it sits outside the
 *     panel and outside the background that turns inert; otherwise to the
 *     first trigger.
 *   - Tab is trapped inside the panel while it is open — an open overlay that
 *     lets Tab wander into the page behind it is a maze for keyboard users.
 *     Inside the panel the BROWSER navigates (radio groups, contenteditable,
 *     positive tabindex, widgets that consume Tab all keep their native
 *     behaviour). The script only acts at the edges, with focus sentinels:
 *     two empty, aria-hidden, tabbable elements inserted at the start
 *     (tabindex=1, so it precedes even positive tabindex) and at the end
 *     (tabindex=0) of the panel while it is open, removed on close. Tab past
 *     the last stop lands on the end sentinel, which sends focus to the first
 *     valid stop; Shift+Tab before the first lands on the start sentinel,
 *     which sends it to the last. "Valid" excludes [inert] ancestors, hidden,
 *     effectively :disabled (covers <fieldset disabled>, keeps the first
 *     <legend>) and tabindex=-1; includes contenteditable; a radio group
 *     (same name, scoped by its form owner) counts once, AT THE DOM POSITION
 *     OF THE CHOSEN RADIO: the checked one if it accepts focus, otherwise the
 *     first valid radio of the group (as Chrome's native order does); order
 *     is sequential (positive tabindex first, then document position). Every .focus() is checked
 *     against activeElement and the next candidate is tried; if nothing
 *     accepts, the panel itself (tabindex=-1) takes focus. One keydown edge
 *     case: Tab while the panel ITSELF has focus goes to the first/last stop
 *     (the browser would otherwise leave the page). No keydown handler acts
 *     on an event whose defaultPrevented is already true.
 *   - While open it is a modal dialog for real: role="dialog" +
 *     aria-modal="true" on the panel, and every sibling on the path from the
 *     panel up to <body> gets [inert] (except the scrim, which must stay
 *     clickable). A shortcut that calls .focus() on the page behind can no
 *     longer pull focus out, and screen readers stop reading the background.
 *     Everything is undone on close — including the close that
 *     data-sidebar-media triggers when the window grows into panel/rail mode.
 *     Elements that were already [inert] are left alone.
 *   - Locks page scroll while open
 *   - Optional data-sidebar-media="(max-width: 1024px)" closes the panel when
 *     the query stops matching, so a stuck overlay never survives a resize
 *   - Dispatches 'sidebartoggle' with detail { open }
 */
;(function () {
  'use strict';

  var READY_ATTR = 'data-sidebar-ready';
  var OPEN_ATTR = 'data-open';

  var FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'summary',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]:not([contenteditable="false"])',
  ].join(',');

  var SENTINEL_ATTR = 'data-sidebar-sentinel';

  /* Um alvo so vale se o navegador aceitar o .focus(). Fica de fora o que
     esta dentro de um [inert] (inclusive um grupo inerte dentro do painel),
     o que esta escondido (display:none corta o offsetParent; visibility:
     hidden nao corta, por isso o getComputedStyle), o desabilitado e o
     tabindex=-1. Sem este filtro o primeiro alvo podia ser um desses: o
     .focus() falhava em silencio, o foco ficava no <body> e o Tab nao
     circulava do ultimo para o primeiro. */
  /* Desabilitacao EFETIVA. Um controle dentro de <fieldset disabled> tem
     .disabled === false, mas casa com :disabled e recusa o foco. :disabled
     ja respeita a excecao do primeiro <legend> do fieldset (que continua
     habilitado). Sem suporte a :disabled, o fallback e conservador: exclui
     qualquer coisa dentro de fieldset[disabled]. */
  function desabilitado(no) {
    try {
      return no.matches(':disabled');
    } catch (e) {
      return !!(
        no.disabled ||
        no.hasAttribute('disabled') ||
        (no.closest && no.closest('fieldset[disabled]'))
      );
    }
  }

  function focavel(no) {
    if (no.offsetParent === null) return false;
    if (no.closest('[inert]')) return false;
    if (desabilitado(no)) return false;
    if (no.getAttribute('tabindex') === '-1') return false;
    if (typeof window.getComputedStyle === 'function') {
      var estilo = window.getComputedStyle(no);
      if (estilo.visibility !== 'visible' || estilo.display === 'none') return false;
    }
    return true;
  }

  function marcado(radio) {
    return radio.checked === true || (radio.checked === undefined && radio.hasAttribute('checked'));
  }

  function chaveDoGrupo(radio) {
    var nome = radio.getAttribute('name');
    if (radio.tagName !== 'INPUT' || radio.getAttribute('type') !== 'radio' || !nome) return null;
    var form = radio.form || (radio.closest && radio.closest('form'));
    return { nome: nome, form: form || null };
  }

  function ordemSequencial(no) {
    var t = parseInt(no.getAttribute('tabindex'), 10);
    return t > 0 ? t : 0;
  }

  /* Paradas de Tab validas, na ordem sequencial do navegador.
     Grupo de radio (mesmo name, escopado pelo form dono — radio.form; fora de
     form, o documento; fieldsets nao separam grupos) vale UMA parada, e ela
     fica na posicao de DOM do proprio radio escolhido:
       - o marcado, se ele aceitar foco;
       - senao (nenhum marcado, ou o marcado desabilitado/inerte/oculto), o
         primeiro radio valido do grupo em ordem de DOM — nos dois sentidos.
     Medido na navegacao nativa do Chrome, sem a gaveta (Revisor da #86).
     Depois da escolha, ordena: tabindex positivo primeiro (crescente), depois
     os demais; empate pela posicao no documento (compareDocumentPosition).
     As sentinelas nao contam. */
  function focusablesIn(el) {
    var todos = el.querySelectorAll(FOCUSABLE);
    var validos = [];
    var grupos = [];
    var i;
    for (i = 0; i < todos.length; i++) {
      var no = todos[i];
      if (no.hasAttribute(SENTINEL_ATTR) || !focavel(no)) continue;
      validos.push(no);
      var chave = chaveDoGrupo(no);
      if (!chave) continue;
      var grupo = null;
      for (var g = 0; g < grupos.length; g++) {
        if (grupos[g].nome === chave.nome && grupos[g].form === chave.form) grupo = grupos[g];
      }
      if (!grupo) {
        grupo = { nome: chave.nome, form: chave.form, primeiro: no, marcado: null };
        grupos.push(grupo);
      }
      if (!grupo.marcado && marcado(no)) grupo.marcado = no;
    }
    var paradas = [];
    for (i = 0; i < validos.length; i++) {
      var v = validos[i];
      var k = chaveDoGrupo(v);
      if (k) {
        for (var j = 0; j < grupos.length; j++) {
          if (grupos[j].nome === k.nome && grupos[j].form === k.form) {
            if ((grupos[j].marcado || grupos[j].primeiro) !== v) v = null;
            break;
          }
        }
      }
      if (v) paradas.push({ no: v, ordem: ordemSequencial(v), posicao: i });
    }
    paradas.sort(function (a, b) {
      if (a.ordem !== b.ordem) {
        if (a.ordem === 0) return 1;
        if (b.ordem === 0) return -1;
        return a.ordem - b.ordem;
      }
      return emOrdemDeDocumento(a, b);
    });
    return paradas.map(function (x) {
      return x.no;
    });
  }

  /* Posicao no documento. querySelectorAll ja devolve nessa ordem; o
     compareDocumentPosition deixa explicito e nao depende disso. */
  function emOrdemDeDocumento(a, b) {
    if (a.no.compareDocumentPosition) {
      var rel = a.no.compareDocumentPosition(b.no);
      if (rel & 4) return -1; /* DOCUMENT_POSITION_FOLLOWING: b vem depois */
      if (rel & 2) return 1; /* DOCUMENT_POSITION_PRECEDING */
    }
    return a.posicao - b.posicao;
  }

  /* Foca o primeiro alvo (na direcao pedida) que de fato receber o foco;
     sem nenhum, o proprio painel (tabindex=-1, posto no enhance). Nunca
     deixa o foco no <body>. */
  function focarDentro(el, alvos, doFim) {
    for (var i = 0; i < alvos.length; i++) {
      var alvo = alvos[doFim ? alvos.length - 1 - i : i];
      alvo.focus();
      if (document.activeElement === alvo) return;
    }
    el.focus();
  }

  /* Sentinela: vazia, fora da arvore de acessibilidade, tabulavel. Estilo
     pelo CSSOM (el.style), que uma CSP sem 'unsafe-inline' permite. */
  function criarSentinela(el, tabindex, aoFocar) {
    var s = document.createElement('span');
    s.setAttribute(SENTINEL_ATTR, '');
    s.setAttribute('tabindex', tabindex);
    s.setAttribute('aria-hidden', 'true');
    s.style.position = 'absolute';
    s.style.width = '1px';
    s.style.height = '1px';
    s.style.overflow = 'hidden';
    s.style.clipPath = 'inset(50%)';
    s.style.whiteSpace = 'nowrap';
    s.addEventListener('focus', aoFocar);
    return s;
  }

  function porSentinelas(el) {
    var inicio = criarSentinela(el, '1', function (event) {
      /* Chegou de dentro do painel (Shift+Tab antes da primeira parada): vai
         para a ultima. De fora ou do proprio painel: entra pela primeira. */
      var de = event.relatedTarget;
      var deDentro = de && de !== el && el.contains(de) && !de.hasAttribute(SENTINEL_ATTR);
      focarDentro(el, focusablesIn(el), !!deDentro);
    });
    var fim = criarSentinela(el, '0', function () {
      /* Tab depois da ultima parada: volta para a primeira. */
      focarDentro(el, focusablesIn(el), false);
    });
    el.insertBefore(inicio, el.firstChild);
    el.appendChild(fim);
    el._sentinelas = [inicio, fim];
  }

  function tirarSentinelas(el) {
    var lista = el._sentinelas || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].parentNode) lista[i].parentNode.removeChild(lista[i]);
    }
    el._sentinelas = null;
  }

  function triggersFor(el) {
    return document.querySelectorAll('[data-sidebar-toggle="' + el.id + '"]');
  }

  function setExpanded(el, aberto) {
    var gatilhos = triggersFor(el);
    for (var i = 0; i < gatilhos.length; i++) {
      gatilhos[i].setAttribute('aria-expanded', aberto ? 'true' : 'false');
    }
  }

  function scrimFor(el) {
    if (el._scrim) return el._scrim;
    var existente = document.querySelector('.sidebar-scrim');
    if (!existente) {
      existente = document.createElement('div');
      existente.className = 'sidebar-scrim';
      /* Decorativo: quem fecha pelo teclado usa Escape, nao este elemento. */
      existente.setAttribute('aria-hidden', 'true');
      document.body.appendChild(existente);
    }
    el._scrim = existente;
    return existente;
  }

  function isOpen(el) {
    return el.hasAttribute(OPEN_ATTR);
  }

  /* Fundo inerte enquanto a gaveta esta aberta. Marca os irmaos de cada
     ancestral, do painel ate o <body>, e guarda quem marcou para desfazer so
     isso ao fechar. O scrim fica de fora: inert tambem bloqueia o clique, e o
     clique no scrim fecha a gaveta. */
  function isolarFundo(el) {
    var marcados = [];
    var scrim = el._scrim;
    for (var no = el; no && no.parentNode && no !== document.body; no = no.parentNode) {
      var irmaos = no.parentNode.children;
      for (var i = 0; i < irmaos.length; i++) {
        var irmao = irmaos[i];
        if (irmao === no || irmao === scrim) continue;
        if (irmao.tagName === 'SCRIPT' || irmao.tagName === 'STYLE') continue;
        if (irmao.hasAttribute('inert')) continue;
        irmao.setAttribute('inert', '');
        marcados.push(irmao);
      }
    }
    el._inertes = marcados;
  }

  /* O no ficaria inerte com a gaveta aberta? E o mesmo percurso de
     isolarFundo: irmaos de cada ancestral do painel ate o <body>. */
  function ficaraInerte(el, no) {
    var scrim = el._scrim;
    for (var n = el; n && n.parentNode && n !== document.body; n = n.parentNode) {
      var irmaos = n.parentNode.children;
      for (var i = 0; i < irmaos.length; i++) {
        if (irmaos[i] !== n && irmaos[i] !== scrim && irmaos[i].contains(no)) return true;
      }
    }
    return false;
  }

  /* Destino do foco quando a API abre sem invocador. */
  function invocadorPadrao(el) {
    var ativo = document.activeElement;
    if (
      ativo &&
      ativo !== document.body &&
      !el.contains(ativo) &&
      !ficaraInerte(el, ativo)
    ) {
      return ativo;
    }
    return triggersFor(el)[0] || null;
  }

  function liberarFundo(el) {
    var marcados = el._inertes || [];
    for (var i = 0; i < marcados.length; i++) marcados[i].removeAttribute('inert');
    el._inertes = null;
  }

  /* Semantica de dialogo so enquanto aberta: fechada, o <aside> volta a ser
     o landmark de navegacao que era (e o role anterior, se havia, volta). */
  function tornarModal(el) {
    /* null = ausente. Guarda presenca e valor dos dois atributos. */
    el._roleAnterior = el.getAttribute('role');
    el._ariaModalAnterior = el.getAttribute('aria-modal');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
  }

  function restaurar(el, nome, anterior) {
    if (anterior === null || anterior === undefined) el.removeAttribute(nome);
    else el.setAttribute(nome, anterior);
  }

  function desfazerModal(el) {
    restaurar(el, 'role', el._roleAnterior);
    restaurar(el, 'aria-modal', el._ariaModalAnterior);
    el._roleAnterior = null;
    el._ariaModalAnterior = null;
  }

  function emit(el, aberto) {
    el.dispatchEvent(
      new CustomEvent('sidebartoggle', { bubbles: true, detail: { open: aberto } })
    );
  }

  /* invocador: o gatilho que abriu (event.currentTarget do clique). */
  function open(el, invocador) {
    if (isOpen(el)) return;

    scrimFor(el); /* o scrim precisa existir antes de decidir o que fica inerte */
    el._devolverFocoPara = invocador || invocadorPadrao(el);
    el.setAttribute(OPEN_ATTR, '');
    scrimFor(el).setAttribute(OPEN_ATTR, '');

    setExpanded(el, true);

    el._overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    tornarModal(el);
    isolarFundo(el);
    porSentinelas(el);

    /* Foco sincrono, e nao num quadro futuro: o CSS aplica visibility com
       `0s` ao abrir justamente para que o painel ja esteja visivel aqui.
       Focar um elemento ainda invisivel falha em silencio, e o foco fica
       preso no botao — foi o que aconteceu antes do ajuste no CSS. */
    focarDentro(el, focusablesIn(el));

    emit(el, true);
  }

  function close(el) {
    if (!isOpen(el)) return;

    el.removeAttribute(OPEN_ATTR);
    scrimFor(el).removeAttribute(OPEN_ATTR);

    setExpanded(el, false);

    document.body.style.overflow = el._overflowAnterior || '';

    /* Antes de devolver o foco: o gatilho esta no fundo, e um elemento
       inerte nao recebe foco. */
    liberarFundo(el);
    desfazerModal(el);
    tirarSentinelas(el);

    /* Devolver o foco a quem abriu. Sem isto ele volta ao topo da pagina e o
       usuario de teclado perde o lugar. */
    if (el._devolverFocoPara && el._devolverFocoPara.focus) {
      el._devolverFocoPara.focus();
    }
    el._devolverFocoPara = null;

    emit(el, false);
  }

  function toggle(el, invocador) {
    if (isOpen(el)) close(el);
    else open(el, invocador);
  }

  /* Unico caso de borda no teclado: o foco esta no PROPRIO painel
     (tabindex=-1, sem parada sequencial). Dali o navegador procuraria a
     parada seguinte pela posicao no DOM — e o fundo esta inerte, entao o
     foco sairia da pagina. Nas paradas de verdade, nada e interceptado. */
  function tabNoPainel(el, event) {
    if (document.activeElement !== el) return;
    event.preventDefault();
    focarDentro(el, focusablesIn(el), event.shiftKey);
  }

  function enhance(el) {
    if (el.hasAttribute(READY_ATTR)) return;
    if (!el.id) return; /* sem id nao ha como ligar o gatilho ao painel */

    el.setAttribute(READY_ATTR, '');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');

    var gatilhos = triggersFor(el);
    for (var g = 0; g < gatilhos.length; g++) {
      var gatilho = gatilhos[g];
      gatilho.hidden = false;
      gatilho.setAttribute('aria-controls', el.id);
      gatilho.setAttribute('aria-expanded', isOpen(el) ? 'true' : 'false');
      gatilho.addEventListener('click', function (event) {
        /* currentTarget, nao activeElement: o clique pode nao focar o botao. */
        toggle(el, event.currentTarget);
      });
    }

    scrimFor(el).addEventListener('click', function () {
      close(el);
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen(el)) return;
      /* Um widget dentro da gaveta que ja consumiu a tecla (um editor que usa
         Tab para indentar, um combobox que fecha com Escape) manda. */
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close(el);
      } else if (event.key === 'Tab') {
        tabNoPainel(el, event);
      }
    });

    /* Um overlay preso depois de a janela crescer e um painel orfao: some o
       motivo dele existir e sobra a trava de rolagem. */
    var consulta = el.getAttribute('data-sidebar-media');
    if (consulta && window.matchMedia) {
      var mq = window.matchMedia(consulta);
      var aoMudar = function () {
        if (!mq.matches) close(el);
      };
      if (mq.addEventListener) mq.addEventListener('change', aoMudar);
      else if (mq.addListener) mq.addListener(aoMudar);
    }
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-sidebar-overlay]');
    for (var i = 0; i < nodes.length; i++) {
      enhance(nodes[i]);
    }
    return nodes.length;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
    });
  } else {
    init();
  }

  window.ResultXSidebarOverlay = {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
  };
})();
