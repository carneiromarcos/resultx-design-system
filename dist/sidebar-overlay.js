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
 *     lets Tab wander into the page behind it is a maze for keyboard users
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
  ].join(',');

  function focusablesIn(el) {
    var todos = el.querySelectorAll(FOCUSABLE);
    var visiveis = [];
    for (var i = 0; i < todos.length; i++) {
      /* offsetParent nulo = escondido. Um item invisivel no ciclo de foco
         manda o usuario para o nada. */
      if (todos[i].offsetParent !== null) visiveis.push(todos[i]);
    }
    return visiveis;
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
    el._roleAnterior = el.getAttribute('role');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
  }

  function desfazerModal(el) {
    if (el._roleAnterior) el.setAttribute('role', el._roleAnterior);
    else el.removeAttribute('role');
    el.removeAttribute('aria-modal');
    el._roleAnterior = null;
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

    /* Foco sincrono, e nao num quadro futuro: o CSS aplica visibility com
       `0s` ao abrir justamente para que o painel ja esteja visivel aqui.
       Focar um elemento ainda invisivel falha em silencio, e o foco fica
       preso no botao — foi o que aconteceu antes do ajuste no CSS. */
    var alvos = focusablesIn(el);
    if (alvos.length) alvos[0].focus();
    else el.focus();

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

  function trapTab(el, event) {
    var alvos = focusablesIn(el);
    if (!alvos.length) {
      event.preventDefault();
      return;
    }
    var primeiro = alvos[0];
    var ultimo = alvos[alvos.length - 1];

    if (event.shiftKey && document.activeElement === primeiro) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && document.activeElement === ultimo) {
      event.preventDefault();
      primeiro.focus();
    }
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
      if (event.key === 'Escape') {
        event.preventDefault();
        close(el);
      } else if (event.key === 'Tab') {
        trapTab(el, event);
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
