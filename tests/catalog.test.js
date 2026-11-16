const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const cp = require('child_process');
const {
  coverage,
  bindings,
  resolve
} = require('../scripts/catalog/lib.cjs');
const {
  brands
} = require('../catalog/bindings.config');
const root = path.resolve(__dirname, '..');
test('d — trava rejeita contrato sem entrada em uma raiz de fixture', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-coverage-'));
  try {
    for (const dir of ['catalog', 'contracts', 'docs/components', 'components', 'adapters', 'examples', 'generated']) fs.cpSync(path.join(root, dir), path.join(tmp, dir), {
      recursive: true
    });
    fs.writeFileSync(path.join(tmp, 'contracts/novo.yaml'), 'componente: Novo');
    expect(() => coverage(tmp)).toThrow('Sem entrada no manifesto: contracts/novo.yaml');
  } finally {
    fs.rmSync(tmp, {
      recursive: true,
      force: true
    });
  }
});
test('manifesto cobre contratos, fichas e imports atuais', () => {
  const result = coverage(root);
  expect(result.expected).toEqual(expect.arrayContaining(fs.readdirSync(path.join(root, 'contracts')).filter(f => f.endsWith('.yaml')).map(f => 'contracts/' + f)));
});
test('ligações somente var de origem existente e sem ciclos', () => {
  for (const b of brands) for (const theme of ['light', 'dark']) {
    const r = bindings(root, b, theme);
    for (const [k, v] of Object.entries(r.aliases)) {
      expect(v).toMatch(/^--[\w-]+$/);
      expect(resolve(r.values, k)).toBeTruthy();
    }
  }
});
test('build duplo determinístico', () => {
  const hashes = () => {
    const walk = d => fs.readdirSync(d, {
      withFileTypes: true
    }).sort((a, b) => a.name.localeCompare(b.name)).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [[path.relative(root, path.join(d, e.name)), crypto.createHash('sha256').update(fs.readFileSync(path.join(d, e.name))).digest('hex')]]);
    return walk(path.join(root, '_site/catalog'));
  };
  cp.execFileSync(process.execPath, ['scripts/catalog/build.cjs'], {
    cwd: root
  });
  const first = hashes();
  cp.execFileSync(process.execPath, ['scripts/catalog/build.cjs'], {
    cwd: root
  });
  expect(hashes()).toEqual(first);
});
test('fontes novas correspondem aos hashes registrados', () => {
  for (const dir of ['plus-jakarta-sans', 'geist-mono']) {
    const base = path.join(root, 'assets/fonts', dir);
    const readme = fs.readFileSync(path.join(base, 'README.md'), 'utf8');
    for (const file of fs.readdirSync(base).filter(f => /woff2|OFL\.txt/.test(f))) expect(readme).toContain(crypto.createHash('sha256').update(fs.readFileSync(path.join(base, file))).digest('hex') + '  ' + file);
  }
});
test('todos os papéis consumidos pelas fundações resolvem nas dez combinações', () => {
  const css = fs.readFileSync(path.join(root, 'catalog/foundations.css'), 'utf8');
  const roles = [...css.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]);
  for (const brand of brands) for (const theme of ['dark', 'light']) {
    const values = bindings(root, brand, theme).values;
    // As tintas dos estados são escolhidas pelo gerador entre papéis existentes.
    for (const role of roles.filter(x => !x.endsWith('-ink'))) expect(resolve(values, role)).toBeTruthy();
  }
});
test('fundações têm vinte documentos e a saída tem CSP sem scripts', () => {
  const walk = d => fs.readdirSync(d, {
    withFileTypes: true
  }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const html = walk(path.join(root, '_site/catalog')).filter(p => p.endsWith('.html'));
  const foundations = html.filter(file => /[\\/]fundacoes[\\/](?:index|example)\.html$/.test(file));
  expect(foundations).toHaveLength(20);
  for (const file of html) {
    const text = fs.readFileSync(file, 'utf8');
    expect(text).toContain('content="default-src \'self\'"');
    expect(text).not.toMatch(/\bstyle=|text-transform|MBTI|\b[EI][NS][TF][JP]\b/i);
    if (!/[\\/](confirm-dialog|data-table)[\\/]example\.html$/.test(file)) expect(text).not.toMatch(/<script\b/i);
  }
});

test.each(['docs/components/novo.md', 'components/novo.css'])('trava rejeita nova cobertura de %s', file => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'catalog-new-'));
  try {
    for (const dir of ['catalog','contracts','docs/components','components','adapters','examples','generated']) fs.cpSync(path.join(root,dir),path.join(tmp,dir),{recursive:true});
    fs.writeFileSync(path.join(tmp,file),'Novo');
    if (file.endsWith('.css')) fs.appendFileSync(path.join(tmp,'components/components.css'),'\n@import "./novo.css";');
    expect(() => coverage(tmp)).toThrow('Sem entrada no manifesto: '+file);
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
test('nomes inexistentes e ciclos não passam como valores resolvidos',()=>{
  expect(()=>resolve({'--a':'var(--b)','--b':'var(--a)'},'--a')).toThrow('Ciclo');
  expect(()=>resolve({},'--inexistente')).toThrow('Papel vazio');
  const b=JSON.parse(JSON.stringify(brands[0])); b.common['--qualquer']='--inexistente';
  expect(()=>bindings(root,b,'dark')).toThrow('Ligação inválida');
});

test('geração não escreve nas pastas protegidas do estado atual', () => {
  const directories = ['dist', 'brands', 'tokens', 'adapters', 'contracts', 'generated'];
  const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))
    .flatMap(entry => entry.isDirectory() ? walk(path.join(dir,entry.name)) : [[path.relative(root,path.join(dir,entry.name)),crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,entry.name))).digest('hex')]]);
  const snapshot = () => directories.flatMap(dir => walk(path.join(root,dir)));
  const before = snapshot();
  cp.execFileSync(process.execPath, ['scripts/catalog/build.cjs'], {cwd:root});
  expect(snapshot()).toEqual(before);
});

test('novo contrato registrado não fica preso à contagem histórica', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-growth-'));
  try {
    for (const dir of ['catalog','contracts','docs/components','components','adapters','examples','generated']) fs.cpSync(path.join(root,dir),path.join(tmp,dir),{recursive:true});
    fs.writeFileSync(path.join(tmp,'contracts/novo.yaml'),'componente: Novo');
    fs.appendFileSync(path.join(tmp,'catalog/manifest.yaml'),'\n  - file: contracts/novo.yaml\n    reason: "Cobertura declarada pela evolução da fixture."\n');
    expect(coverage(tmp).expected).toContain('contracts/novo.yaml');
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});

// As provas que geram a mesma saída ficam na mesma suíte para não concorrer.
test('build funciona sem executável git e refaz uma saída parcial', () => {
  const out = path.join(root, '_site/catalog');
  fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'incompleto'),'geração abortada');
  cp.execFileSync(process.execPath,['scripts/catalog/build.cjs'],{cwd:root,env:{...process.env,PATH:'',GITHUB_SHA:''}});
  expect(fs.existsSync(path.join(out,'incompleto'))).toBe(false);
  expect(fs.readFileSync(path.join(out,'xscore/dark/fundacoes/example.html'),'utf8')).toContain('geração local');
});

const ids = ['button', 'card', 'confirm-dialog', 'data-table', 'empty-state', 'field', 'stat-card', 'status-badge'];
test('catálogo registra os oito contratos como páginas nas dez combinações', () => {
  const manifest = yaml.load(fs.readFileSync(path.join(root, 'catalog/manifest.yaml'), 'utf8'));
  for (const id of ids) {
    const entry = manifest.pages.find(page => page.id === id);
    expect(entry).toBeDefined();
    expect(entry.contract).toBe(`contracts/${id}.yaml`);
    expect(entry.js).toEqual(['confirm-dialog','data-table'].includes(id) ? [`catalog/behaviors/${id}.js`] : []);
    for (const brand of ['eletia', 'emprega', 'xscore', 'pdv', 'resultx']) for (const theme of ['light', 'dark']) {
      const dir = path.join(root, '_site/catalog', brand, theme, id);
      expect(fs.existsSync(path.join(dir, 'index.html'))).toBe(true);
      const html = fs.readFileSync(path.join(dir, 'example.html'), 'utf8');
      expect(html).not.toMatch(/\bon\w+=|style=/i);
      expect((html.match(/<script\b/g)||[]).length).toBe(['confirm-dialog','data-table'].includes(id) ? 1 : 0);
      const contract = yaml.load(fs.readFileSync(path.join(root, entry.contract), 'utf8'));
      for (const state of Object.keys(contract.estados)) expect(html).toContain(`data-contract-state="${state}"`);
      for (const item of contract.casos_teste) expect(html).toContain(item.id);
    }
  }
});


test('JavaScript só é autorizado nas duas páginas de comportamento', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-js-'));
  try {
    for (const dir of ['catalog','contracts','docs/components','components','adapters','examples','generated']) fs.cpSync(path.join(root,dir),path.join(tmp,dir),{recursive:true});
    const file=path.join(tmp,'catalog/manifest.yaml');
    const manifest=yaml.load(fs.readFileSync(file,'utf8'));
    manifest.pages.find(p=>p.id==='button').js=['catalog/behaviors/data-table.js'];
    fs.writeFileSync(file,yaml.dump(manifest));
    expect(()=>coverage(tmp)).toThrow('JavaScript fora da autorização do catálogo: button');
  } finally { fs.rmSync(tmp,{recursive:true,force:true}); }
});
test('estilos de mouse e foco são derivados das declarações atuais do adaptador', () => {
  const {demoStyles,elementById} = require('../scripts/catalog/components.cjs');
  const css=fs.readFileSync(path.join(root,'adapters/css/pilot.css'),'utf8');
  const tree=require('postcss').parse(demoStyles(css));
  tree.walkRules(rule=>{
    const selectors=require('postcss').list.comma(rule.selector);
    for(const selector of selectors) {
      const original=selector.replace(/\[data-catalog-state="hover"\]/g,':hover').replace(/\[data-catalog-state="ativo"\]/g,':active').replace(/\[data-catalog-state="foco"\]/g,':focus-visible');
      const matches=[];require('postcss').parse(css).walkRules(r=>{if(require('postcss').list.comma(r.selector).includes(original))matches.push(r);});
      expect(matches.some(r=>JSON.stringify(r.nodes.map(n=>[n.prop,n.value]))===JSON.stringify(rule.nodes.map(n=>[n.prop,n.value])))).toBe(true);
    }
  });
  expect(elementById('<section id="a"><section>Dentro</section>Fora</section>','a')).toBe('<section id="a"><section>Dentro</section>Fora</section>');
  expect(()=>elementById('', 'sumiu')).toThrow('Exemplo do piloto ausente');
});
test('legado recolhido não carrega CSS nem JS dentro do exemplo oficial',()=>{
 for(const d of require('../catalog/legacy.config.cjs').filter(d=>d.successor))for(const b of brands)for(const theme of ['light','dark']){
  const dir=path.join(root,'_site/catalog',b.id,theme,d.id);
  const official=fs.readFileSync(path.join(dir,'example.html'),'utf8');
  expect(official).toContain('<details data-legacy>');
  expect(official).not.toMatch(/<details data-legacy open/);
  expect(official).not.toContain('href="../../../assets/components/components.css"');
  const legacy=fs.readFileSync(path.join(dir,'legacy.html'),'utf8');expect(legacy).not.toMatch(/<script\b/);expect(legacy).toContain('data-brand="'+b.id+'"');
 }
});
