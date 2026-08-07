/**
 * ResultX Design System — Split pane
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/split-pane.js"></script>
 *
 * API:
 *   ResultXSplitPane.init(root)        — enhance every [data-split-pane]
 *   ResultXSplitPane.setWidth(el, px)  — set the panel width, clamped
 *   ResultXSplitPane.reset(el)         — back to the token default
 *   ResultXSplitPane.getWidth(el)      — current width in px
 *
 * Behavior:
 *   - Writes ONE variable, --split-pane-width, on the .split-pane element.
 *     The grid derives both columns from it, so the panel and the space it
 *     takes from the main column cannot drift apart.
 *   - Pointer drag with pointer capture (mouse, touch and pen alike)
 *   - Keyboard on the separator: ArrowLeft/Right by 16px, Shift for 64px,
 *     Home/End jump to the limits, Enter or double-click restores the default
 *   - Clamps to --split-pane-min / --split-pane-max, both read from CSS
 *   - Persists per data-split-id in localStorage
 *   - Keeps role="separator" and aria-value* in sync for screen readers
 *   - Dispatches 'splitpaneresize' with detail { width }
 */
;(function () {
  'use strict';

  var STORAGE_PREFIX = 'resultx-split-pane:';
  var WIDTH_VAR = '--split-pane-width';
  var STEP = 16;
  var STEP_LARGE = 64;

  function readPx(el, name, fallback) {
    var raw = getComputedStyle(el).getPropertyValue(name).trim();
    var value = parseFloat(raw);
    return isNaN(value) ? fallback : value;
  }

  function limitsOf(el) {
    return {
      min: readPx(el, '--split-pane-min', 260),
      max: readPx(el, '--split-pane-max', 560),
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function storageKey(el) {
    var id = el.getAttribute('data-split-id');
    return id ? STORAGE_PREFIX + id : null;
  }

  function remember(el, width) {
    var key = storageKey(el);
    if (!key) return;
    try {
      localStorage.setItem(key, String(Math.round(width)));
    } catch (e) {
      /* Modo privado ou storage cheio: perde-se a memória, não o componente. */
    }
  }

  function recall(el) {
    var key = storageKey(el);
    if (!key) return null;
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return null;
      var value = parseFloat(raw);
      return isNaN(value) ? null : value;
    } catch (e) {
      return null;
    }
  }

  function getWidth(el) {
    var inline = el.style.getPropertyValue(WIDTH_VAR);
    if (inline) return parseFloat(inline);
    return readPx(el, WIDTH_VAR, readPx(el, '--panel-width', 320));
  }

  function handleOf(el) {
    return el.querySelector('.split-pane-handle');
  }

  function syncAria(el, width) {
    var handle = handleOf(el);
    if (!handle) return;
    var limits = limitsOf(el);
    handle.setAttribute('aria-valuenow', String(Math.round(width)));
    handle.setAttribute('aria-valuemin', String(Math.round(limits.min)));
    handle.setAttribute('aria-valuemax', String(Math.round(limits.max)));
  }

  function setWidth(el, width, options) {
    var opts = options || {};
    var limits = limitsOf(el);
    var next = clamp(width, limits.min, limits.max);

    el.style.setProperty(WIDTH_VAR, next + 'px');
    syncAria(el, next);

    if (opts.persist !== false) remember(el, next);
    if (opts.silent !== true) {
      el.dispatchEvent(
        new CustomEvent('splitpaneresize', { bubbles: true, detail: { width: next } })
      );
    }
    return next;
  }

  function reset(el) {
    el.style.removeProperty(WIDTH_VAR);
    var width = getWidth(el);
    syncAria(el, width);

    var key = storageKey(el);
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        /* idem */
      }
    }

    el.dispatchEvent(
      new CustomEvent('splitpaneresize', { bubbles: true, detail: { width: width } })
    );
    return width;
  }

  /* O painel pode estar de qualquer um dos lados; o sinal do arraste inverte
     junto. Sem isto, .split-pane-start encolheria ao ser puxado para fora. */
  function isPanelAtStart(el) {
    return el.classList.contains('split-pane-start');
  }

  function enhance(el) {
    var handle = handleOf(el);
    if (!handle || el._splitPaneReady) return;
    el._splitPaneReady = true;

    handle.setAttribute('role', 'separator');
    handle.setAttribute('aria-orientation', 'vertical');
    if (!handle.hasAttribute('tabindex')) handle.setAttribute('tabindex', '0');
    if (!handle.hasAttribute('aria-label')) {
      handle.setAttribute('aria-label', 'Redimensionar painel');
    }

    var stored = recall(el);
    if (stored !== null) {
      setWidth(el, stored, { persist: false, silent: true });
    } else {
      syncAria(el, getWidth(el));
    }

    var startX = 0;
    var startWidth = 0;

    function onPointerMove(event) {
      var delta = event.clientX - startX;
      var next = isPanelAtStart(el) ? startWidth + delta : startWidth - delta;
      setWidth(el, next, { persist: false });
    }

    function onPointerUp() {
      el.removeAttribute('data-resizing');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      remember(el, getWidth(el));
    }

    handle.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      startX = event.clientX;
      startWidth = getWidth(el);
      el.setAttribute('data-resizing', '');
      /* Sem a captura, sair da alça no meio do arraste solta o painel. */
      if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });

    handle.addEventListener('dblclick', function () {
      reset(el);
    });

    handle.addEventListener('keydown', function (event) {
      var key = event.key;
      var limits = limitsOf(el);
      var step = event.shiftKey ? STEP_LARGE : STEP;
      var toward = isPanelAtStart(el) ? 1 : -1;
      var next = null;

      if (key === 'ArrowLeft') next = getWidth(el) + step * toward;
      else if (key === 'ArrowRight') next = getWidth(el) - step * toward;
      else if (key === 'Home') next = limits.min;
      else if (key === 'End') next = limits.max;
      else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        reset(el);
        return;
      }

      if (next === null) return;
      event.preventDefault();
      setWidth(el, next);
    });
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-split-pane]');
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

  window.ResultXSplitPane = {
    init: init,
    setWidth: setWidth,
    getWidth: getWidth,
    reset: reset,
  };
})();
