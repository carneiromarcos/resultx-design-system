const fs = require('fs');
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
    for (const dir of ['catalog', 'contracts', 'docs/components', 'components']) fs.cpSync(path.join(root, dir), path.join(tmp, dir), {
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
test('manifesto cobre contratos, fichas e imports', () => expect(coverage(root).expected.length).toBe(54));
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
test('saída contém só os vinte documentos esperados com CSP e sem scripts', () => {
  const walk = d => fs.readdirSync(d, {
    withFileTypes: true
  }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  const html = walk(path.join(root, '_site/catalog')).filter(p => p.endsWith('.html'));
  expect(html).toHaveLength(20);
  for (const file of html) {
    const text = fs.readFileSync(file, 'utf8');
    expect(text).toContain('content="default-src \'self\'"');
    expect(text).not.toMatch(/<script\b|\bstyle=|text-transform|MBTI|\b[EI][NS][TF][JP]\b/i);
  }
});

test.each(['docs/components/novo.md', 'components/novo.css'])('trava rejeita nova cobertura de %s', file => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(),'catalog-new-'));
  try {
    for (const dir of ['catalog','contracts','docs/components','components']) fs.cpSync(path.join(root,dir),path.join(tmp,dir),{recursive:true});
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
