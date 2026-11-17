'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const PUBLIC_PATHS = ['dist', 'tokens', 'components', 'docs', 'demos', 'brands/resultx', 'assets/fonts', 'DESIGN-SYSTEM.md'];
// Arquivos das duas entradas e seus recursos/links locais; nunca copiar a marca inteira.
const BRAND_SYSTEM_FILES = [
  'brands/emprega-mais/previews/brand-system/index.html',
  'brands/emprega-mais/previews/brand-system/dark.html',
  'brands/emprega-mais/previews/brand-system/style.css',
  'brands/emprega-mais/previews/brand-system/fonts.css',
  'brands/emprega-mais/previews/brand-system/samples.css',
  'brands/emprega-mais/previews/brand-system/provenance.json',
  'brands/emprega-mais/tokens/tokens.css',
  'brands/emprega-mais/tokens/ds-bridge.css',
  'brands/emprega-mais/assets/logo/emprega-plus-navy.png',
  'brands/emprega-mais/assets/logo/emprega-plus-white.png',
  'brands/xscore/previews/brand-system/index.html',
  'brands/xscore/previews/brand-system/light.html',
  'brands/xscore/previews/brand-system/style.css',
  'brands/xscore/tokens/tokens.css',
  'brands/xscore/assets/logo/xscore-wordmark-light.svg',
  'brands/xscore/assets/logo/xscore-wordmark-dark.svg',
  'brands/xscore/assets/logo/xscore-monogram.svg',
  'brands/xscore/assets/logo/xscore-favicon.svg',
  'brands/xscore/assets/logo/README.md',
  'brands/xscore/docs/BRAND-BOOK.md',
  'brands/xscore/docs/parity-matrix.md'
];
const ROOT = path.resolve(__dirname, '..');
// A lista de publicação vive aqui: o workflow e os testes chamam esta função.
function preparePages({
  root = ROOT,
  out = path.join(root, '_site')
} = {}) {
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'resultx-pages-'));
  try {
    for (const file of PUBLIC_PATHS) {
      const target = path.join(stage, file);
      fs.mkdirSync(path.dirname(target), {
        recursive: true
      });
      fs.cpSync(path.join(root, file), target, {
        recursive: true
      });
    }
    for (const file of BRAND_SYSTEM_FILES) {
      const source = path.join(root, file);
      if (!fs.statSync(source).isFile()) throw Error(`Publicação de marca exige arquivo: ${file}`);
      const target = path.join(stage, file);
      fs.mkdirSync(path.dirname(target), {recursive: true});
      fs.copyFileSync(source, target);
    }
    const catalog = path.join(root, '_site/catalog');
    if (!fs.existsSync(path.join(catalog, 'index.html'))) throw Error('Execute npm run build:catalog antes de preparar o Pages');
    fs.cpSync(catalog, path.join(stage, 'catalog'), {
      recursive: true
    });
    fs.writeFileSync(path.join(stage, 'index.html'), '<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>ResultX Design System</title><meta http-equiv="refresh" content="0; url=docs/viewer.html"><p><a href="docs/viewer.html">ResultX Design System — abrir o viewer</a></p></html>');
    fs.rmSync(out, {
      recursive: true,
      force: true
    });
    fs.cpSync(stage, out, {
      recursive: true
    });
  } finally {
    fs.rmSync(stage, {
      recursive: true,
      force: true
    });
  }
  return out;
}
if (require.main === module) preparePages();
module.exports = {
  preparePages,
  PUBLIC_PATHS,
  BRAND_SYSTEM_FILES
};
