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
 *   ResultXComposer.fill(input, t) — put text in it, grow it, focus it at the
 *                                    end. Never sends.
 *   ResultXComposer.supportsNative — true when the browser grows it natively
 *
 * Behavior:
 *   - Does ONE thing: grow the field with its content where
 *     `field-sizing: content` is missing. Where the browser supports it, this
 *     script attaches nothing at all — the CSS already did the work.
 *   - The ceiling comes from the CSS max-height, never from a number in here.
 *   - Nothing about Enter-to-send, "/" or "@" lives in this file. That is
 *     product policy, and the DS has no business deciding it.
 *   - Suggestion chips: a click on [data-composer-fill] fills the field and
 *     focuses it, and stops there — the person reviews and sends. The text is
 *     the attribute value, or the chip's own text when the value is empty.
 *     The field is #<data-composer-target>, else the .composer-input of the
 *     chip's [data-composer], else the first one on the page. An 'input'
 *     event is dispatched so a product's own listeners (counters, enabling
 *     the send button) see the change.
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

  function fill(input, text) {
    if (!input) return;
    input.value = text;
    resize(input);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    if (input.setSelectionRange) input.setSelectionRange(text.length, text.length);
  }

  function inputForChip(chip) {
    var alvo = chip.getAttribute('data-composer-target');
    if (alvo) return document.getElementById(alvo);
    var composer = chip.closest('[data-composer]');
    if (composer) return composer.querySelector('.composer-input');
    return document.querySelector('.composer-input');
  }

  /* Delegado no documento: chips criados depois do init tambem funcionam. */
  document.addEventListener('click', function (event) {
    var chip = event.target && event.target.closest
      ? event.target.closest('[data-composer-fill]')
      : null;
    if (!chip) return;
    var texto = chip.getAttribute('data-composer-fill') || chip.textContent.trim();
    fill(inputForChip(chip), texto);
  });

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
    fill: fill,
    supportsNative: supportsNative,
  };
})();
