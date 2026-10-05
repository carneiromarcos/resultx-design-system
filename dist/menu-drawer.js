/**
 * ResultX Design System — Menu drawer
 * Production-ready reference implementation.
 *
 * Usage:
 *   <script src="dist/menu-drawer.js" defer></script>
 *
 * API:
 *   ResultXMenuDrawer.init(root)  — enhance every [data-menu-drawer]
 *   ResultXMenuDrawer.open(el[, invocador])   — invocador: where focus
 *                                               returns on close
 *   ResultXMenuDrawer.close(el)
 *   ResultXMenuDrawer.toggle(el[, invocador])
 *
 * Markup (works without this script — see "Without JavaScript"):
 *   <a class="header-float-icon header-float-menu" id="menu-abrir"
 *      href="#menu" data-menu-drawer-toggle="menu" aria-label="Abrir menu">☰</a>
 *   <section class="menu-drawer" id="menu" aria-label="Menu" data-menu-drawer
 *            data-menu-drawer-media="(max-width: 1023.98px)">
 *     <div class="menu-drawer-head">
 *       <span class="menu-drawer-label">Navegue</span>
 *       <a class="menu-drawer-close" href="#menu-abrir" data-menu-drawer-close
 *          aria-label="Fechar menu">✕</a>
 *     </div>
 *     <div class="menu-drawer-body">…</div>
 *   </section>
 *   <div class="menu-drawer-scrim" data-menu-drawer-scrim></div>
 *
 * Without JavaScript:
 *   The toggle is a real link to #menu and CSS :target opens the drawer; the
 *   close control links back to the toggle; following any link in the drawer
 *   changes the target and closes it. No focus trap, no scroll lock — but the
 *   navigation is reachable, which is the part that matters.
 *
 * With JavaScript:
 *   - The toggle and close links become real <button type="button">s (the
 *     id, classes, aria-label and children move over). Space and Enter work
 *     natively, and nothing navigates.
 *   - The drawer becomes role="dialog" aria-modal="true"; the toggle carries
 *     aria-controls and aria-expanded.
 *   - Opening moves focus to the first focusable item in the same frame (the
 *     CSS flips visibility instantly on open for this reason).
 *   - Tab and Shift+Tab are trapped inside while it is open.
 *   - Escape or the close button closes and returns focus to the toggle
 *     that opened it (event.currentTarget, never document.activeElement:
 *     Safari does not focus a clicked button, and with two toggles focus
 *     would go back to the wrong one). Opened through the API without an
 *     invoker, focus returns to whatever had it (if outside the drawer) or
 *     to the first toggle. The scrim closes too.
 *   - Following a link inside closes it WITHOUT pulling focus back, so focus
 *     lands where the link goes.
 *   - Closed = [inert], set the moment closing starts. The CSS keeps the
 *     panel visible for the 280 ms exit; inert keeps it out of Tab order and
 *     out of the accessibility tree during that slide. Removed on open,
 *     before focus moves in. Only the script sets it, so the no-JS :target
 *     fallback is unaffected.
 *   - Page scroll is locked on <html> while open and restored, not zeroed.
 *   - Optional data-menu-drawer-media closes the drawer when the query stops
 *     matching (e.g. the window grows into the desktop layout).
 *   - Dispatches 'menudrawertoggle' with detail { open }.
 */
;(function () {
  'use strict';

  var READY_ATTR = 'data-menu-drawer-ready';
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

  function focaveis(el) {
    var todos = el.querySelectorAll(FOCUSABLE);
    var visiveis = [];
    for (var i = 0; i < todos.length; i++) {
      /* Sem caixa = escondido. Um item invisível no ciclo de foco manda o
         usuário para o nada. */
      if (todos[i].getClientRects().length) visiveis.push(todos[i]);
    }
    return visiveis;
  }

  /* Troca um <a> de fallback por um <button> de verdade, levando junto id,
     classes, atributos e filhos. Um link com role="button" exigiria imitar
     o Espaço à mão; o botão já nasce certo. */
  function comoBotao(el) {
    if (el.tagName !== 'A') return el;
    var botao = document.createElement('button');
    botao.type = 'button';
    for (var i = 0; i < el.attributes.length; i++) {
      var attr = el.attributes[i];
      if (attr.name !== 'href') botao.setAttribute(attr.name, attr.value);
    }
    botao.removeAttribute('href');
    while (el.firstChild) botao.appendChild(el.firstChild);
    el.parentNode.replaceChild(botao, el);
    return botao;
  }

  function gatilhosDe(el) {
    return document.querySelectorAll('[data-menu-drawer-toggle="' + el.id + '"]');
  }

  function scrimDe(el) {
    if (el._scrim) return el._scrim;
    var vizinho = el.nextElementSibling;
    var scrim =
      vizinho && vizinho.hasAttribute('data-menu-drawer-scrim') ? vizinho : null;
    if (!scrim) {
      scrim = document.createElement('div');
      scrim.className = 'menu-drawer-scrim';
      scrim.setAttribute('data-menu-drawer-scrim', '');
      el.parentNode.insertBefore(scrim, el.nextSibling);
    }
    /* Decorativo: quem usa teclado fecha com Escape ou com o botão. */
    scrim.setAttribute('aria-hidden', 'true');
    el._scrim = scrim;
    return scrim;
  }

  function focarPrimeiro(el) {
    var alvos = focaveis(el);
    var alvo = alvos.length ? alvos[0] : el;
    alvo.focus();
    return document.activeElement === alvo;
  }

  function isOpen(el) {
    return el.hasAttribute(OPEN_ATTR);
  }

  function marcarGatilhos(el, aberto) {
    var gatilhos = gatilhosDe(el);
    for (var i = 0; i < gatilhos.length; i++) {
      gatilhos[i].setAttribute('aria-expanded', aberto ? 'true' : 'false');
    }
  }

  function emit(el, aberto) {
    el.dispatchEvent(
      new CustomEvent('menudrawertoggle', { bubbles: true, detail: { open: aberto } })
    );
  }

  /* Para onde o foco volta quando a gaveta é aberta pela API, sem um
     gatilho conhecido: quem tinha o foco, se ele estiver fora da gaveta;
     senão, o primeiro gatilho. */
  function invocadorPadrao(el) {
    var ativo = document.activeElement;
    if (ativo && ativo !== document.body && !el.contains(ativo)) return ativo;
    return gatilhosDe(el)[0] || null;
  }

  /* invocador: o gatilho que abriu (event.currentTarget). Não dá para
     confiar em document.activeElement: no Safari o clique não foca o botão,
     e com dois gatilhos o foco voltaria para o errado. */
  function open(el, invocador) {
    if (isOpen(el)) return;

    el._devolverFocoPara = invocador || invocadorPadrao(el);
    /* Sai do inert ANTES de focar: um elemento inerte não recebe foco. */
    el.removeAttribute('inert');
    el.setAttribute(OPEN_ATTR, '');
    scrimDe(el).setAttribute(OPEN_ATTR, '');
    marcarGatilhos(el, true);

    var raiz = document.documentElement;
    el._overflowAnterior = raiz.style.overflow;
    raiz.style.overflow = 'hidden';

    /* Foco síncrono: o CSS vira a visibilidade na hora ao abrir, então o
       primeiro item já pode receber foco neste mesmo quadro. Se a página
       tiver uma regra global que transiciona tudo (o padrão de
       reduced-motion com 0,01 ms), um ancestral ainda pode estar hidden
       agora: tenta de novo no quadro seguinte. */
    if (!focarPrimeiro(el)) {
      requestAnimationFrame(function () {
        if (isOpen(el) && !el.contains(document.activeElement)) focarPrimeiro(el);
      });
    }

    emit(el, true);
  }

  function close(el, opcoes) {
    if (!isOpen(el)) return;
    var devolverFoco = !opcoes || opcoes.devolverFoco !== false;

    /* Inerte já no início do fechamento. A visibilidade só vira hidden ao
       fim da saída (280 ms); sem isto, um Tab logo depois do Escape entrava
       na gaveta que ainda estava deslizando para fora. */
    el.setAttribute('inert', '');
    el.removeAttribute(OPEN_ATTR);
    scrimDe(el).removeAttribute(OPEN_ATTR);
    marcarGatilhos(el, false);

    document.documentElement.style.overflow = el._overflowAnterior || '';

    /* Devolver o foco a quem abriu. Sem isto ele volta ao topo da página e o
       usuário de teclado perde o lugar. */
    if (devolverFoco && el._devolverFocoPara && el._devolverFocoPara.focus) {
      el._devolverFocoPara.focus();
    }
    el._devolverFocoPara = null;

    emit(el, false);
  }

  function toggle(el, invocador) {
    if (isOpen(el)) close(el);
    else open(el, invocador);
  }

  function prenderTab(el, event) {
    var alvos = focaveis(el);
    if (!alvos.length) {
      event.preventDefault();
      return;
    }
    var primeiro = alvos[0];
    var ultimo = alvos[alvos.length - 1];
    var dentro = el.contains(document.activeElement);

    if (event.shiftKey && (document.activeElement === primeiro || !dentro)) {
      event.preventDefault();
      ultimo.focus();
    } else if (!event.shiftKey && (document.activeElement === ultimo || !dentro)) {
      event.preventDefault();
      primeiro.focus();
    }
  }

  function enhance(el) {
    if (el.hasAttribute(READY_ATTR)) return;
    if (!el.id) return; /* sem id não há como ligar o botão à gaveta */

    el.setAttribute(READY_ATTR, '');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    /* Fechada = inerte. Só o script põe o atributo: sem JS ele não existe e
       o :target continua abrindo a gaveta. */
    if (!isOpen(el)) el.setAttribute('inert', '');

    /* Se a página carregou com #id no endereço, o :target já não vale (o CSS
       só o aplica antes do READY_ATTR), e a gaveta começa fechada. */

    var gatilhos = gatilhosDe(el);
    for (var i = 0; i < gatilhos.length; i++) {
      var gatilho = comoBotao(gatilhos[i]);
      gatilho.setAttribute('aria-controls', el.id);
      gatilho.setAttribute('aria-expanded', 'false');
      gatilho.addEventListener('click', function (event) {
        toggle(el, event.currentTarget);
      });
    }

    var fechar = el.querySelectorAll('[data-menu-drawer-close]');
    for (var j = 0; j < fechar.length; j++) {
      comoBotao(fechar[j]).addEventListener('click', function () {
        close(el);
      });
    }

    scrimDe(el).addEventListener('click', function () {
      close(el);
    });

    el.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) close(el, { devolverFoco: false });
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen(el)) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        close(el);
      } else if (event.key === 'Tab') {
        prenderTab(el, event);
      }
    });

    /* Uma gaveta presa depois de a janela crescer é um painel órfão: some o
       motivo dela existir e sobra a trava de rolagem. */
    var consulta = el.getAttribute('data-menu-drawer-media');
    if (consulta && window.matchMedia) {
      var mq = window.matchMedia(consulta);
      var aoMudar = function () {
        if (!mq.matches) close(el, { devolverFoco: false });
      };
      if (mq.addEventListener) mq.addEventListener('change', aoMudar);
      else if (mq.addListener) mq.addListener(aoMudar);
    }
  }

  function init(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll('[data-menu-drawer]');
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

  window.ResultXMenuDrawer = {
    init: init,
    open: open,
    close: close,
    toggle: toggle,
  };
})();
