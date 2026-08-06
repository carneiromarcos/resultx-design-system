/**
 * ResultX Design System — Disclosure
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/disclosure.js"></script>
 *
 * API:
 *   ResultXDisclosure.init(root)   — enhance every .disclosure under root
 *   ResultXDisclosure.open(el)     — open one, animated
 *   ResultXDisclosure.close(el)    — close one, animated
 *   ResultXDisclosure.toggle(el)   — flip it
 *
 * Behavior:
 *   - Built on <details>/<summary>: role, aria-expanded, keyboard and
 *     find-in-page come from the browser, not from this file
 *   - Animates both directions by holding [open] until the transition ends
 *   - Persists state per data-disclosure-id in localStorage
 *   - Honors prefers-reduced-motion (no animation, no waiting)
 *   - Dispatches 'disclosuretoggle' with detail { open }
 */
;(function () {
  'use strict';

  var STORAGE_PREFIX = 'resultx-disclosure:';
  var READY_ATTR = 'data-disclosure-ready';
  var STATE_ATTR = 'data-state';
  var FALLBACK_DURATION = 220;

  function prefersReducedMotion() {
    return !!(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /* O CSS é dono da duração. Ler o token de volta impede que a espera e a
     animação se separem quando uma marca reajustar o valor. */
  function durationOf(el) {
    var raw = getComputedStyle(el).getPropertyValue('--disclosure-duration').trim();
    if (!raw) return FALLBACK_DURATION;
    var value = parseFloat(raw);
    if (isNaN(value)) return FALLBACK_DURATION;
    return raw.indexOf('ms') !== -1 ? value : value * 1000;
  }

  function storageKey(el) {
    var id = el.getAttribute('data-disclosure-id');
    return id ? STORAGE_PREFIX + id : null;
  }

  function remember(el, isOpen) {
    var key = storageKey(el);
    if (!key) return;
    try {
      localStorage.setItem(key, isOpen ? 'open' : 'closed');
    } catch (e) {
      /* Modo privado ou storage cheio: a memória é um luxo, o componente não. */
    }
  }

  function recall(el) {
    var key = storageKey(el);
    if (!key) return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function panelOf(el) {
    return el.querySelector('.disclosure-panel');
  }

  function emit(el, isOpen) {
    el.dispatchEvent(
      new CustomEvent('disclosuretoggle', { bubbles: true, detail: { open: isOpen } })
    );
  }

  function open(el) {
    if (el.open && el.getAttribute(STATE_ATTR) === 'open') return;
    window.clearTimeout(el._disclosureTimer);

    el.open = true;
    if (prefersReducedMotion()) {
      el.setAttribute(STATE_ATTR, 'open');
    } else {
      /* [open] acabou de tornar o painel visível já na altura final. Marcar
         'closed', forçar o cálculo e só então 'open' no quadro seguinte dá à
         transição um ponto de partida — sem isso ela não tem de onde animar. */
      el.setAttribute(STATE_ATTR, 'closed');
      void panelOf(el).offsetHeight;
      requestAnimationFrame(function () {
        el.setAttribute(STATE_ATTR, 'open');
      });
    }

    remember(el, true);
    emit(el, true);
  }

  function close(el) {
    if (!el.open) return;
    window.clearTimeout(el._disclosureTimer);
    el.setAttribute(STATE_ATTR, 'closed');

    /* <details> tira o conteúdo do fluxo assim que perde [open], e a transição
       de saída nunca chegaria a rodar. Segurar o atributo até o fim da
       animação é o que torna o fechar animável. */
    var wait = prefersReducedMotion() ? 0 : durationOf(el);
    el._disclosureTimer = window.setTimeout(function () {
      el.open = false;
    }, wait);

    remember(el, false);
    emit(el, false);
  }

  function toggle(el) {
    if (el.open && el.getAttribute(STATE_ATTR) !== 'closed') {
      close(el);
    } else {
      open(el);
    }
  }

  function enhance(el) {
    if (el.hasAttribute(READY_ATTR)) return;

    var summary = el.querySelector('.disclosure-summary');
    /* Markup incompleto: melhor deixar o <details> nativo funcionando sozinho
       do que assumir o controle e entregar um bloco que não abre. */
    if (!summary || !panelOf(el)) return;

    var stored = recall(el);
    var startOpen = stored === null ? el.open : stored === 'open';

    el.open = startOpen;
    el.setAttribute(STATE_ATTR, startOpen ? 'open' : 'closed');
    el.setAttribute(READY_ATTR, '');

    summary.addEventListener('click', function (event) {
      /* O comportamento padrão troca [open] na hora, o que atropela a animação
         de saída. Assumimos o controle e devolvemos o mesmo resultado. */
      event.preventDefault();
      toggle(el);
    });
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('.disclosure');
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

  window.ResultXDisclosure = {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
  };
})();
