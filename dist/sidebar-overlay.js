/**
 * ResultX Design System — Sidebar overlay
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/sidebar-overlay.js"></script>
 *
 * API:
 *   ResultXSidebarOverlay.init(root)  — enhance every [data-sidebar-overlay]
 *   ResultXSidebarOverlay.open(el)
 *   ResultXSidebarOverlay.close(el)
 *   ResultXSidebarOverlay.toggle(el)
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
 *   - Focus moves into the panel on open and returns to the trigger on close
 *   - Tab is trapped inside the panel while it is open — an open overlay that
 *     lets Tab wander into the page behind it is a maze for keyboard users
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

  function triggerFor(el) {
    return document.querySelector('[data-sidebar-toggle="' + el.id + '"]');
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

  function emit(el, aberto) {
    el.dispatchEvent(
      new CustomEvent('sidebartoggle', { bubbles: true, detail: { open: aberto } })
    );
  }

  function open(el) {
    if (isOpen(el)) return;

    el._devolverFocoPara = document.activeElement;
    el.setAttribute(OPEN_ATTR, '');
    scrimFor(el).setAttribute(OPEN_ATTR, '');

    var gatilho = triggerFor(el);
    if (gatilho) gatilho.setAttribute('aria-expanded', 'true');

    el._overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

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

    var gatilho = triggerFor(el);
    if (gatilho) gatilho.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = el._overflowAnterior || '';

    /* Devolver o foco a quem abriu. Sem isto ele volta ao topo da pagina e o
       usuario de teclado perde o lugar. */
    if (el._devolverFocoPara && el._devolverFocoPara.focus) {
      el._devolverFocoPara.focus();
    }
    el._devolverFocoPara = null;

    emit(el, false);
  }

  function toggle(el) {
    if (isOpen(el)) close(el);
    else open(el);
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

    var gatilho = triggerFor(el);
    if (gatilho) {
      gatilho.hidden = false;
      gatilho.setAttribute('aria-controls', el.id);
      gatilho.setAttribute('aria-expanded', isOpen(el) ? 'true' : 'false');
      gatilho.addEventListener('click', function () {
        toggle(el);
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
