'use strict';

const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const {
  resolve
} = require('./lib.cjs');
const definitions = require('../../catalog/legacy.config.cjs');
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
function sourceRules(root, file = 'components/components.css', seen = new Set()) {
  if (seen.has(file)) return [];
  seen.add(file);
  const tree = postcss.parse(fs.readFileSync(path.join(root, file), 'utf8')),
    rules = [];
  tree.each(n => {
    if (n.type === 'atrule' && n.name === 'import') {
      const m = /['"]([^'"]+)['"]/.exec(n.params);
      if (m) rules.push(...sourceRules(root, path.posix.join(path.posix.dirname(file), m[1]), seen));
    }
    if (n.type === 'rule') rules.push(n);
  });
  return rules;
}
function decl(rules, selectors, property, fallback) {
  let value = fallback;
  for (const selector of selectors) for (const rule of rules) if (postcss.list.comma(rule.selector).includes(selector)) rule.walkDecls(property, d => {
    value = d.value;
  });
  if (value === undefined) throw Error(`Declaração ausente: ${selectors.join(' / ')} ${property}`);
  return value;
}
function rgba(value) {
  const s = value.trim();
  if (s === 'transparent' || s === 'none') return [0, 0, 0, 0];
  const h = /^#([\da-f]{3,8})$/i.exec(s);
  if (h) {
    let x = h[1];
    if (x.length === 3 || x.length === 4) x = [...x].map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16)).concat(x.length === 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1);
  }
  if (/^rgba?\(/.test(s)) {
    const a = s.match(/[\d.]+/g).map(Number);
    return [a[0], a[1], a[2], a[3] ?? 1];
  }
  throw Error('Cor sem interpretação no relatório: ' + s);
}
function over(a, b) {
  return a.slice(0, 3).map((v, i) => v * a[3] + b[i] * (1 - a[3])).concat(1);
}
function contrast(a, b) {
  const lum = c => c.slice(0, 3).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0);
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}
function evaluate(expression, values) {
  return expression.replace(/var\((--[\w-]+)\)/g, (_, k) => resolve(values, k));
}
// Referências às declarações do CSS real; nenhum valor visual é mantido neste índice.
const models = {
  button: [['#legacy-primary', ['.btn', '.btn-primary']], ['#legacy-secondary', ['.btn', '.btn-secondary']], ['#legacy-ghost', ['.btn', '.btn-ghost']], ['#legacy-danger', ['.btn', '.btn-danger']], ['#legacy-success', ['.btn', '.btn-success']], ['#legacy-social', ['.btn-social']]],
  card: [['#legacy-card-text', ['.card-text'], '.card']],
  field: [['#legacy-email', ['.form-input']], ['#legacy-select', ['.form-select']], ['#legacy-help', ['.form-hint']]],
  'status-badge': [['#legacy-badge-success', ['.badge', '.badge-success']], ['#legacy-badge-warning', ['.badge', '.badge-warning']], ['#legacy-badge-error', ['.badge', '.badge-error']]],
  'empty-state': [['#legacy-empty-text', ['.empty-state-text']]],
  'confirm-dialog': [['.modal-title', ['.modal-title'], '.modal']],
  'stat-card': [['[data-family=standard] .stat-label', ['.stat-label'], '.stat-card'], ['.stat-variation.up', ['.stat-variation', '.stat-variation.up'], '.stat-card'], ['.stat-variation.down', ['.stat-variation', '.stat-variation.down'], '.stat-card'], ['.stat-card-mini-label', ['.stat-card-mini-label'], '.stat-card']],
  'data-table': [['[data-family=basic] th', ['th'], '.table-card'], ['[data-family=basic] .td-name', ['td', '.td-name'], '.table-card'], ['[data-family=basic] .td-score', ['td', '.td-score'], '.table-card']],
  navigation: [['[data-family=sidebar] .sidebar-item:not([aria-current])', ['.sidebar-item'], '.sidebar'], ['[data-family=tabs] .tab.active', ['.tab', '.tab.active']], ['[data-family=breadcrumb] .breadcrumb-item:not([aria-current])', ['.breadcrumb-item']]],
  layout: [['.layout-centered-subtitle', ['.layout-centered-subtitle'], '.layout-centered-card']],
  segmented: [['[data-family=base] .segmented-option:not(:has(:checked))', ['.segmented-option'], '.segmented'], ['[data-family=base] .segmented-option:has(:checked)', ['.segmented-option', '.segmented-option:has(input[type="radio"]:checked)'], '.segmented']],
  'list-item': [['[data-family=default] .list-item-title', ['.list-item-title']], ['[data-family=default] .list-item-meta', ['.list-item-meta']], ['[data-family=current] .list-item-title', ['.list-item-title'], '.list-item[aria-current]']]
};
function pairsFor(root, definition, values) {
  const rules = sourceRules(root),
    bodyExpression = decl(rules, ['body'], 'background'),
    background = rgba(evaluate(bodyExpression, values)),
    pairs = [];
  for (const [target, selectors, parent] of models[definition.id]) {
    const parentExpression = parent ? decl(rules, [parent], 'background', bodyExpression) : bodyExpression;
    const parentColor = over(rgba(evaluate(parentExpression, values)), background);
    const colorExpression = decl(rules, selectors, 'color', 'var(--text-primary)');
    const fillExpression = decl(rules, selectors, 'background', 'transparent');
    const fill = over(rgba(evaluate(fillExpression, values)), parentColor);
    const ink = over(rgba(evaluate(colorExpression, values)), fill);
    pairs.push({
      target,
      kind: 'texto',
      minimum: 4.5,
      foreground: ink.slice(0, 3),
      background: fill.slice(0, 3),
      ratio: contrast(ink, fill),
      foregroundSource: colorExpression,
      backgroundSource: fillExpression,
      parentSource: parentExpression
    });
    let border = decl(rules, selectors, 'border-color', '');
    if (!border) {
      const shorthand = decl(rules, selectors, 'border', '');
      border = /(var\(--[\w-]+\)|rgba?\([^)]*\)|#[\da-f]+|transparent)\s*$/i.exec(shorthand)?.[1] || '';
    }
    // Sem borda declarada não se inventa um contorno. O par de preenchimento é informado.
    if (!border) {
      if (selectors.some(s => s.startsWith('.btn'))) pairs.push({
        target,
        kind: 'limite sem borda',
        minimum: 3,
        foreground: fill.slice(0, 3),
        background: parentColor.slice(0, 3),
        ratio: contrast(fill, parentColor),
        foregroundSource: fillExpression,
        backgroundSource: parentExpression
      });
      continue;
    }
    const color = over(rgba(evaluate(border, values)), fill);
    pairs.push({
      target,
      kind: 'borda',
      minimum: 3,
      foreground: color.slice(0, 3),
      background: parentColor.slice(0, 3),
      ratio: contrast(color, parentColor),
      foregroundSource: border,
      backgroundSource: parentExpression
    });
  }
  return pairs;
}
function radios() {
  const variants = {
    base: '',
    stacked: 'segmented-stacked',
    small: 'segmented-sm',
    large: 'segmented-lg',
    block: 'segmented-block',
    chips: 'segmented-chips',
    disabled: ''
  };
  const labels = {
    base: 'Opções lado a lado',
    stacked: 'Ícone acima do texto',
    small: 'Pequeno',
    large: 'Grande',
    block: 'Largura disponível',
    chips: 'Opções que quebram linha',
    disabled: 'Opção indisponível'
  };
  return Object.entries(variants).map(([id, variant]) => `<section data-family="${id}"><h2>${labels[id]}</h2><fieldset class="segmented ${variant}"><legend class="segmented-legend">Modo de exemplo</legend>${['Humano', 'Agente', 'Observar'].map((label, i) => `<label class="segmented-option"><input type="radio" name="modo-${id}" value="${i}"${i === 0 ? ' checked' : ''}${id === 'disabled' && i === 2 ? ' disabled' : ''}>${id === 'stacked' ? '<span class="segmented-icon" aria-hidden="true">+</span>' : ''}<span class="segmented-label">${label}</span></label>`).join('')}</fieldset>${id === 'disabled' ? '<p>Conclua a configuração para liberar a terceira opção.</p>' : ''}</section>`).join('');
}
function renderLegacy(root, definition, values, revision) {
  let samples = fs.readFileSync(path.join(root, definition.recipe), 'utf8').replace('{{RADIOS}}', radios());
  const pairs = pairsFor(root, definition, values),
    failed = pairs.filter(p => p.ratio < p.minimum);
  const summary = failed.length ? 'Há pares abaixo do mínimo nesta marca e aparência. O texto ou o limite pode ser difícil de perceber. Próximo passo: avaliar os pares com os valores já existentes; se precisar mudar a paleta, levar à PR própria de cores com UX.' : 'Os pares calculados abaixo atendem aos mínimos. Isso não certifica as demais variantes ou todo o produto.';
  return {
    contract: {
      tokens: []
    },
    pairs,
    replacements: {
      TITLE: esc(definition.title),
      PENDING: `<aside class="catalog-pending"><p>${esc(definition.pending || 'Esta é uma demonstração de apresentação. As ações não enviam dados.')}</p><p>Falta conferir todas as variantes, estados, bordas e foco antes de aprovar esta família. Próximo passo: concluir a medição e revisar as combinações da marca.</p></aside>`,
      SAMPLES: samples,
      KEYBOARD: esc(definition.keyboard || 'Tab chega aos links, botões e campos nativos. Enter segue o link; Enter e Espaço acionam o botão. Os comportamentos de aplicativo que estão pendentes não são simulados.'),
      CONTRAST: `<p data-legacy-contrast>${summary}</p><details><summary>Ver detalhes</summary><p>Pares calculados das declarações atuais e conferidos no navegador. Mínimos: 4,5:1 no texto, 3:1 no contorno. Não é inspeção por pixel nem prova de leitor de tela.</p><ul>${pairs.map(p => `<li data-legacy-pair data-target="${esc(p.target)}" data-kind="${p.kind}" data-ratio="${p.ratio}" data-minimum="${p.minimum}"${p.ratio < p.minimum ? ' data-pending="true"' : ''}>${p.kind}: ${p.ratio.toFixed(2)}:1; mínimo ${p.minimum}:1. ${esc(p.foregroundSource)} / ${esc(p.backgroundSource)}${p.ratio < p.minimum ? '. Pendente: avaliar valores existentes; mudança de paleta na PR própria de cores com UX.' : ''}</li>`).join('')}</ul></details>`,
      TECH: `<p>Origem: <code>docs/components/${definition.doc}.md</code>, <code>${definition.recipe}</code> e <code>components/components.css</code>. Revisão: ${esc(revision.label)}.</p><p>Somente a organização da amostra tem geometria adaptada: menus e janelas ficam no fluxo, sem cobrir o catálogo. Cores, fontes, raios e estados continuam sendo os CSS do DS.</p><pre><code>${esc(samples)}</code></pre>`
    }
  };
}
module.exports = {
  definitions,
  renderLegacy,
  sourceRules,
  decl,
  rgba,
  over,
  contrast
};
