/**
 * DOM mínimo para testar os scripts de dist/ no Jest sem jsdom.
 *
 * Cobre só o que dist/menu-drawer.js e dist/sidebar-overlay.js usam: árvore
 * de elementos, atributos, eventos com bolha e currentTarget, foco
 * (respeitando [inert]), offsetParent, matchMedia controlável e seletores
 * simples (tag, .classe, [attr], [attr="v"], :not(...), listas com vírgula;
 * sem combinadores).
 * Como no Safari, element.click() NÃO move o foco — é justamente o caso
 * que os testes precisam reproduzir.
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');

/* ── Seletores ───────────────────────────────────────────────────────────── */
function topLevelSplit(texto, sep) {
  const partes = [];
  let nivel = 0;
  let atual = '';
  for (const ch of texto) {
    if (ch === '(' || ch === '[') nivel++;
    if (ch === ')' || ch === ']') nivel--;
    if (ch === sep && nivel === 0) {
      partes.push(atual.trim());
      atual = '';
    } else atual += ch;
  }
  partes.push(atual.trim());
  return partes;
}

function casaComposto(el, sel) {
  let resto = sel;
  const tag = /^[a-z][a-z0-9-]*/i.exec(resto);
  if (tag) {
    if (el.tagName !== tag[0].toUpperCase()) return false;
    resto = resto.slice(tag[0].length);
  }
  while (resto.length) {
    let m;
    if ((m = /^\.([\w-]+)/.exec(resto))) {
      if (!el.className.split(/\s+/).includes(m[1])) return false;
    } else if ((m = /^\[([\w-]+)(?:="([^"]*)")?\]/.exec(resto))) {
      if (!el.hasAttribute(m[1])) return false;
      if (m[2] !== undefined && el.getAttribute(m[1]) !== m[2]) return false;
    } else if ((m = /^:not\((.+?\])\)/.exec(resto))) {
      if (casaComposto(el, m[1])) return false;
    } else {
      throw new Error(`mini-dom: seletor não suportado: ${sel}`);
    }
    resto = resto.slice(m[0].length);
  }
  return true;
}

const casa = (el, seletor) => topLevelSplit(seletor, ',').some((s) => casaComposto(el, s));

/* ── Nós ─────────────────────────────────────────────────────────────────── */
class MiniEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.bubbles = !!init.bubbles;
    this.detail = init.detail;
    this.key = init.key;
    this.shiftKey = !!init.shiftKey;
    this.defaultPrevented = false;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}

class MiniNode {
  constructor(doc, tagName) {
    this.ownerDocument = doc;
    this.tagName = tagName.toUpperCase();
    this._attrs = new Map();
    this.children = [];
    this.parentNode = null;
    this._listeners = {};
    this.style = {};
  }

  /* atributos */
  get attributes() {
    return [...this._attrs].map(([name, value]) => ({ name, value }));
  }
  getAttribute(n) {
    return this._attrs.has(n) ? this._attrs.get(n) : null;
  }
  setAttribute(n, v) {
    this._attrs.set(n, String(v));
    /* Como o navegador: se o foco está numa subárvore que fica inerte, ele
       cai no <body>. */
    const doc = this.ownerDocument;
    if (n === 'inert' && doc && this.contains(doc.activeElement)) doc.activeElement = doc.body;
  }
  hasAttribute(n) {
    return this._attrs.has(n);
  }
  removeAttribute(n) {
    this._attrs.delete(n);
  }
  get id() {
    return this.getAttribute('id') || '';
  }
  set className(v) {
    this.setAttribute('class', v);
  }
  get className() {
    return this.getAttribute('class') || '';
  }
  set type(v) {
    this.setAttribute('type', v);
  }
  set hidden(v) {
    if (v) this.setAttribute('hidden', '');
    else this.removeAttribute('hidden');
  }
  get hidden() {
    return this.hasAttribute('hidden');
  }

  /* árvore */
  get firstChild() {
    return this.children[0] || null;
  }
  get nextElementSibling() {
    if (!this.parentNode) return null;
    const irmaos = this.parentNode.children;
    return irmaos[irmaos.indexOf(this) + 1] || null;
  }
  get nextSibling() {
    return this.nextElementSibling;
  }
  appendChild(filho) {
    if (filho.parentNode) filho.parentNode.removeChild(filho);
    filho.parentNode = this;
    this.children.push(filho);
    return filho;
  }
  removeChild(filho) {
    this.children.splice(this.children.indexOf(filho), 1);
    filho.parentNode = null;
    return filho;
  }
  insertBefore(novo, ref) {
    if (!ref) return this.appendChild(novo);
    if (novo.parentNode) novo.parentNode.removeChild(novo);
    novo.parentNode = this;
    this.children.splice(this.children.indexOf(ref), 0, novo);
    return novo;
  }
  replaceChild(novo, velho) {
    const i = this.children.indexOf(velho);
    if (novo.parentNode) novo.parentNode.removeChild(novo);
    this.children[i] = novo;
    novo.parentNode = this;
    velho.parentNode = null;
    return velho;
  }
  contains(no) {
    for (let n = no; n; n = n.parentNode) if (n === this) return true;
    return false;
  }
  *descendentes() {
    for (const c of this.children) {
      yield c;
      yield* c.descendentes();
    }
  }
  querySelectorAll(sel) {
    return [...this.descendentes()].filter((n) => casa(n, sel));
  }
  querySelector(sel) {
    return this.querySelectorAll(sel)[0] || null;
  }
  closest(sel) {
    for (let n = this; n && n.tagName; n = n.parentNode) if (casa(n, sel)) return n;
    return null;
  }

  /* layout e foco: tudo é "visível", exceto o que tem [hidden] na linha */
  getClientRects() {
    for (let n = this; n && n.tagName; n = n.parentNode) if (n.hidden) return [];
    return [{}];
  }
  /* Como no navegador: nulo quando o elemento não é renderizado. */
  get offsetParent() {
    return this.getClientRects().length ? this.parentNode : null;
  }
  get inertEfetivo() {
    for (let n = this; n && n.tagName; n = n.parentNode) if (n.hasAttribute('inert')) return true;
    return false;
  }
  /* STUB de :disabled — só o necessário para os testes, não o algoritmo do
     navegador inteiro: o próprio [disabled], ou um ancestral
     <fieldset disabled> fora do primeiro <legend> dele (a exceção da spec).
     Qualquer outro seletor vai para o casador simples. */
  matches(sel) {
    if (sel !== ':disabled') return casa(this, sel);
    if (this.hasAttribute('disabled')) return true;
    for (let n = this.parentNode; n && n.tagName; n = n.parentNode) {
      if (n.tagName === 'FIELDSET' && n.hasAttribute('disabled')) {
        const legenda = n.children.find((c) => c.tagName === 'LEGEND');
        if (!(legenda && legenda.contains(this))) return true;
      }
    }
    return false;
  }

  /* Elemento inerte (ou dentro de um) ou desabilitado não recebe foco: a
     chamada é ignorada, como no navegador. */
  focus() {
    if (this.inertEfetivo) return;
    if (this.matches(':disabled')) return;
    this.ownerDocument.activeElement = this;
  }

  /* eventos */
  addEventListener(tipo, fn) {
    (this._listeners[tipo] = this._listeners[tipo] || []).push(fn);
  }
  dispatchEvent(ev) {
    ev.target = ev.target || this;
    for (let n = this; n; n = ev.bubbles ? n.parentNode : null) {
      ev.currentTarget = n;
      for (const fn of n._listeners[ev.type] || []) fn.call(n, ev);
    }
    return !ev.defaultPrevented;
  }
  /* Como no Safari: o clique não foca o botão. */
  click() {
    this.dispatchEvent(new MiniEvent('click', { bubbles: true }));
  }
}

/** Monta documento + janela e devolve um ajudante `el(tag, attrs, ...filhos)`. */
function criarDocumento() {
  const doc = new MiniNode(null, '#document');
  doc.ownerDocument = doc;
  doc.readyState = 'complete';
  doc.createElement = (tag) => new MiniNode(doc, tag);
  doc.documentElement = doc.appendChild(doc.createElement('html'));
  doc.body = doc.documentElement.appendChild(doc.createElement('body'));
  doc.activeElement = doc.body;

  const el = (tag, attrs = {}, ...filhos) => {
    const n = doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    for (const f of filhos) n.appendChild(f);
    return n;
  };

  const quadros = [];
  /* Uma consulta só, controlável: `midia(false)` simula a janela saindo da
     faixa (ex.: crescer além de 1024 px) e dispara os ouvintes de 'change'. */
  const consulta = { matches: true, ouvintes: [] };
  consulta.addEventListener = (tipo, fn) => {
    if (tipo === 'change') consulta.ouvintes.push(fn);
  };
  const midia = (casa) => {
    consulta.matches = casa;
    consulta.ouvintes.forEach((fn) => fn({ matches: casa }));
  };
  const janela = {
    matchMedia: () => consulta,
  };
  const contexto = {
    window: janela,
    document: doc,
    CustomEvent: MiniEvent,
    requestAnimationFrame: (fn) => quadros.push(fn),
  };
  janela.window = janela;

  /** Executa um script de dist/ neste documento. */
  const carregar = (...p) => {
    const codigo = fs.readFileSync(path.join(__dirname, '..', '..', ...p), 'utf-8');
    vm.runInNewContext(codigo, contexto);
    return janela;
  };

  const tecla = (key, extra = {}) =>
    doc.dispatchEvent(new MiniEvent('keydown', { key, bubbles: true, ...extra }));

  const rodarQuadros = () => quadros.splice(0).forEach((fn) => fn());

  return { doc, el, carregar, tecla, rodarQuadros, midia };
}

module.exports = { criarDocumento };
