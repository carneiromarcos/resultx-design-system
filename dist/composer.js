/**
 * ResultX Design System — Composer
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/composer.js"></script>
 *
 * API:
 *   ResultXComposer.init(root)     — enhance every [data-composer]
 *   ResultXComposer.resize(input)  — recompute one field's height
 *   ResultXComposer.clear(input)   — empty it and collapse it back
 *   ResultXComposer.supportsNative — true when the browser grows it natively
 *
 * Behavior:
 *   - Does ONE thing: grow the field with its content where
 *     `field-sizing: content` is missing. Where the browser supports it, this
 *     script attaches nothing at all — the CSS already did the work.
 *   - The ceiling comes from the CSS max-height, never from a number in here.
 *   - Nothing about Enter-to-send, "/" or "@" lives in this file. That is
 *     product policy, and the DS has no business deciding it.
 */
;(function () {
  'use strict';

  var READY_ATTR = 'data-composer-ready';

  /* CSS.supports faz a pergunta certa: "este navegador entende a
     propriedade?". Testar user-agent seria adivinhar. */
  var supportsNative =
    typeof CSS !== 'undefined' &&
    !!CSS.supports &&
    CSS.supports('field-sizing', 'content');

  function resize(input) {
    if (!input || supportsNative) return;
    /* Zerar antes de medir: sem isso o scrollHeight nunca diminui e o campo
       cresce para sempre. */
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
  }

  function clear(input) {
    if (!input) return;
    input.value = '';
    input.style.height = '';
    resize(input);
  }

  function enhance(el) {
    if (el.hasAttribute(READY_ATTR)) return;
    var input = el.querySelector('.composer-input');
    if (!input) return;

    el.setAttribute(READY_ATTR, '');
    if (supportsNative) return;

    input.addEventListener('input', function () {
      resize(input);
    });

    /* Colar um bloco de texto nao dispara 'input' em todo navegador. */
    input.addEventListener('paste', function () {
      window.setTimeout(function () {
        resize(input);
      }, 0);
    });

    resize(input);
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-composer]');
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

  window.ResultXComposer = {
    init: init,
    resize: resize,
    clear: clear,
    supportsNative: supportsNative,
  };
})();
