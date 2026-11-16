'use strict';

const fs = require('fs');
const cp = require('child_process');
const path = require('path');
// Verificação pontual do escopo da PR 1. Não executar na suíte permanente.
function guard(root, ref) {
  if (!ref) throw Error('Informe explicitamente a base desta revisão');
  const original = JSON.parse(cp.execFileSync('git', ['show', ref + ':package.json'], {
    cwd: root,
    encoding: 'utf8'
  }));
  const actual = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  if (actual.scripts['build:catalog'] !== 'node scripts/catalog/build.cjs') throw Error('Script não autorizado');
  delete actual.scripts['build:catalog'];
  if (JSON.stringify(actual) !== JSON.stringify(original)) throw Error('package.json mudou além do script autorizado');
  const protectedPaths = ['dist', 'brands', 'tokens', 'adapters', 'contracts', 'generated'];
  const changed = cp.execFileSync('git', ['status', '--porcelain', '--', ...protectedPaths], {
    cwd: root,
    encoding: 'utf8'
  });
  if (changed.trim()) throw Error('Pastas protegidas alteradas: ' + changed);
  cp.execFileSync('git', ['diff', ref, '--exit-code', '--', ...protectedPaths], {
    cwd: root
  });
  return 'Guarda: package.json restrito e pastas protegidas intactas';
}
module.exports = {
  guard
};

// A lista publicada também é verificada contra um archive descartável da base.
function checkPack(root, ref) {
  if (!ref) throw Error('Informe explicitamente a base desta revisão');
  const os = require('os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'catalog-pack-'));
  try {
    const archive = path.join(tmp, 'base.tar');
    cp.execFileSync('git', ['archive', '--output', archive, ref], {
      cwd: root
    });
    const extraction = cp.spawnSync('tar', ['-xf', archive, '-C', tmp]);
    fs.unlinkSync(archive);
    if (extraction.status !== 0) throw Error('Falha ao extrair referência do pacote');
    const env = {
      ...process.env,
      PATH: path.join(root, 'node_modules/.bin') + path.delimiter + process.env.PATH
    };
    function list(cwd) {
      const out = cp.execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
        cwd,
        env,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      });
      const json = JSON.parse(out.slice(out.indexOf('[\n')));
      return json[0].files.map(f => f.path).sort();
    }
    const before = list(tmp),
      after = list(root);
    require('assert').deepStrictEqual(after, before);
    return `npm pack: ${after.length} caminhos idênticos à base`;
  } finally {
    fs.rmSync(tmp, {
      recursive: true,
      force: true
    });
  }
}
module.exports.checkPack = checkPack;

if (require.main === module) {
  const [option, ref] = process.argv.slice(2);
  if (option !== '--base' || !ref || process.argv.length !== 4) {
    console.error('Uso pontual, fora do CI: node scripts/catalog/verify-pr1-scope.cjs --base <SHA>');
    process.exitCode = 2;
  } else {
    const root = path.resolve(__dirname, '../..');
    console.log(guard(root, ref));
    console.log(checkPack(root, ref));
  }
}
