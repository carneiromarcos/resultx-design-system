const fs = require('fs'),
  path = require('path'),
  os = require('os'),
  yaml = require('js-yaml');
const {
  preparePages,
  PUBLIC_PATHS
} = require('../scripts/prepare-pages.cjs');
const root = path.resolve(__dirname, '..');
test('workflow usa a mesma montagem testada, após gerar o catálogo', () => {
  const steps = yaml.load(fs.readFileSync(path.join(root, '.github/workflows/pages.yml'), 'utf8')).jobs.deploy.steps;
  const runs = steps.map(s => s.run || '');
  const generation = runs.indexOf('npm run build:catalog'),
    publication = runs.indexOf('node scripts/prepare-pages.cjs');
  expect(generation).toBeGreaterThan(runs.indexOf('npm run build'));
  expect(publication).toBeGreaterThan(generation);
  expect(runs.some(s => /cp -r|mkdir -p _site/.test(s))).toBe(false);
});
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pages-unit-'));
  for (const file of PUBLIC_PATHS) {
    if (file.endsWith('.md')) fs.writeFileSync(path.join(root, file), 'documento');else {
      fs.mkdirSync(path.join(root, file), {
        recursive: true
      });
      fs.writeFileSync(path.join(root, file, 'prova.txt'), file);
    }
  }
  return root;
}
test('montagem inclui catálogo e fontes sem alterar entradas de origem', () => {
  const root = fixture();
  try {
    fs.mkdirSync(path.join(root, '_site/catalog'), {
      recursive: true
    });
    fs.writeFileSync(path.join(root, '_site/catalog/index.html'), 'catálogo');
    const out = path.join(root, 'publicado');
    preparePages({
      root,
      out
    });
    expect(fs.readFileSync(path.join(out, 'catalog/index.html'), 'utf8')).toBe('catálogo');
    expect(fs.readFileSync(path.join(out, 'assets/fonts/prova.txt'), 'utf8')).toBe('assets/fonts');
    for (const file of PUBLIC_PATHS) expect(fs.existsSync(path.join(root, file))).toBe(true);
  } finally {
    fs.rmSync(root, {
      recursive: true,
      force: true
    });
  }
});
test('catálogo ausente falha sem apagar publicação anterior', () => {
  const root = fixture();
  try {
    const out = path.join(root, 'publicado');
    fs.mkdirSync(out);
    fs.writeFileSync(path.join(out, 'existente'), 'antes');
    expect(() => preparePages({
      root,
      out
    })).toThrow('build:catalog');
    expect(fs.readFileSync(path.join(out, 'existente'), 'utf8')).toBe('antes');
  } finally {
    fs.rmSync(root, {
      recursive: true,
      force: true
    });
  }
});

test('montagem padrão preserva o catálogo gerado dentro do próprio _site',()=>{
  const root=fixture();
  try {
    const source=path.join(root,'_site/catalog/index.html');fs.mkdirSync(path.dirname(source),{recursive:true});fs.writeFileSync(source,'catálogo pronto');
    expect(preparePages({root})).toBe(path.join(root,'_site'));
    expect(fs.readFileSync(source,'utf8')).toBe('catálogo pronto');
    expect(fs.existsSync(path.join(root,'_site/docs/prova.txt'))).toBe(true);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
});
