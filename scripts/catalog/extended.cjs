'use strict';

const fs = require('fs'),
  path = require('path');
const {
  sourceRules,
  decl,
  rgba,
  over,
  contrast
} = require('./legacy.cjs');
const {
  resolve
} = require('./lib.cjs');
const definitions = require('../../catalog/extended.config.cjs');
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
const icon = cls => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>`;
// Amostra opaca/translúcida de repouso, referenciada no CSS, não uma cópia de valores.
const models = {
  'sidebar-overlay': [['.sidebar-item', ['.sidebar-item'], '.sidebar']],
  'menu-drawer': [['.menu-drawer-label', ['.menu-drawer-label'], '.menu-drawer']],
  'split-pane': [['.split-pane-side', ['.split-pane-side'], '.split-pane-side']],
  'header-float': [['.header-float-brand', ['.header-float-brand'], '.header-float-bar']],
  disclosure: [['.disclosure-summary', ['.disclosure-summary'], '.disclosure']],
  'cta-dock': [['.cta-dock-text', ['.cta-dock-text'], '.cta-dock']],
  tooltip: [['.tooltip', ['.tooltip'], '.tooltip']],
  toast: ['success', 'warning', 'error', 'info'].map(s => [`.toast-${s}`, ['.toast', `.toast-${s}`]]),
  progress: [['.progress-label', ['.progress-label']]],
  icons: [['.btn-icon', ['.btn-icon']]],
  composite: [['.view-toggle-btn.active', ['.view-toggle-btn', '.view-toggle-btn.active'], '.view-toggle']],
  'cta-panel': []
};
function pairsFor(root, definition, values) {
  const rules = sourceRules(root).concat(definition.id === 'icons' ? sourceRules(root, 'components/icons.css') : []),
    body = decl(rules, ['body'], 'background');
  const evalColor = s => rgba(s.replace(/var\((--[\w-]+)\)/g, (_, k) => resolve(values, k)));
  const base = evalColor(body),
    pairs = [];
  for (const [target, selectors, parent] of models[definition.id]) {
    const parentExpr = parent ? decl(rules, [parent], 'background', body) : body;
    const bg = over(evalColor(parentExpr), base);
    const color = decl(rules, selectors, 'color', 'var(--text-primary)');
    const fillExpr = decl(rules, selectors, 'background', 'transparent');
    const fill = over(evalColor(fillExpr), bg),
      ink = over(evalColor(color), fill);
    pairs.push({
      target,
      kind: definition.id === 'icons' ? 'ícone' : 'texto',
      minimum: definition.id === 'icons' ? 3 : 4.5,
      ratio: contrast(ink, fill),
      foreground: ink.slice(0, 3),
      background: fill.slice(0, 3),
      foregroundSource: color,
      backgroundSource: fillExpr,
      parentSource: parentExpr
    });
  }
  return pairs;
}
function renderExtended(root, d, values, revision, brand, theme) {
  let html = fs.readFileSync(path.join(root, d.recipe), 'utf8');
  html = html.replace('{{BRAND}}', esc(brand.label));
  html = html.replaceAll('data-disclosure-id="catalog-', 'data-disclosure-id="catalog-' + brand.id + '-' + theme + '-');
  const labels = ['Padrão', 'Abaixo', 'À direita', 'À esquerda'];
  html = html.replace('{{TOOLTIPS}}', ['', 'tooltip-bottom', 'tooltip-right', 'tooltip-left'].map((cls, i) => `<button class="btn btn-secondary tooltip-wrapper" type="button" aria-label="Ajuda: ${labels[i]}">Ajuda ${labels[i].toLowerCase()}<span class="tooltip ${cls}" role="tooltip">Ajuda</span></button>`).join(''));
  html = html.replace('{{TOASTS}}', ['success', 'warning', 'error', 'info'].map((s, i) => `<div class="toast toast-${s}"><span>${['Exemplo salvo.', 'Confira os dados.', 'Não foi possível salvar.', 'Uma atualização está disponível.'][i]}</span><button class="btn-icon btn-icon-sm toast-dismiss" type="button" aria-label="Dispensar mensagem ${i + 1}">×</button></div>`).join(''));
  html = html.replace('{{ICONS}}', ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(s => `<span>${icon('icon-' + s)} ${s}</span>`).join(''));
  html = html.replace('{{WRAPPERS}}', ['accent', 'success', 'warning', 'error', 'info', 'surface'].map(s => `<span class="icon-wrapper icon-wrapper-lg icon-wrapper-${s}">${icon('icon-lg')}</span>`).join(''));
  html = html.replace('{{ICON_COLORS}}', ['primary', 'secondary', 'muted', 'accent', 'success', 'warning', 'error', 'info'].map(s => `<span>${icon('icon-md icon-' + s)} ${s}</span>`).join(''));
  html = html.replace('{{WRAPPER_SIZES}}', ['sm', 'md', 'lg', 'xl'].map(s => `<span class="icon-wrapper icon-wrapper-${s} icon-wrapper-surface icon-wrapper-round">${icon('icon-sm')}</span>`).join(''));
  html = html.replace('{{ICON_BUTTONS}}', ['', 'btn-icon-subtle', 'btn-icon-primary', 'btn-icon-danger'].map((s, i) => `<button class="btn-icon ${s}" type="button" aria-label="Ação de exemplo ${i + 1}">${icon('icon-md')}</button>`).join(''));
  let bodyHead = '',
    bodyTail = '';
  html = html.replace(/<template data-catalog-(head|tail)>([\s\S]*?)<\/template>/g, (_, where, content) => {
    if (where === 'head') bodyHead += content;else bodyTail += content;
    return '';
  });
  const pairs = pairsFor(root, d, values),
    failed = pairs.filter(p => p.ratio < p.minimum);
  const staticOnly = ['toast', 'composite'].includes(d.id),
    native = ['tooltip', 'progress', 'icons', 'cta-panel'].includes(d.id);
  const pending = staticOnly ? 'Esta amostra mostra só o visual. Faltam os comportamentos de atualizar, dispensar e escolher. Próximo passo: definir e autorizar esses comportamentos antes de usá-la como exemplo funcional.' : native ? 'Este exemplo usa a apresentação e os controles nativos. Faltam a revisão visual humana e a avaliação com leitor de tela. Próximo passo: conferir esta marca e aparência antes de aprovar o uso no produto.' : 'O comportamento mostrado já faz parte do DS. Faltam a revisão visual humana e a avaliação com leitor de tela. Próximo passo: conferir esta marca e aparência antes de aprovar o uso no produto.';
  const scope = d.id === 'icons' ? 'O ícone medido atende ao mínimo de 3:1 no par de repouso. Isso não aprova todos os ícones, botões e estados.' : d.id === 'cta-panel' ? 'O painel tem fundo em camadas e título em degradê. O contraste desses pixels ainda não foi medido. Próximo passo: medir texto, botões e limites sobre os fundos reais; não há aprovação de contraste desta amostra.' : 'A amostra de texto em repouso ' + (failed.length ? 'tem pares abaixo de 4,5:1. Falta revisar esses pares com os valores existentes; se exigirem paleta nova, levar à PR própria de cores com UX.' : 'atende aos mínimos medidos. Isso não aprova todas as variantes ou estados.');
  return {
    bodyHead,
    bodyTail,
    contract: {
      tokens: []
    },
    pairs,
    replacements: {
      TITLE: esc(d.title),
      PENDING: `<aside class="catalog-pending"><p>${esc(pending)}</p><p>Falta medir todos os estados, bordas, anéis e fundos em movimento. Próximo passo: avaliação completa; esta página não certifica acessibilidade.</p></aside>`,
      SAMPLES: html,
      KEYBOARD: esc(d.keyboard),
      CONTRAST: `<p data-extended-contrast>${esc(scope)}</p><details><summary>Ver detalhes</summary><p>Cálculo de uma amostra em repouso, sem inspeção por pixel, hover ou foco. Mínimo do texto: 4,5:1; ícones, bordas e foco: 3:1. Bordas e foco ainda pendentes.</p><ul>${pairs.map(p => `<li data-extended-pair data-target="${esc(p.target)}" data-ratio="${p.ratio}"${p.ratio < p.minimum ? ' data-pending="true"' : ''}>${p.kind === 'ícone' ? 'Ícone' : 'Texto'} ${p.ratio.toFixed(2)}:1: ${esc(p.foregroundSource)} / ${esc(p.backgroundSource)}${p.ratio < p.minimum ? '. Pendente: revisar com Supervisor e UX.' : ''}</li>`).join('')}</ul></details>`,
      TECH: `<p>Origem: docs/components/${esc(d.doc)}.md, ${esc(d.recipe)} e o CSS distribuído do DS. Revisão ${esc(revision.label)}.</p><p>Os arquivos publicados são copiados sem alteração. A vitrine organiza o conteúdo, sem mudar o componente.</p><pre><code>${esc(html + bodyHead + bodyTail)}</code></pre>`
    }
  };
}
module.exports = {
  definitions,
  renderExtended
};
