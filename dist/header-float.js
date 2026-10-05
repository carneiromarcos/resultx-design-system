/**
 * ResultX Design System — Header float
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/header-float.js" defer></script>
 *
 * API:
 *   ResultXHeaderFloat.init(root)  — enhance every [data-header-float]
 *
 * Markup:
 *   <div class="header-float-sentinel" data-header-float-sentinel aria-hidden="true"></div>
 *   <header class="header-float" data-header-float>…</header>
 *
 * Behavior:
 *   - Puts [data-scrolled] on the header while the sentinel at the top of the
 *     page is out of view. The CSS turns that into the stronger shadow.
 *   - IntersectionObserver only: no scroll listener, nothing runs per frame.
 *   - Creates the sentinel at the start of <body> when the page has none.
 *   - Without IntersectionObserver (or without this script) the header simply
 *     keeps its resting shadow. Nothing breaks.
 */
;(function () {
  'use strict';

  var READY_ATTR = 'data-header-float-ready';
  var SENTINEL_ATTR = 'data-header-float-sentinel';
  var SCROLLED_ATTR = 'data-scrolled';

  function sentinela() {
    var existente = document.querySelector('[' + SENTINEL_ATTR + ']');
    if (existente) return existente;

    /* A sentinela precisa estar no y = 0 do documento. .header-float-sentinel
       é absolute no topo do primeiro ancestral posicionado — o <body>, na
       página comum. */
    var nova = document.createElement('div');
    nova.className = 'header-float-sentinel';
    nova.setAttribute(SENTINEL_ATTR, '');
    nova.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(nova, document.body.firstChild);
    return nova;
  }

  function enhance(header) {
    if (header.hasAttribute(READY_ATTR)) return;
    header.setAttribute(READY_ATTR, '');

    var observador = new IntersectionObserver(function (entradas) {
      var entrada = entradas[entradas.length - 1];
      if (entrada.isIntersecting) header.removeAttribute(SCROLLED_ATTR);
      else header.setAttribute(SCROLLED_ATTR, '');
    });
    observador.observe(sentinela());
  }

  function init(root) {
    if (typeof IntersectionObserver === 'undefined') return 0;
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-header-float]');
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

  window.ResultXHeaderFloat = {
    init: init,
  };
})();
