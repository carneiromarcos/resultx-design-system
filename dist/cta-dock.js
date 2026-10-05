/**
 * ResultX Design System — CTA dock
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/cta-dock.js" defer></script>
 *
 * API:
 *   ResultXCtaDock.init(root)  — enhance every [data-cta-dock]
 *
 * Markup (last child of <body>, so its own space is reserved at the end):
 *   <aside class="cta-dock" aria-label="Atalho para demonstração"
 *          data-cta-dock
 *          data-cta-dock-after="[data-hero-cta]"
 *          data-cta-dock-until="#cta-final">
 *     <span class="cta-dock-text">Veja o produto com a sua equipe</span>
 *     <a class="btn btn-primary" href="#cta-final">Agendar demonstração</a>
 *   </aside>
 *
 * Behavior:
 *   - data-cta-dock-after: the dock shows once this element has scrolled
 *     ABOVE the viewport (leaving through the bottom does not count).
 *   - data-cta-dock-until (optional): the dock hides while this element is
 *     on screen — the final CTA does not need a second copy of itself.
 *   - Puts [data-visible] on the dock; the CSS does the rest.
 *   - IntersectionObserver only: no scroll listener.
 *   - Without IntersectionObserver, without the "after" element, or without
 *     this script, the dock stays hidden. The page loses a shortcut, nothing
 *     else.
 */
;(function () {
  'use strict';

  var READY_ATTR = 'data-cta-dock-ready';
  var VISIBLE_ATTR = 'data-visible';

  function enhance(dock) {
    if (dock.hasAttribute(READY_ATTR)) return;

    var seletorInicio = dock.getAttribute('data-cta-dock-after');
    var depoisDe = seletorInicio ? document.querySelector(seletorInicio) : null;
    if (!depoisDe) return;
    dock.setAttribute(READY_ATTR, '');

    var seletorFim = dock.getAttribute('data-cta-dock-until');
    var ate = seletorFim ? document.querySelector(seletorFim) : null;
    var estado = { passou: false, fimVisivel: false };

    function sincronizar() {
      if (estado.passou && !estado.fimVisivel) dock.setAttribute(VISIBLE_ATTR, '');
      else dock.removeAttribute(VISIBLE_ATTR);
    }

    new IntersectionObserver(function (entradas) {
      var e = entradas[entradas.length - 1];
      /* Só conta se saiu por cima: ao carregar no meio da página o marco
         pode estar abaixo da tela, e aí o CTA dele ainda está por vir. */
      estado.passou = !e.isIntersecting && e.boundingClientRect.top < 0;
      sincronizar();
    }).observe(depoisDe);

    if (ate) {
      new IntersectionObserver(function (entradas) {
        estado.fimVisivel = entradas[entradas.length - 1].isIntersecting;
        sincronizar();
      }).observe(ate);
    }
  }

  function init(root) {
    if (typeof IntersectionObserver === 'undefined') return 0;
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-cta-dock]');
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

  window.ResultXCtaDock = {
    init: init,
  };
})();
