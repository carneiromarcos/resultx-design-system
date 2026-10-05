/**
 * Empacotamento: todo @import do agregador components/components.css precisa
 * estar no campo "files" do package.json. Sem isso, quem consome a fonte
 * (export "./components/source") recebe um @import apontando para arquivo
 * ausente no pacote publicado.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGGREGATOR = path.join(ROOT, 'components', 'components.css');
const PKG = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const IMPORT_RE = /@import\s+(?:url\(\s*)?['"]?([^'")\s]+)['"]?\s*\)?/g;

function globToRegExp(glob) {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*');
  return new RegExp(`^${escaped}$`);
}

function isPublished(relPath, files) {
  return files.some((entry) => {
    const clean = entry.replace(/^\.\//, '');
    if (clean.endsWith('/')) return relPath.startsWith(clean);
    if (clean.includes('*')) return globToRegExp(clean).test(relPath);
    return relPath === clean || relPath.startsWith(`${clean}/`);
  });
}

function aggregatorImports() {
  const css = fs.readFileSync(AGGREGATOR, 'utf8');
  return [...css.matchAll(IMPORT_RE)].map(([, spec]) =>
    path.relative(ROOT, path.resolve(path.dirname(AGGREGATOR), spec)).split(path.sep).join('/'),
  );
}

describe('package.json "files" cobre os @import do agregador', () => {
  const imports = aggregatorImports();

  test('o agregador tem @import a verificar', () => {
    expect(imports.length).toBeGreaterThan(0);
  });

  test.each(imports)('%s existe e é publicado', (relPath) => {
    expect(fs.existsSync(path.join(ROOT, relPath))).toBe(true);
    expect(isPublished(relPath, PKG.files)).toBe(true);
  });
});
