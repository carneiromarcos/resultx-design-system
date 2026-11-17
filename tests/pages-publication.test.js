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
const BRAND_FIXTURES = {
  'emprega-mais': [
    'previews/brand-system/index.html', 'previews/brand-system/dark.html',
    'previews/brand-system/style.css', 'previews/brand-system/fonts.css',
    'previews/brand-system/samples.css', 'previews/brand-system/provenance.json',
    'tokens/tokens.css', 'tokens/ds-bridge.css',
    'assets/logo/emprega-plus-navy.png', 'assets/logo/emprega-plus-white.png'
  ],
  xscore: [
    'previews/brand-system/index.html', 'previews/brand-system/light.html',
    'previews/brand-system/style.css', 'tokens/tokens.css',
    'assets/logo/xscore-wordmark-light.svg', 'assets/logo/xscore-wordmark-dark.svg',
    'assets/logo/xscore-monogram.svg', 'assets/logo/xscore-favicon.svg',
    'assets/logo/README.md', 'docs/BRAND-BOOK.md', 'docs/parity-matrix.md'
  ]
};
const PRIVATE_FIXTURES = [
  'previews/prototypes/never-publish.html', 'previews/_archive/never-publish.html',
  'mockups/example.png', 'mockups-gov.html', 'brand-guidelines.html',
  'previews/brand-guidelines.html', 'previews/brand-system/build.cjs',
  'previews/brand-system/tests/verify.mjs', 'docs/qa/capture.png',
  'tokens/eds-root.css', 'tokens/pilot-aliases.css'
];
function writeFixture(root, file, content = file) {
  fs.mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
  fs.writeFileSync(path.join(root, file), content);
}
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
  for (const [brand, files] of Object.entries(BRAND_FIXTURES)) {
    for (const file of [...files, ...PRIVATE_FIXTURES]) writeFixture(root, `brands/${brand}/${file}`);
  }
  return root;
}
function withCatalog(root) {writeFixture(root, '_site/catalog/index.html', 'catálogo');}
function filesUnder(directory, prefix = '') {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const file = prefix + entry.name;
    return entry.isDirectory() ? filesUnder(path.join(directory, entry.name), file + '/') : [file];
  }).sort();
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

for (const [brand, files] of Object.entries(BRAND_FIXTURES)) test(`publicação inclui a entrada e dependências exatas de ${brand}`, () => {
  const root = fixture();
  try {
    withCatalog(root);
    const out = preparePages({root, out: path.join(root, 'publicado')});
    for (const file of files) {
      expect(fs.readFileSync(path.join(out, 'brands', brand, file), 'utf8')).toBe(`brands/${brand}/${file}`);
    }
    expect(filesUnder(path.join(out, 'brands', brand))).toEqual([...files].sort());
  } finally {fs.rmSync(root, {recursive: true, force: true});}
});

test('protótipos, arquivo, mockups e ferramentas de marca não entram no Pages', () => {
  const root = fixture();
  try {
    withCatalog(root);
    const out = preparePages({root, out: path.join(root, 'publicado')});
    for (const brand of Object.keys(BRAND_FIXTURES)) for (const file of PRIVATE_FIXTURES) {
      expect(fs.existsSync(path.join(out, 'brands', brand, file))).toBe(false);
      expect(fs.existsSync(path.join(root, 'brands', brand, file))).toBe(true);
    }
  } finally {fs.rmSync(root, {recursive: true, force: true});}
});

test('dependência de marca ausente falha antes de substituir a publicação', () => {
  const root = fixture();
  try {
    withCatalog(root);
    fs.unlinkSync(path.join(root, 'brands/emprega-mais/previews/brand-system/fonts.css'));
    const out = path.join(root, 'publicado');
    writeFixture(out, 'existente', 'antes');
    expect(() => preparePages({root, out})).toThrow();
    expect(fs.readFileSync(path.join(out, 'existente'), 'utf8')).toBe('antes');
  } finally {fs.rmSync(root, {recursive: true, force: true});}
});
