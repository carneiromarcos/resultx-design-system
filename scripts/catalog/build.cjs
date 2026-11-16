'use strict';

const fs = require('fs');
const path = require('path');
const {
  revisionInfo
} = require('./revision.cjs');
const {
  coverage,
  bindings,
  resolve,
  ratio
} = require('./lib.cjs');
const {
  brands
} = require('../../catalog/bindings.config.js');
const {
  notice,
  descriptions
} = require('../../catalog/copy.config');
const {definitions, renderComponent, demoStyles} = require('./components.cjs');
const ROOT = path.resolve(__dirname, '../..');
const OUT = path.join(ROOT, '_site/catalog');
const esc = x => String(x).replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[c]);
function write(file, text) {
  const p = path.join(OUT, file);
  fs.mkdirSync(path.dirname(p), {
    recursive: true
  });
  fs.writeFileSync(p, text);
}
function copy(file, dest = file) {
  const p = path.join(OUT, 'assets', dest);
  fs.mkdirSync(path.dirname(p), {
    recursive: true
  });
  fs.cpSync(path.join(ROOT, file), p, {
    recursive: true
  });
}
const banner = `<aside class="catalog-notice" data-catalog-notice aria-label="Sobre este catálogo">${esc(notice)}</aside>`;
const head = (title, theme, extra = '') => `<!doctype html><html lang="pt-BR" data-theme="${theme}"${extra}><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'"><title>${esc(title)}</title>`;
function build(options = {}) {
  const revision = revisionInfo(options);
  const {
    manifest
  } = coverage(ROOT);
  const foundation = manifest.pages.find(page => page.id === 'fundacoes');
  if (!foundation || manifest.pages.some(page => page.js.length && !['confirm-dialog','data-table'].includes(page.id))) throw Error('JavaScript permitido somente em diálogo e tabela');
  fs.rmSync(OUT, {
    recursive: true,
    force: true
  });
  fs.mkdirSync(OUT, {
    recursive: true
  });
  function copyStyles(dir) {
    for (const entry of fs.readdirSync(path.join(ROOT, dir), {
      withFileTypes: true
    })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) copyStyles(file);else if (file.endsWith('.css')) copy(file);
    }
  }
  copyStyles('tokens');
  copy('assets/fonts', 'fonts');
  for (const file of new Set(manifest.pages.flatMap(page => page.css))) copy(file, file.startsWith('catalog/') ? path.basename(file) : file);
  write('assets/states.css', demoStyles(fs.readFileSync(path.join(ROOT, 'adapters/css/pilot.css'), 'utf8')));
  for (const file of new Set(manifest.pages.flatMap(page => page.js))) copy(file, 'behaviors/' + path.basename(file));
  copy('catalog/frame.css', 'frame.css');
  let fonts = '';
  for (const [family, folder, files] of [['Inter', 'inter', [['Inter-Regular.woff2', 400], ['Inter-SemiBold.woff2', 600], ['Inter-Bold.woff2', 700]]], ['Sora', 'sora', [['Sora-SemiBold.woff2', 600], ['Sora-Bold.woff2', 700]]], ['JetBrains Mono', 'jetbrains-mono', [['JetBrainsMono-Regular.woff2', 400]]], ['Plus Jakarta Sans', 'plus-jakarta-sans', [['PlusJakartaSans.woff2', '200 800']]], ['Geist Mono', 'geist-mono', [['GeistMono.woff2', '100 900']]]]) for (const [file, weight] of files) fonts += `@font-face { font-family: '${family}'; src: url('fonts/${folder}/${file}') format('woff2'); font-weight: ${weight}; font-style: normal; }\n`;
  write('assets/fonts.css', fonts);
  const recipe = fs.readFileSync(path.join(ROOT, foundation.recipe), 'utf8');
  for (const b of brands) {
    copy(`brands/${b.dir}/tokens`);
    for (const logo of new Set(Object.values(b.logo))) copy(`brands/${b.dir}/assets/logo/${logo}`);
    let css = '';
    for (const theme of ['dark', 'light']) {
      const {
        values,
        aliases
      } = bindings(ROOT, b, theme);
      const states = [];
      const labels = {
        success: 'Sucesso',
        warning: 'Aviso',
        error: 'Erro',
        info: 'Informação'
      };
      for (const [state, label] of Object.entries(labels)) {
        const bg = resolve(values, '--catalog-' + state);
        const candidates = ['--text-on-accent', '--text-on-color', '--text-primary', '--text-on-success', '--text-on-warning'];
        const ink = candidates.map(k => ({
          k,
          n: ratio(resolve(values, k), bg)
        })).sort((x, y) => y.n - x.n)[0];
        aliases['--catalog-' + state + '-ink'] = ink.k;
        states.push(`<article class="state-${state}"><h3>${label}</h3><p>${ink.n >= 4.5 ? 'Leitura: aprovada no par medido.' : 'Leitura abaixo do mínimo. Próximo passo: revisar a combinação após 10/12.'}</p><details><summary>Ver detalhes</summary><p>Contraste ${ink.n.toFixed(2)}:1; mínimo 4,5:1. ${esc(bg)} / ${esc(resolve(values, ink.k))}.</p></details></article>`);
      }
      css += `:root[data-rx-catalog][data-theme="${theme}"] {\n` + Object.entries(aliases).map(([k, v]) => `  ${k}: var(${v});`).join('\n') + '\n}\n';
      const base = '../../../assets/';
      const core = `<link rel="stylesheet" href="${base}tokens/tokens.css">`,
        brand = `<link rel="stylesheet" data-brand="${b.id}" href="${base}brands/${b.dir}/tokens/tokens.css">`;
      const order = b.id === 'pdv' && theme === 'light' ? brand + core : core + brand;
      let voice;
      if (b.voiceSource) {
        const book = fs.readFileSync(path.join(ROOT, b.voiceSource), 'utf8');
        const lines = book.split('\n');
        const selections = {
          eletia: [/^> "Sua equipe/, /^> "Testes tradicionais/],
          emprega: [/^\*\*Profissional, acessivel/, /^\| \*\*Realista\*\*/],
          pdv: [/^\*\*O que isso significa:/],
          resultx: [/^- Português do Brasil/, /^- Sem jargão vazio/]
        };
        voice = selections[b.id].map(pattern => {
          const line = lines.find(l => pattern.test(l));
          if (!line) throw Error('Trecho de voz não encontrado no guia: ' + b.id);
          return line.replace(/^\*\*O que isso significa:\*\* /, '').replace(/^> /, '').replace(/^\| \*\*Realista\*\* \| /, '').replace(/\*\*/g, '').replace(/ \|$/, '').replace(/^- /, '');
        }).join(' ');
      }
      const notice = b.id === 'pdv' && theme === 'light' ? '<p>Tema claro do PdV montado com as superfícies claras comuns do DS; a marca ainda não aprovou. Próximo passo: Marcos aprova ou pede superfícies próprias (só depois de 10/12).</p>' : b.id === 'emprega' ? '<p>Usado em IMO e EditalHub.</p>' : '';
      const familyNames = [resolve(values, '--font-heading'), resolve(values, '--font-body'), resolve(values, '--font-mono')];
      const tech = Object.entries(aliases).map(([k, v]) => `<p><code>${esc(k)}: var(${esc(v)})</code></p>`).join('');
      const replacements = {
        LOGO: base + `brands/${b.dir}/assets/logo/${b.logo[theme]}`,
        NAME: esc(b.label),
        NOTICE: notice,
        STATES: states.join(''),
        FAMILIES: familyNames.map((v, i) => ['Título: ', 'Texto: ', 'Dados: '][i] + esc(v.split(',')[0].replaceAll("'", ''))).join(' · '),
        VOICE: voice ? `<p>${esc(voice)}</p><a href="https://github.com/carneiromarcos/resultx-design-system/blob/${revision.ref}/${b.voiceSource}">Ler o guia de voz</a>` : '<p>A voz do Xscore ainda não está documentada. Próximo passo: definir os exemplos de linguagem e aprovar o guia da marca.</p>',
        SOURCE: esc(`tokens/tokens.json → brands/${b.dir}/tokens/tokens.css`),
        REVISION: revision.label,
        TECH: tech
      };
      const content = recipe.replace(/\{\{(\w+)\}\}/g, (_, k) => replacements[k]);
      write(`${b.id}/${theme}/fundacoes/example.html`, head(b.label, theme, ' data-rx-catalog') + order + `<link rel="stylesheet" href="${base}brands/${b.dir}/tokens/ds-bridge.css"><link rel="stylesheet" href="${base}bindings/${b.id}.css"><link rel="stylesheet" href="${base}fonts.css"><link rel="stylesheet" href="${base}foundations.css"></head><body>${banner}${content}</body></html>`);
      const nav = brands.map(x => `<a href="../../../${x.id}/${theme}/fundacoes/"${x.id === b.id ? ' aria-current="page"' : ''}>${esc(x.label)}</a>`).join('');
      const themes = ['light', 'dark'].map(t => `<a href="../../${t}/fundacoes/"${t === theme ? ' aria-current="page"' : ''}>${t === 'light' ? 'Claro' : 'Escuro'}</a>`).join('');
      write(`${b.id}/${theme}/fundacoes/index.html`, head('Visão da marca · ' + b.label, theme) + core + `<link rel="stylesheet" href="${base}fonts.css"><link rel="stylesheet" href="${base}frame.css"></head><body><header><h1>Visão da marca</h1><nav aria-label="Marca">${nav}</nav><nav aria-label="Aparência">${themes}</nav>${banner}</header><iframe src="example.html" title="Fundações de ${esc(b.label)}" loading="lazy"></iframe></body></html>`);
      const pagesNav = manifest.pages.map(p => `<a href="../${p.id}/">${esc(p.title || 'Visão da marca')}</a>`).join('');
      const foundationPath = `${b.id}/${theme}/fundacoes/index.html`;
      const foundationHTML = fs.readFileSync(path.join(OUT, foundationPath), 'utf8');
      write(foundationPath, foundationHTML.replace('</header>', `<details><summary>Escolher componente</summary><nav aria-label="Componentes">${pagesNav}</nav></details></header>`));
      for (const definition of definitions) {
        const entry = manifest.pages.find(p => p.id === definition.id);
        if (!entry || entry.contract !== `contracts/${definition.id}.yaml`) throw Error('Página de contrato sem entrada: ' + definition.id);
        const rendered = renderComponent(ROOT, definition, values, revision);
        for (const token of rendered.contract.tokens) resolve(values, token);
        const parts = {...rendered.replacements, NOTICE: notice};
        const template = fs.readFileSync(path.join(ROOT, entry.recipe), 'utf8');
        const sample = template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
          if (parts[key] === undefined) throw Error('Placeholder sem valor: ' + key);
          return parts[key];
        });
        const links = `<link rel="stylesheet" href="${base}brands/${b.dir}/tokens/ds-bridge.css"><link rel="stylesheet" href="${base}bindings/${b.id}.css"><link rel="stylesheet" href="${base}fonts.css">`;
        // O adaptador continua em @layer components. A folha de apresentação não redefine rx-*.
        const styles = entry.css.map(file => `<link rel="stylesheet" href="${base}${file.startsWith('catalog/') ? path.basename(file) : file}">`).join('');
        write(`${b.id}/${theme}/${definition.id}/example.html`, head(definition.title + ' · ' + b.label, theme, ' data-rx-catalog') + order + links + styles + `<link rel="stylesheet" href="${base}states.css"></head><body>${banner}${sample}${entry.js.map(file => `<script src="${base}behaviors/${path.basename(file)}"></script>`).join('')}</body></html>`);
        const brandNav = brands.map(x => `<a href="../../../${x.id}/${theme}/${definition.id}/"${x.id === b.id ? ' aria-current="page"' : ''}>${esc(x.label)}</a>`).join('');
        const themeNav = ['light','dark'].map(t => `<a href="../../${t}/${definition.id}/"${t === theme ? ' aria-current="page"' : ''}>${t === 'light' ? 'Claro' : 'Escuro'}</a>`).join('');
        const groups = [...new Set(definitions.map(d => d.group))].map(group => `<div><span>${esc(group)}: </span>${definitions.filter(d => d.group === group).map(d => `<a href="../${d.id}/"${d.id === definition.id ? ' aria-current="page"' : ''}>${esc(d.title)}</a>`).join('')}</div>`).join('');
        write(`${b.id}/${theme}/${definition.id}/index.html`, head(definition.title + ' · ' + b.label, theme) + core + `<link rel="stylesheet" href="${base}fonts.css"><link rel="stylesheet" href="${base}frame.css"></head><body><header><h1>${esc(definition.title)}</h1><nav aria-label="Marca">${brandNav}</nav><nav aria-label="Aparência">${themeNav}</nav><details><summary>Escolher componente</summary><nav aria-label="Componentes"><a href="../fundacoes/">Visão da marca</a>${groups}</nav></details>${banner}</header><iframe src="example.html" title="${esc(definition.title)} de ${esc(b.label)}" loading="lazy"></iframe></body></html>`);
        write(`${b.id}/${theme}/${definition.id}/contraste.json`, JSON.stringify(rendered.pairs, null, 2) + '\n');
      }
    }
    write(`assets/bindings/${b.id}.css`, css);
  }
  const cards = brands.map(b => `<section><img class="brand-logo" src="assets/brands/${b.dir}/assets/logo/${b.logo.light}" alt="${esc(b.label)}"><h2>${esc(b.label)}</h2><p>${esc(descriptions[b.id])}</p><a data-brand-entry="${b.id}" href="${b.id}/light/fundacoes/">Ver ${esc(b.label)}</a></section>`).join('');
  const rows = brands.map(b => `<tr><th scope="row">${esc(b.label)}</th><td>Disponíveis no claro e no escuro</td><td>Oito componentes; combinações de cores pendentes</td></tr>`).join('');
  write('index.html', head('Catálogo de marcas', 'light') + '<link rel="stylesheet" href="assets/tokens/tokens.css"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/frame.css"></head><body><header><h1>Catálogo de marcas</h1>' + banner + '</header><main class="catalog-index"><p>Escolha uma marca para conhecer suas cores, letras e formas.</p>' + cards + '<section><h2>O que existe em cada marca</h2><table><thead><tr><th scope="col">Marca</th><th scope="col">Bases visuais</th><th scope="col">Componentes</th></tr></thead><tbody>' + rows + '</tbody></table></section></main></body></html>');
  console.log('Catálogo: fundações e oito páginas de contrato nas dez combinações; JavaScript local somente no diálogo e na tabela.');
}
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--revision')) throw Error('Uso: build.cjs [--revision <SHA completo>]');
  build({
    revision: args[1]
  });
}
module.exports = {
  build
};
