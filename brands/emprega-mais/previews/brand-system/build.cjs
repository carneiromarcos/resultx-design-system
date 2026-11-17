'use strict';
// Geração de documentação: nenhuma alteração nos tokens ou código no navegador.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const yaml = require('js-yaml');
const {declarations, resolve, ratio} = require('../../../../scripts/catalog/lib.cjs');
const here = __dirname;
const defaultRoot = path.resolve(here, '../../../..');
const brandDir = 'brands/emprega-mais';
const siteDir = `${brandDir}/previews/brand-system`;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const digest = content => crypto.createHash('sha256').update(content).digest('hex');
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');
const sourceUrl = file => `https://github.com/carneiromarcos/resultx-design-system/blob/main/${file}`;
const roles = {
  surfaces: [['--emp-bg','Fundo'],['--emp-surface','Superfície'],['--emp-surface-tonal','Camada tonal'],['--emp-border','Divisão']],
  action: [['--accent-primary','Ação de interface'],['--accent-primary-hover','Ação ao passar o mouse'],['--accent-primary-text','Texto de ação'],['--emp-gold','Acento institucional']],
  states: [['--emp-success','Sucesso'],['--emp-warning','Atenção'],['--emp-error','Erro']],
  spaces: ['--emp-space-xs','--emp-space-sm','--emp-space-md','--emp-space-lg','--emp-space-xl','--emp-space-2xl','--emp-space-3xl'],
  radii: ['--emp-radius-sm','--emp-radius-md','--emp-radius-lg','--emp-radius-xl'],
  shadows: ['--emp-shadow-sm','--emp-shadow-md','--emp-shadow-lg'],
  motion: ['--emp-duration-fast','--emp-duration-normal','--emp-duration-slow','--emp-duration-reveal','--emp-ease-out-expo','--emp-ease-in-out']
};
const chapters = [
  ['Essência da marca','BRAND-BOOK.md','Propósito e princípios que orientam a marca.'],
  ['Arquitetura de marca','BRAND-BOOK.md','Marca-mãe e convivência das identidades.'],
  ['Assinatura visual','BRAND-BOOK.md','Construção e aplicação dos arquivos oficiais.'],
  ['Paleta de cores',null,'Os valores atuais estão nas amostras de fundamentos desta página.'],
  ['Tipografia',null,'As famílias e medidas atuais estão na seção de tipografia.'],
  ['Tom e voz','BRAND-BOOK.md','Uma comunicação profissional, acessível, otimista e realista.'],
  ['Iconografia','BRAND-BOOK.md','Ícones acompanham a informação e o nome da ação.'],
  ['Aplicações','BRAND-BOOK.md','Identidade em comunicação e interfaces.'],
  ['Nomenclatura','BRAND-BOOK.md','Grafia e identificação das frentes da marca.'],
  ['Coexistência','BRAND-BOOK.md','Endosso e convivência no ecossistema.'],
  ['Origem da marca','BRAND-BOOK.md','Contexto institucional registrado na fonte editorial.'],
  ['Posicionamento','BRAND-BOOK.md','Direção institucional e promessa da marca.'],
  ['Arquétipo',null,'Pendente: não há classificação formal localizada. Próximo passo: gestão e UX validarem a necessidade editorial.'],
  ['Fotografia e imagens','IMAGE-PROMPTS.md','Direção visual, diversidade e uso apropriado de imagens.'],
  ['Checklist','BRAND-BOOK.md','Critérios de aplicação e revisão.'],
  ['Aplicação nas páginas','DESIGN-SYSTEM.md','Guia histórico de composição; conferir os fundamentos gerados atuais.'],
  ['Diretrizes visuais','DESIGN-SYSTEM.md','Hierarquia, leitura e contexto de uso.'],
  ['Identidade social','SOCIAL-MEDIA-GUIDE.md','Orientação editorial e formatos de comunicação.']
];
const nav = [['overview','Visão geral'],['surfaces','Superfícies'],['action','Ação e acento'],['states','Cores de estado'],['type','Tipografia'],['space','Espaço'],['shape','Raio e sombra'],['motion','Movimento'],['voice','Voz'],['logo','Assinatura'],['components','Componentes'],['brand-book','Guia de marca'],['maintenance','Manutenção']];
const labels = {button:'Botões e links',field:'Campos',card:'Cartões','stat-card':'Indicadores','data-table':'Tabelas','confirm-dialog':'Confirmação','status-badge':'Estado','empty-state':'Vazio e erro'};
function model(root, theme) {
  const seen = new Set();
  const values = {...declarations(root,'tokens/tokens.css',theme,seen),...declarations(root,`${brandDir}/tokens/tokens.css`,theme,seen),...declarations(root,`${brandDir}/tokens/ds-bridge.css`,theme,seen)};
  const names = [...roles.surfaces.flat(),...roles.action.flat(),...roles.states.flat()].filter(x => x.startsWith('--'));
  const required = [...names,...roles.spaces,...roles.radii,...roles.shadows,...roles.motion,'--emp-font-heading','--emp-font-sans','--emp-font-mono','--emp-text','--emp-text-secondary','--emp-text-muted','--text-inverse'];
  for (const name of required) resolve(values,name);
  const pairs = [
    ['Texto principal','--emp-text','--emp-bg'],['Texto de apoio','--emp-text-secondary','--emp-surface-tonal'],
    ['Texto discreto','--emp-text-muted','--emp-surface-tonal'],['Texto de ação','--accent-primary-text','--emp-bg'],
    ['Texto sobre ação','--text-inverse','--accent-primary']
  ].map(([label,foreground,background])=>({label,foreground,background,ratio:ratio(resolve(values,foreground),resolve(values,background))}));
  return {values,files:[...seen],pairs};
}
const tokenCode = name => `<code>${escape(name)}</code>`;
function value(name, m) { return `<span class="numeric" data-token="${name}">${escape(resolve(m.values,name))}</span>`; }
function section(id, title, intro, body) { return `<section class="chapter" id="${id}"><header><h2>${title}</h2><p class="intro">${intro}</p></header>${body}</section>`; }
function swatches(entries, m) { return `<div class="swatches">${entries.map(([name,label])=>`<article><div class="swatch sample-${name.slice(2)}" aria-hidden="true"></div><h3>${label}</h3><details><summary>Ver detalhes</summary><p>${tokenCode(name)}<br>${value(name,m)}</p></details></article>`).join('')}</div>`; }
function table(names, m, kind) { return `<div class="table-scroll"><table><caption>${kind}</caption><thead><tr><th scope="col">Papel</th><th scope="col">Valor atual</th><th scope="col">Amostra</th></tr></thead><tbody>${names.map(name=>`<tr><th scope="row">${tokenCode(name)}</th><td>${value(name,m)}</td><td><span class="shape sample-${name.slice(2)}" aria-hidden="true"></span></td></tr>`).join('')}</tbody></table></div>`; }
function render(root, theme, m, provenance, book) {
  const other = theme === 'light' ? 'dark.html' : 'index.html';
  const themeName = theme === 'light' ? 'claro' : 'escuro';
  const logo = theme === 'light' ? 'emprega-plus-navy.png' : 'emprega-plus-white.png';
  const links = nav.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('');
  const tagline = book.match(/### Tagline oficial[\s\S]*?>\s*\*\*"([^"]+)"\*\*/)?.[1];
  if (!tagline) throw Error('Tagline da marca não localizada na fonte editorial.');
  const voiceSection = book.match(/## 6\. Tom e Voz([\s\S]*?)\n## 7\./)?.[1] || '';
  const voice = [...voiceSection.split('### Exemplos')[0].matchAll(/^\| \*\*([^*]+)\*\* \|/gm)].map(m=>m[1]);
  if (!voice.length) throw Error('Atributos da voz não localizados.');
  const pending = m.pairs.filter(p=>p.ratio<4.5);
  let main = section('surfaces','Camadas que organizam.','Fundo, conteúdo e divisões seguem as superfícies atuais da marca.',swatches(roles.surfaces,m));
  main += section('action','A ação tem um papel. O acento, outro.','A interface usa a ação definida na ponte da marca. O ouro permanece como acento institucional.',swatches(roles.action,m)+`<div class="action-reading"><p>Uma mensagem em destaque.</p><p>Exemplo fictício de texto sobre a cor de ação.</p></div><div class="reading"><p>Texto principal organiza a leitura.</p><p class="secondary">Texto de apoio traz contexto.</p><p class="muted-sample" id="sample-muted">Texto discreto é uma amostra para revisão.</p></div>${pending.length?`<aside class="note"><h3>Uma amostra precisa de revisão</h3><p>${pending.map(p=>escape(p.label)).join(', ')} fica abaixo de 4,5:1 neste fundo. Próximo passo: revisão de contraste com o Supervisor DS e UX; até lá, esta amostra não indica conformidade.</p></aside>`:''}<details><summary>Ver detalhes do contraste</summary><ul>${m.pairs.map(p=>`<li>${p.label}: ${p.ratio.toFixed(2).replace('.',',')}:1 · ${tokenCode(p.foreground)} sobre ${tokenCode(p.background)}</li>`).join('')}</ul><p>Comparação de cores opacas da fonte. Os componentes exigem prova nos estados e no contexto real.</p></details>`);
  main += section('states','O significado vem antes da cor.','Amostras de pigmento para sucesso, atenção e erro. O estado funcional também precisa de texto e contexto.',swatches(roles.states,m)+'<p class="caption">As variantes e os comportamentos completos estão no catálogo compartilhado de componentes.</p>');
  main += section('type','Uma família para cada leitura.','Sora nos títulos, Inter na interface e JetBrains Mono nas amostras de dados.',`<div class="type-samples"><article><h3>Títulos</h3><p class="type-display">Clareza para seguir em frente.</p><details><summary>Ver detalhes</summary>${value('--emp-font-heading',m)}</details></article><article><h3>Interface</h3><p class="type-body">Informação organizada para encontrar o próximo passo.</p><details><summary>Ver detalhes</summary>${value('--emp-font-sans',m)}</details></article><article><h3>Dados</h3><p class="type-mono">0123456789 · 12 oportunidades</p><p class="caption">Exemplo fictício com numerais tabulares.</p><details><summary>Ver detalhes</summary>${value('--emp-font-mono',m)}</details></article></div>`);
  main += section('space','Espaço para entender.','A escala existente orienta agrupamentos e intervalos, sem criar uma segunda escala.',table(roles.spaces,m,'Espaçamento da marca'));
  main += section('shape','Forma e profundidade.','O raio acompanha o contexto. A existência de uma sombra não determina o estado de um componente.',table(roles.radii,m,'Raios')+table(roles.shadows,m,'Sombras')+'<p class="caption">Cartões de conteúdo usam superfície plana em repouso. As elevações são amostras dos papéis disponíveis.</p>');
  main += section('motion','Movimento com propósito.','As durações e curvas já existem. A preferência por menos movimento continua sendo respeitada.',`<dl class="token-list">${roles.motion.map(name=>`<div><dt>${tokenCode(name)}</dt><dd>${value(name,m)}</dd></div>`).join('')}</dl><p class="caption">Esta entrada mantém as amostras estáticas.</p>`);
  main += section('voice','Clareza também no que se diz.','Os atributos da comunicação vêm do guia da marca.',`<ul class="voice-list">${voice.map(v=>`<li>${escape(v==='Acessivel'?'Acessível':v)}</li>`).join('')}</ul><blockquote>${escape(tagline)}</blockquote><details><summary>Ver detalhes da fonte</summary><a href="${sourceUrl(`${brandDir}/docs/BRAND-BOOK.md`)}">Consultar o guia editorial atual</a></details>`);
  main += section('logo','A assinatura é um arquivo oficial.','As versões claras e escuras preservam a construção e a proporção.',`<figure class="logo-sample"><img src="../../assets/logo/${logo}" alt="emprega+"><figcaption>Arquivo oficial para esta aparência.</figcaption></figure>`);
  main += section('components','Os componentes têm uma fonte compartilhada.','As implementações de referência e seus estados estão no catálogo oficial, com esta marca e aparência.',`<div class="component-grid">${provenance.components.map(id=>`<article><h3><a href="https://carneiromarcos.github.io/resultx-design-system/catalog/emprega/${theme}/${id}/">${escape(labels[id]||id)}</a></h3><details><summary>Ver detalhes</summary><p><a href="${sourceUrl(`contracts/${id}.yaml`)}">Contrato atual</a> · <a href="${sourceUrl(`generated/component-cards/${id}.md`)}">Ficha atual</a></p></details></article>`).join('')}</div><p class="caption">Os links de navegação não carregam os exemplos nesta página. As referências visuais e a adoção no produto são acompanhadas por etapas.</p>`);
  main += section('brand-book','As escolhas que dão unidade.','A estrutura reúne os assuntos da marca e aponta às fontes existentes, sem duplicar seus valores.',`<div class="book-index">${chapters.map(([title,file,text],i)=>`<article id="bb-${i}"><h3>${i+1}. ${escape(title)}</h3><p>${escape(text)}</p>${file?`<a href="${sourceUrl(`${brandDir}/docs/${file}`)}">Ler a diretriz atual</a>`:(i===3?'<a href="#surfaces">Ver fundamentos de cor</a>':i===4?'<a href="#type">Ver tipografia</a>':'')}</article>`).join('')}</div>`);
  main += section('maintenance','Uma base, com origem visível.','Os valores exibidos são lidos das folhas geradas atuais. As mudanças seguem os fundamentos e contratos compartilhados.',`<p>Próximo passo: validar as demais composições e os componentes por etapa. A publicação desta entrada é uma entrega separada.</p><details><summary>Ver detalhes da geração</summary><p>Identificador do conteúdo: <code>${provenance.contentId.slice(0,12)}</code>. É um hash das entradas, não um identificador de commit.</p><p><a href="provenance.json">Arquivos de origem e hashes</a>. Os links de código abrem a fonte atual do DS.</p><p>A fundação de compatibilidade mantém seus valores congelados até 10/12. Nenhum token foi reescrito por esta página.</p></details>`);
  return `<!doctype html>\n<html lang="pt-BR" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'self'"><title>emprega+ · Sistema visual · ${themeName}</title><link rel="stylesheet" href="../../../../tokens/tokens.css"><link rel="stylesheet" href="../../tokens/tokens.css"><link rel="stylesheet" href="../../tokens/ds-bridge.css"><link rel="stylesheet" href="fonts.css"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="samples.css"></head><body><a class="skip" href="#main">Pular para o conteúdo</a><header class="topbar"><div class="topbar-inner"><a href="#overview" class="logo-link"><img src="../../assets/logo/${logo}" alt="emprega+"></a><span class="top-label">Sistema visual</span><a class="theme-link" href="${other}">Ver aparência ${theme==='light'?'escura':'clara'}</a></div></header><div class="layout"><aside class="sidebar"><nav aria-label="Navegação da documentação">${links}</nav></aside><main id="main"><details class="mobile-nav"><summary>Explorar o sistema visual</summary><nav aria-label="Navegação no celular">${links}</nav></details><section class="hero" id="overview"><p class="eyebrow">emprega+ · Marca e interface</p><h1>Uma identidade.<br>Uma base para construir.</h1><p class="hero-copy">${escape(tagline)} Fundamentos atuais, diretrizes e referências para uma experiência consistente.</p><div class="hero-links"><a href="#brand-book">Conhecer a marca</a><a href="#components">Explorar componentes</a></div><p class="construction"><strong>Em construção.</strong> Os fundamentos estão disponíveis. Faltam composições e validação visual das próximas etapas. Próximo passo: revisar os exemplos e ampliar o sistema por componente.</p><div class="hero-foundations"><div><span>Identidade</span><strong>emprega+</strong></div><div><span>Famílias</span><strong>Sora · Inter · Mono</strong></div><div><span>Aparência</span><strong>${themeName}</strong></div></div></section>${main}<footer>Brand System emprega+ · Fundamentos gerados · Claro e escuro</footer></main></div></body></html>\n`;
}
function build({root=defaultRoot}={}) {
  const models = {light:model(root,'light'),dark:model(root,'dark')};
  const book = read(root,`${brandDir}/docs/BRAND-BOOK.md`);
  const components = fs.readdirSync(path.join(root,'contracts')).filter(f=>f.endsWith('.yaml')).map(f=>f.slice(0,-5)).sort();
  for (const id of components) yaml.load(read(root,`contracts/${id}.yaml`));
  const files = new Set([...models.light.files,...models.dark.files,'tokens/tokens.json',`${siteDir}/build.cjs`,`${siteDir}/style.css`,`${brandDir}/docs/BRAND-BOOK.md`,`${brandDir}/tokens/eds-root.css`,`${brandDir}/tokens/pilot-aliases.css`]);
  for (const file of chapters.map(c=>c[1]).filter(Boolean)) files.add(`${brandDir}/docs/${file}`);
  for (const id of components) {files.add(`contracts/${id}.yaml`);files.add(`generated/component-cards/${id}.md`);}
  for (const name of ['emprega-plus-navy.png','emprega-plus-white.png']) files.add(`${brandDir}/assets/logo/${name}`);
  const fontSource = 'tokens/themes/preview.html';
  files.add(fontSource);
  const fontFaces = [...read(root,fontSource).matchAll(/@font-face\s*\{[^}]+\}/g)].map(m=>m[0].replace(/font-family:\s*['"]([\w-]+)['"]/g,'font-family: $1').replace(/url\(['"]([^'"]+)['"]\)/g,(_,url)=>{
    const input = path.posix.normalize(path.posix.join(path.posix.dirname(fontSource),url));
    files.add(input);
    return `url('${path.posix.relative(siteDir,input)}')`;
  }));
  for (const [family,weight] of [['Inter',400],['Inter',500],['Inter',600],['Sora',600],['JetBrains Mono',400]]) {
    if (!fontFaces.some(face=>face.includes(family) && new RegExp(`font-weight:\\s*${weight}\\s*;`).test(face))) throw Error(`Face usada não localizada: ${family} ${weight}`);
  }
  const inputs = [...files].sort().map(file=>({file,sha256:digest(fs.readFileSync(path.join(root,file)))}));
  const provenance = {schema:1,brand:'emprega+',components,inputs,contentId:digest(JSON.stringify(inputs)),contrasts:{light:models.light.pairs,dark:models.dark.pairs}};
  const bp = JSON.parse(read(root,'tokens/tokens.json')).primitives.foundation['bp-md'].$value;
  if (!Number.isFinite(bp.value) || bp.unit !== 'px') throw Error('Breakpoint existente não resolvido.');
  let samples = '/* Amostras usam somente nomes existentes; fonte em provenance.json. */\n';
  for (const group of ['surfaces','action','states']) for (const [name] of roles[group]) samples += `.sample-${name.slice(2)} { background: var(${name}); }\n`;
  for (const name of roles.spaces) samples += `.sample-${name.slice(2)} { inline-size: var(${name}); }\n`;
  for (const name of roles.radii) samples += `.sample-${name.slice(2)} { border-radius: var(${name}); }\n`;
  for (const name of roles.shadows) samples += `.sample-${name.slice(2)} { box-shadow: var(${name}); }\n`;
  samples += `@media (width >= ${bp.value}${bp.unit}) { .layout { grid-template-columns: calc(var(--emp-space-3xl) * 3) minmax(0, 1fr); } .sidebar { display: block; } .mobile-nav { display: none; } main { padding-inline: var(--emp-margin-desktop); } .hero h1 { font-size: var(--text-display); } }\n`;
  const output = path.join(root,siteDir);
  const pages = { 'index.html':render(root,'light',models.light,provenance,book), 'dark.html':render(root,'dark',models.dark,provenance,book), 'fonts.css':`/* Faces oficiais lidas do preview canônico. */\n${fontFaces.join('\n')}\n`, 'samples.css':samples, 'provenance.json':JSON.stringify(provenance,null,2)+'\n' };
  fs.mkdirSync(output,{recursive:true});
  for (const [file,content] of Object.entries(pages)) fs.writeFileSync(path.join(output,file),content);
  return provenance;
}
if (require.main === module) { const p=build();console.log(`Brand System emprega+: 2 aparências, ${p.components.length} referências, conteúdo ${p.contentId.slice(0,12)}.`); }
module.exports = {build,model,escape};
