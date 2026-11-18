'use strict';

const fs = require('fs'),
  path = require('path'),
  postcss = require('postcss');
const definitions = require('../../catalog/data.config.cjs');
const {
  sourceRules,
  decl,
  rgba,
  over,
  contrast
} = require('./legacy.cjs');
const {
  declarations
} = require('./lib.cjs');
const {
  mixOklabChannels
} = require('../lib/color');
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
function resolveExpression(value, env, seen = []) {
  const start = value.indexOf('var(');
  if (start < 0) return value;
  let depth = 1,
    end = start + 4;
  for (; end < value.length && depth; end++) {
    if (value[end] === '(') depth++;else if (value[end] === ')') depth--;
  }
  if (depth) throw Error('var incompleto: ' + value);
  const args = postcss.list.comma(value.slice(start + 4, end - 1)),
    name = args[0].trim();
  if (seen.includes(name)) throw Error('Ciclo na cor: ' + name);
  const source = env[name] ?? args.slice(1).join(',');
  if (!source) throw Error('Papel vazio: ' + name);
  return value.slice(0, start) + resolveExpression(source, env, [...seen, name]) + resolveExpression(value.slice(end), env, seen);
}
const hex = c => '#' + c.slice(0, 3).map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
function color(expression, env) {
  const s = resolveExpression(expression, env).trim();
  if (s.startsWith('color-mix(')) {
    const [space, left, right] = postcss.list.comma(s.slice(10, -1)),
      m = /^(.*?)\s+([\d.]+)%$/.exec(left.trim());
    if (!m || !right) throw Error('Mistura não suportada: ' + s);
    const a = color(m[1], env),
      b = color(right, env),
      weight = Number(m[2]) / 100;
    if (space.trim() === 'in oklab') {
      if (a[3] !== 1 || b[3] !== 1) throw Error('OKLab translúcido não medido: ' + s);
      return mixOklabChannels(hex(a), weight * 100, hex(b)).concat(1);
    }
    if (space.trim() !== 'in srgb') throw Error('Espaço não suportado: ' + space);
    const alpha = a[3] * weight + b[3] * (1 - weight);
    return a.slice(0, 3).map((v, i) => alpha ? (v * a[3] * weight + b[i] * b[3] * (1 - weight)) / alpha : 0).concat(alpha);
  }
  return rgba(s);
}
function locals(rules, selectors) {
  const out = {};
  for (const sel of selectors) for (const r of rules) if (postcss.list.comma(r.selector).includes(sel)) r.walkDecls(d => {
    if (d.prop.startsWith('--')) out[d.prop] = d.value;
  });
  return out;
}
const models = {
  'data-cards': [['[data-family=statcard] .dl-statcard-label', ['.dl-statcard-label'], '.dl-statcard'], ['.dl-statcard--compact .dl-statcard-label', ['.dl-statcard-label', '.dl-statcard--compact .dl-statcard-label'], '.dl-statcard'], ['.dl-statcard--compact .dl-statcard-value', ['.dl-statcard-value'], '.dl-statcard'], ...['positive', 'negative', 'neutral'].map(s => [`[data-family=delta] .dl-delta--${s}`, ['.dl-delta', `.dl-delta--${s}`]]), ['.dl-chart-title', ['.dl-chart-title'], '.dl-chart'], ['.dl-chart-meta', ['.dl-chart-meta'], '.dl-chart'], ['.dl-donut-value', ['.dl-donut-value']], ['.dl-donut-label', ['.dl-donut-label']], ['.dl-table th', ['.dl-table thead th'], '.dl-table-wrap'], ['.dl-table-primary', ['.dl-table-primary'], '.dl-table-wrap'], ['.dl-table-secondary', ['.dl-table-secondary'], '.dl-table-wrap'], ['.dl-avatar-stack-label', ['.dl-avatar-stack-label']], ...['in-progress', 'done', 'need-review', 'pending', 'blocked'].map(s => [`[data-family=status] .dl-status--${s}`, ['.dl-status', `.dl-status--${s}`]]), ['.dl-tooltip-value', ['.dl-tooltip-value'], '.dl-tooltip-callout'], ['.dl-tooltip-label', ['.dl-tooltip-label'], '.dl-tooltip-callout']],
  'data-patterns': [['.td-warning', ['td', '.td-warning'], '.table-card'], ['.td-error', ['td', '.td-error'], '.table-card'], ['.tr-selected .td-name', ['td', '.td-name', '.tr-selected td'], '.table-card'], ['.bulk-toolbar-count', ['.bulk-toolbar-count'], '.bulk-toolbar'], ['.chart-period-btn:not(.active)', ['.chart-period-btn'], '.chart-period'], ['.chart-period-btn.active', ['.chart-period-btn', '.chart-period-btn.active'], '.chart-period']]
};
function pairsFor(root, d, values) {
  const rules = sourceRules(root).concat(sourceRules(root, 'components/data-cards.css'));
  const env = {
    ...declarations(root, 'tokens/themes/_data-layer-shared.css', 'light'),
    ...values
  };
  const body = decl(rules, ['body'], 'background'),
    base = color(body, env);
  return models[d.id].map(([target, selectors, parent]) => {
    const own = {
      ...env,
      ...locals(rules, selectors)
    };
    const parentSource = parent ? decl(rules, [parent], 'background', body) : body;
    const parentColor = over(color(parentSource, own), base),
      backgroundSource = decl(rules, selectors, 'background', 'transparent');
    const fill = over(color(backgroundSource, own), parentColor),
      foregroundSource = decl(rules, selectors, 'color', 'var(--text-primary)'),
      ink = over(color(foregroundSource, own), fill);
    return {
      target,
      kind: 'texto',
      minimum: 4.5,
      foreground: ink.slice(0, 3),
      background: fill.slice(0, 3),
      ratio: contrast(ink, fill),
      foregroundSource,
      backgroundSource,
      parentSource
    };
  });
}
function sampleData(root) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'catalog/data-samples.json'), 'utf8'));
  const source = fs.readFileSync(path.join(root, 'components/data-cards.css'), 'utf8');
  const boundaries = [1, 2, 3].map(i => Number(new RegExp(`--donut-seg-${i},\\s*([\\d.]+)%`).exec(source)?.[1]));
  if (boundaries.some(n => !Number.isFinite(n))) throw Error('Padrão de segmentos ausente');
  const shares = [boundaries[0], boundaries[1] - boundaries[0], boundaries[2] - boundaries[1], 100 - boundaries[2]];
  if (shares.some(n => n < 0)) throw Error('Segmentos inválidos');
  return {
    ...data,
    shares
  };
}
function sampleStyles(root) {
  return [...new Set(sampleData(root).series)].map(h => {
    if (!Number.isFinite(h) || h < 0 || h > 100) throw Error('Dado de barra inválido');
    return `.catalog-data-h-${h} { --h: ${h}%; }`;
  }).join('\n') + '\n';
}
function renderData(root, d, values, revision) {
  const data = sampleData(root),
    numbers = data.series,
    coords = numbers.map((v, i) => `${i * 320 / (numbers.length - 1)},${140 - v * 1.4}`).join(' ');
  const line = `<polyline points="${coords}" class="dl-chart-line"/>`;
  const seriesText = 'Valores fictícios, em ordem: ' + numbers.join(', ') + '.';
  const coins = ['cyan', 'magenta', 'green', 'amber', 'purple'];
  const labels = {
    cyan: 'Ciano',
    magenta: 'Magenta',
    green: 'Verde',
    amber: 'Âmbar',
    purple: 'Roxo'
  };
  const substitutions = {
    COINS: coins.map(c => `<span><span class="dl-coin dl-coin--${c}" aria-hidden="true">+</span> ${labels[c]}</span>`).join('') + coins.filter(c => ['cyan', 'magenta', 'green', 'amber', 'purple'].includes(c)).map(c => `<span><span class="dl-coin dl-coin--soft-${c}" aria-hidden="true">+</span> ${labels[c]} suave</span>`).join('') + '<span><span class="dl-coin dl-coin--neutral" aria-hidden="true">+</span> Neutro</span>',
    COIN_SIZES: ['sm', '', 'lg'].map((s, i) => `<span><span class="dl-coin dl-coin--neutral ${s ? 'dl-coin--' + s : ''}" aria-hidden="true">+</span> ${['Pequeno', 'Padrão', 'Grande'][i]}</span>`).join(''),
    CHART_SVG: `<svg class="dl-chart-svg" viewBox="0 0 320 140" role="img" aria-label="Cinco valores fictícios; alternativa em texto abaixo"><g class="dl-chart-grid"><line x1="0" x2="320" y1="70" y2="70"/></g>${line}<circle class="dl-chart-point" cx="320" cy="${140 - numbers.at(-1) * 1.4}" r="6"/></svg>`,
    SERIES_TEXT: seriesText,
    DONUTS: ['sm', '', 'lg'].map(s => `<div class="dl-donut ${s ? 'dl-donut--' + s : ''}" role="img" aria-label="100 itens fictícios: ${data.shares.join(', ')} por categoria"><div class="dl-donut-track"></div><div class="dl-donut-inner"><strong class="dl-donut-value">100</strong><span class="dl-donut-label">itens</span></div></div>`).join(''),
    DONUT_LEGEND: ['cyan', 'purple', 'amber', 'other'].map((c, i) => `<span class="dl-donut-legend-item"><span class="dl-donut-legend-dot catalog-legend-${c}" aria-hidden="true"></span><span class="dl-donut-legend-count">${data.shares[i]}%</span> ${['Grupo A', 'Grupo B', 'Grupo C', 'Outros'][i]}</span>`).join(''),
    SPARKLINES: ['', 'dl-sparkline--positive', 'dl-sparkline--negative dl-sparkline--lg'].map(cls => `<div class="dl-sparkline ${cls}" aria-hidden="true">${numbers.map((h, i) => `<span class="dl-sparkline-bar catalog-data-h-${h} ${i === numbers.length - 1 ? 'dl-sparkline-bar--active' : ''}"></span>`).join('')}</div>`).join(''),
    AVATARS: ['sm', '', 'lg'].map(s => `<span class="dl-avatar-stack ${s ? 'dl-avatar-stack--' + s : ''}"><span class="dl-avatar" aria-hidden="true">A</span><span class="dl-avatar" aria-hidden="true">B</span><span class="dl-avatar" aria-hidden="true">C</span><span class="dl-avatar dl-avatar--more">+2</span><span class="dl-avatar-stack-label">5 exemplos fictícios</span></span>`).join(''),
    STATUSES: Object.entries(data.statuses).map(([id, label]) => `<span class="dl-status dl-status--${id}">${label}</span>`).join(''),
    LEGACY_CHART_SVG: `<svg class="chart-svg" viewBox="0 0 320 140" role="img" aria-label="Série fictícia, valores no texto abaixo"><polyline class="sparkline-line" points="${coords}"/></svg>`,
    SPARKLINE_SVG: ['', 'sparkline-up', 'sparkline-down'].map(cls => `<span class="sparkline ${cls}" aria-hidden="true"><svg viewBox="0 0 320 140"><polyline class="sparkline-line" points="${coords}"/></svg></span>`).join('')
  };
  const html = fs.readFileSync(path.join(root, d.recipe), 'utf8').replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (substitutions[k] === undefined) throw Error('Dado sem receita: ' + k);
    return substitutions[k];
  });
  const pairs = pairsFor(root, d, values),
    failed = pairs.filter(p => p.ratio < p.minimum);
  const summary = failed.length ? 'Há textos abaixo do mínimo nesta marca e aparência. Eles podem ser difíceis de ler. Próximo passo: revisar esses pares na PR própria de cores com UX. Nenhum valor foi corrigido aqui.' : 'Os textos medidos atendem ao mínimo nos pares calculados. Gradientes, segmentos, bordas, foco e demais estados ainda precisam de avaliação; isso não certifica a família inteira.';
  return {
    contract: {
      tokens: []
    },
    pairs,
    replacements: {
      TITLE: esc(d.title),
      PENDING: `<aside class="catalog-pending"><p>${esc(d.pending)}</p></aside>`,
      SAMPLES: html,
      KEYBOARD: 'Tab chega aos links e às áreas de tabela com rolagem. Enter segue o link do indicador. Nas tabelas, os cabeçalhos se associam às células por scope. Seleção em lote e troca de período não têm comportamento conectado nesta amostra.',
      CONTRAST: `<p data-data-contrast>${summary}</p><details><summary>Ver detalhes</summary><p>Piso adotado: 4,5:1 para os textos medidos. Gradientes e elementos não textuais ainda não têm inspeção por pixel; borda e foco têm piso de 3:1 e avaliação pendente.</p><ul>${pairs.map(p => `<li data-data-pair data-target="${esc(p.target)}" data-ratio="${p.ratio}"${p.ratio < p.minimum ? ' data-pending="true"' : ''}>${p.ratio.toFixed(2)}:1 — ${esc(p.foregroundSource)} / ${esc(p.backgroundSource)}${p.ratio < p.minimum ? '. Pendente: PR de cores com UX.' : ''}</li>`).join('')}</ul></details>`,
      TECH: `<p>Origem: docs/components/${d.doc}.md, ${d.recipe}, catalog/data-samples.json e CSS distribuído. Revisão ${esc(revision.label)}.</p><p>As oito ligações aprovadas são var() de nomes existentes. Dados numéricos dos gráficos não são tokens; os percentuais do anel vêm dos defaults do CSS de origem. As amostras não ativam temas opt-in.</p><pre><code>${esc(html)}</code></pre>`
    }
  };
}
module.exports = {
  definitions,
  renderData,
  pairsFor,
  sampleData,
  sampleStyles,
  color,
  resolveExpression
};
