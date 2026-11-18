'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const postcss = require('postcss');
const {
  resolve,
  ratio
} = require('./lib.cjs');
const definitions = require('../../catalog/components.config.cjs');
const escape = value => String(value).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
const descriptions = {
  normal: 'Exemplo disponível.',
  hover: 'Aparência ao passar o mouse. Experimente também o exemplo padrão.',
  ativo: 'Aparência enquanto pressiona o controle.',
  foco: 'Amostra do contorno de foco. Use Tab no exemplo padrão para experimentar o foco real.',
  desabilitado: 'Ação indisponível: explique o motivo e o próximo passo ao lado.',
  carregando: 'A informação está sendo atualizada.',
  erro: 'Explique o problema e como continuar.',
  vazio: 'Informe o que falta e o próximo passo.'
};
const labels = {
  normal: 'Padrão',
  hover: 'Ao passar o mouse',
  ativo: 'Ao pressionar',
  foco: 'Foco',
  desabilitado: 'Desativado',
  carregando: 'Carregando',
  erro: 'Erro',
  vazio: 'Vazio'
};

// Seleciona um elemento completo do HTML canônico, sem dependência de um DOM no build.
function elementById(html, id) {
  const tokens = [...html.matchAll(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>/gi)];
  const at = tokens.findIndex(m => new RegExp(`\\bid=["']${id}["']`).test(m[0]));
  if (at < 0) throw Error('Exemplo do piloto ausente: ' + id);
  const start = tokens[at],
    tag = /^<([\w-]+)/.exec(start[0])[1];
  if (/^(input|img|br|hr|meta|link)$/.test(tag)) return start[0];
  let depth = 0;
  for (let i = at; i < tokens.length; i++) {
    const text = tokens[i][0];
    if (new RegExp(`^<${tag}(?:\\s|>)`).test(text)) depth++;
    if (text === `</${tag}>` && --depth === 0) return html.slice(start.index, tokens[i].index + text.length);
  }
  throw Error('Elemento incompleto: ' + id);
}
function renameIds(html, prefix) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  for (const id of ids) html = html.replaceAll(`id="${id}"`, `id="${prefix}-${id}"`).replaceAll(`for="${id}"`, `for="${prefix}-${id}"`).replaceAll(`aria-describedby="${id}"`, `aria-describedby="${prefix}-${id}"`).replaceAll(`aria-labelledby="${id}"`, `aria-labelledby="${prefix}-${id}"`);
  return html;
}
function demoStyles(css) {
  const original = postcss.parse(css),
    out = postcss.root();
  const layer = postcss.atRule({
    name: 'layer',
    params: 'components'
  });
  original.walkRules(rule => {
    const selectors = postcss.list.comma(rule.selector).filter(s => /:(hover|active|focus-visible)\b/.test(s));
    if (!selectors.length) return;
    const clone = rule.clone();
    clone.selector = selectors.map(s => s.replace(/:hover\b/g, '[data-catalog-state="hover"]').replace(/:active\b/g, '[data-catalog-state="ativo"]').replace(/:focus-visible\b/g, '[data-catalog-state="foco"]')).join(',\n');
    layer.append(clone);
  });
  out.append(layer);
  return out.toString();
}
function style(css, selectors) {
  const result = {};
  for (const selector of selectors) postcss.parse(css).walkRules(rule => {
    if (postcss.list.comma(rule.selector).includes(selector)) rule.walkDecls(d => {
      result[d.prop] = d.value;
    });
  });
  return result;
}
function rolesForStyle(css, kind, variant, state) {
  const control = kind === 'field' ? '.rx-field__control' : kind === 'badge' ? '.rx-badge' : kind === 'stat' ? '.rx-stat-card' : kind === 'card' ? '.rx-card' : kind === 'table' ? '.rx-table' : kind === 'empty' ? '.rx-state' : kind === 'dialog' ? '.rx-dialog' : '.rx-button';
  const selectors = [control];
  const suffix = ':where(:not(:disabled, [aria-disabled=\'true\']))';
  if (control === '.rx-button') {
    if (state === 'hover' || state === 'ativo') selectors.push(control + (state === 'hover' ? ':hover' : ':active') + suffix);
    selectors.push(control + '--' + variant);
    if (state === 'hover' || state === 'ativo') selectors.push(control + '--' + variant + (state === 'hover' ? ':hover' : ':active') + suffix);
    if (state === 'desabilitado' || state === 'carregando') selectors.push(control + ':disabled');
    if (state === 'carregando') selectors.push(control + "[aria-busy='true']");
  }
  if (control === '.rx-badge' && variant) selectors.push(control + '--' + variant);
  if (control === '.rx-field__control' && state === 'erro') selectors.push(control + "[aria-invalid='true']");
  if (state === 'foco') selectors.push(control + ':focus-visible');
  return style(css, selectors);
}
function pairFromStyle(css, values, descriptor) {
  const s = rolesForStyle(css, descriptor.kind, descriptor.variant, descriptor.state);
  const variable = expression => {
    const m = [...(expression || '').matchAll(/var\((--[\w-]+)\)/g)].at(-1);
    if (!m) throw Error('Declaração sem origem semântica: ' + expression);
    return m[1];
  };
  const bgRole = variable(s.background);
  const pairs = [];
  function add(kind, role, background, minimum) {
    const foreground = resolve(values, role),
      bg = resolve(values, background);
    pairs.push({
      ...descriptor,
      kind,
      foregroundRole: role,
      backgroundRole: background,
      foreground,
      background: bg,
      minimum,
      ratio: ratio(foreground, bg)
    });
  }
  add('texto', variable(s.color), bgRole, 4.5);
  const disabled = descriptor.kind === 'button' && descriptor.state === 'desabilitado';
  if (s.border && !disabled) add('borda', variable(s['border-color'] || s.border), descriptor.adjacent || '--bg-base', 3);
  if (s.outline) add('foco', variable(s.outline), descriptor.adjacent || '--bg-base', 3);
  if (descriptor.link) add('texto do link', variable(style(css, ['.rx-stat-card a']).color), bgRole, 4.5);
  return pairs;
}
function renderComponent(root, definition, values, revision) {
  const contract = yaml.load(fs.readFileSync(path.join(root, 'contracts', definition.id + '.yaml'), 'utf8'));
  const source = fs.readFileSync(path.join(root, 'examples/pilot.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'adapters/css/pilot.css'), 'utf8');
  const pairs = [],
    samples = [];
  let serial = 0;
  function sample(sourceId, state, label, options = {}) {
    const key = 'sample-' + ++serial;
    let html = renameIds(elementById(source, sourceId), key);
    if (sourceId === 'table' && state === 'normal') html = elementById(source, sourceId);
    if (sourceId === 'confirm' && state === 'normal') html = elementById(source, sourceId);
    if (sourceId === 'confirm' && state !== 'normal') {
      html = html.replace(/^<dialog/, '<section aria-label="Amostra estática de confirmação"').replace('</dialog>', '</section>');
      if (state === 'carregando') html = html.replace(/ hidden/g, '').replace(/(<section\b)/, '$1 aria-busy="true"').replace(/(<button\b)/g, '$1 disabled').replace(/<p[^>]*role="alert"[^>]*>.*?<\/p>/s, '');
      if (state === 'erro') html = html.replace(/(<p[^>]*role="alert"[^>]*) hidden/, '$1');
    }
    if (sourceId === 'stat-link') html = html.replace('href="#table"', 'href="#destination"');
    if (html.startsWith('<a ')) html = html.replace(/href="[^"]*"/, 'href="#destination"');
    if (sourceId === 'field' && state === 'desabilitado') html = html.replace('<input', '<input disabled');
    const target = options.target || ((sourceId === 'table' || sourceId === 'confirm') && state === 'normal' ? sourceId : key + '-' + sourceId);
    if (options.demo) html = html.replace(/(<(?:button|a|input)\b)/, `$1 data-catalog-state="${options.demo}"`);
    const control = definition.id === 'field' ? (html.match(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/) || [])[1] : target;
    const descriptor = {
      id: control,
      label,
      state,
      kind: options.kind || definition.id,
      variant: options.variant,
      link: options.link
    };
    if (definition.id === 'confirm-dialog') descriptor.kind = sourceId === 'button-unavailable-danger' ? 'button' : 'dialog';
    if (definition.id === 'stat-card') descriptor.kind = 'stat';
    if (definition.id === 'status-badge') descriptor.kind = 'badge';
    if (definition.id === 'data-table') descriptor.kind = 'table';
    if (definition.id === 'empty-state') descriptor.kind = 'empty';
    if (definition.id === 'data-table' && sourceId !== 'table' && sourceId !== 'table-loading') descriptor.kind = sourceId === 'table-disabled' ? 'button' : 'empty';
    let child = 0;
    html = html.replace(/<(button|a|span)\b[^>]*class="[^"]*rx-(?:button|badge)[^"]*"[^>]*>/g, (tag, name) => {
      // O controle raiz já tem seu par; os controles internos também precisam ser medidos.
      if (tag.includes(`id="${target}"`)) return tag;
      const existing = /\bid="([^"]+)"/.exec(tag);
      const childId = existing ? existing[1] : key + '-child-' + ++child;
      const unavailable = /\bdisabled\b|aria-disabled="true"/.test(tag);
      const busy = /aria-busy="true"/.test(tag);
      const variant = /rx-(?:button|badge)--([\w-]+)/.exec(tag)?.[1] || 'secondary';
      const kind = /rx-badge/.test(tag) ? 'badge' : 'button';
      pairs.push(...pairFromStyle(css, values, {
        id: childId,
        label: label + ' · ação ou status interno',
        kind,
        variant,
        state: busy ? 'carregando' : unavailable ? 'desabilitado' : state === 'foco' && tag.includes('data-catalog-state') ? 'foco' : 'normal',
        adjacent: ['card', 'stat-card', 'empty-state', 'confirm-dialog', 'data-table'].includes(definition.id) ? '--bg-surface-1' : '--bg-base'
      }));
      return existing ? tag : tag.replace('>', ` id="${childId}">`);
    });
    pairs.push(...pairFromStyle(css, values, descriptor));
    const sourceElement = elementById(source, sourceId);
    const afterSource = source.slice(source.indexOf(sourceElement) + sourceElement.length);
    const reasonText = /^\s*<span>([^<]+)<\/span>/.exec(afterSource)?.[1];
    const reason = state === 'desabilitado' && reasonText ? `<p>${escape(reasonText)}</p>` : '';
    if (sourceId === 'confirm' && state === 'normal') html = elementById(source, 'open-dialog') + html;
    const wrapped = definition.id === 'data-table' ? `<div class="catalog-table-scroll">${html}</div>` : html;
    return `<article class="catalog-sample" data-sample="${key}"><h3>${escape(label)}</h3>${wrapped}${reason}</article>`;
  }
  const byState = {
    card: {
      normal: ['card', 'card-sm', 'card-md', 'card-lg'],
      carregando: ['card-loading'],
      vazio: ['card-empty'],
      erro: ['card-error'],
      desabilitado: ['card'],
      foco: ['card']
    },
    field: {
      normal: ['field', 'field-select', 'field-textarea', 'field-inputmode-numeric', 'field-inputmode-money'],
      carregando: ['field-loading'],
      vazio: ['field'],
      erro: ['field-error', 'field-select-error', 'field-textarea-error'],
      desabilitado: ['field'],
      foco: ['field']
    },
    'stat-card': {
      normal: ['stat', 'stat-link'],
      carregando: ['stat-loading'],
      vazio: ['stat-empty'],
      erro: ['stat-error'],
      foco: ['stat-link']
    },
    'data-table': {
      normal: ['table'],
      carregando: ['table-loading'],
      vazio: ['table-empty'],
      erro: ['table-error'],
      desabilitado: ['table-disabled'],
      foco: []
    },
    'status-badge': {
      normal: ['badge-neutral', 'badge-success', 'badge-error'],
      carregando: ['badge-loading'],
      vazio: ['badge-empty'],
      erro: ['badge-error']
    },
    'confirm-dialog': {
      normal: ['confirm'],
      carregando: ['confirm'],
      erro: ['confirm'],
      desabilitado: ['button-unavailable-danger'],
      foco: ['confirm']
    },
    'empty-state': {
      carregando: ['empty-loading'],
      vazio: ['empty'],
      erro: ['error'],
      desabilitado: ['empty-loading'],
      foco: ['empty']
    }
  };
  for (const [state, explanation] of Object.entries(contract.estados)) {
    let content = '';
    const applicable = !/Não aplicável|Não recebe foco/i.test(explanation);
    if (applicable && definition.id === 'button') {
      for (const variant of contract.variantes) for (const tag of ['button', 'a']) {
        const sourceId = tag === 'a' ? state === 'desabilitado' ? `link-unavailable-${variant}` : state === 'carregando' ? variant === 'primary' ? 'link-loading' : `link-loading-${variant}` : `link-${variant}` : state === 'desabilitado' ? `button-unavailable-${variant}` : state === 'carregando' ? `button-loading-${variant}` : variant === 'danger' ? 'state-available-danger' : variant;
        content += sample(sourceId, state, `${tag === 'a' ? 'Link' : 'Botão'} · ${variant === 'primary' ? 'principal' : variant === 'secondary' ? 'secundário' : 'perigo'}`, {
          variant,
          demo: ['hover', 'ativo', 'foco'].includes(state) ? state : null
        });
      }
    } else if (applicable) {
      for (const sourceId of byState[definition.id]?.[state] || []) {
        const fieldLabel = {
          'field-select': 'Select nativo',
          'field-textarea': 'Texto longo',
          'field-inputmode-numeric': 'Teclado numérico',
          'field-inputmode-money': 'Teclado decimal',
          'field-select-error': 'Select com erro',
          'field-textarea-error': 'Textarea com erro'
        }[sourceId];
        content += sample(sourceId, state, fieldLabel || labels[state] + (sourceId === 'stat-link' ? ' · Com link' : ''), {
        variant: sourceId === 'badge-success' ? 'success' : sourceId === 'badge-error' ? 'error' : 'neutral',
        link: sourceId === 'stat-link',
        demo: state === 'foco' ? 'foco' : null
        });
      }
    }
    if (applicable && !content && state !== 'foco') throw Error('Estado sem receita de apresentação: ' + definition.id + '/' + state);
    samples.push(`<section data-contract-state="${state}"><h2>${labels[state] || escape(state)}</h2><p>${escape(applicable ? descriptions[state] || labels[state] : 'Este estado não se aplica a este componente.')}</p>${content ? `<div class="catalog-grid">${content}</div>` : applicable && state === 'foco' ? '<p>Experimente o controle do exemplo padrão usando Tab.</p>' : '<p>Este estado não acrescenta uma interação ao componente.</p>'}</section>`);
  }
  const failures = pairs.filter(p => p.ratio < p.minimum);
  const summary = failures.length ? 'Há combinações abaixo do mínimo nesta marca e aparência. Isso pode dificultar a leitura ou a identificação do controle. Próximo passo: revisar os pares listados na PR própria de cores com UX, sem alterar as cores nesta etapa.' : 'Leitura e limites: os pares calculados atendem aos mínimos; os exemplos são conferidos no navegador. Isso não certifica todo o produto.';
  const pairHTML = pairs.map(p => `<li data-contrast-pair data-target="${p.id}" data-kind="${p.kind}" data-minimum="${p.minimum}" data-ratio="${p.ratio}" data-foreground="${p.foreground}" data-background="${p.background}"${p.ratio < p.minimum ? ' data-pending="true"' : ''}>${escape(p.label)} · ${escape(labels[p.state])} · ${p.kind}: ${p.ratio.toFixed(2)}:1 (mínimo ${p.minimum}:1), ${p.foreground} / ${p.background}; <code>${p.foregroundRole} / ${p.backgroundRole}</code>${p.ratio < p.minimum ? '. Pendente: abaixo do mínimo; revisar na PR própria de cores com UX.' : ''}</li>`).join('');
  return {
    contract,
    pairs,
    replacements: {
      TITLE: escape(definition.title),
      INTRO: escape(definition.intro),
      PENDING: definition.pending ? `<aside class="catalog-pending">${escape(definition.pending)}</aside>` : '',
      GUIDANCE: definition.id === 'button' ? '<p>Prefira esconder uma ação indisponível. Mostre-a desativada somente quando puder ser liberada, com o motivo e o próximo passo ao lado. Links navegam com Enter; Espaço não os aciona.</p>' : '',
      SAMPLES: samples.join('') + '<p id="destination">Destino de demonstração, sem envio de dados.</p>',
      KEYBOARD: '<ul>' + contract.teclado.map(s => `<li>${escape(s)}</li>`).join('') + '</ul>' + (definition.pending ? '<p>As instruções acima são o que o componente deve oferecer. O comportamento pendente não está implementado nesta página.</p>' : ''),
      CONTRAST: `<p data-contrast-summary>${summary}</p><details><summary>Ver detalhes</summary><p>Cálculo a partir das declarações do adaptador e das cores resolvidas da marca. Texto: 4,5:1; borda e foco: 3:1. Borda desativada é exceção prevista no contrato. A validação de pixels e anúncio por leitor de tela não está incluída nesta frase.</p><ul>${pairHTML}</ul></details>`,
      TECH: `<p>Origem: <code>contracts/${definition.id}.yaml</code>, <code>examples/pilot.html</code> e <code>adapters/css/pilot.css</code>. Revisão: ${escape(revision.label)}.</p><h2>Estados do contrato</h2><ul>${Object.entries(contract.estados).map(([k, v]) => `<li>${escape(labels[k] || k)}: ${escape(v)}</li>`).join('')}</ul><details><summary>HTML dos exemplos</summary><pre><code>${escape(samples.join(''))}</code></pre></details><h2>Critérios</h2><ul>${contract.criterios_aceite.map(s => `<li>${escape(s)}</li>`).join('')}</ul><h2>Casos exigidos por adaptador</h2><ul>${contract.casos_teste.map(s => `<li><code>${s.id}</code>: ${escape(s.descricao)}</li>`).join('')}</ul><h2>Papéis consumidos</h2><ul>${contract.tokens.map(s => `<li><code>${escape(s)}</code></li>`).join('')}</ul>`
    }
  };
}
module.exports = {
  definitions,
  renderComponent,
  demoStyles,
  elementById,
  rolesForStyle
};
