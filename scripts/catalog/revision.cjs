'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Não invoca git: também funciona em archives e containers com outro proprietário.
function revisionInfo({revision, env = process.env, root = path.resolve(__dirname, '../..')} = {}) {
  const sha = revision || env.GITHUB_SHA;
  if (sha) {
    if (!/^[a-f0-9]{40}$/i.test(sha)) throw Error('Revisão deve ser um SHA completo de 40 caracteres');
    return {label: sha, ref: sha};
  }
  const hash = crypto.createHash('sha256');
  for (const file of ['tokens/tokens.json', 'catalog/manifest.yaml', 'catalog/bindings.config.js', 'catalog/recipes/fundacoes.html', 'scripts/catalog/build.cjs']) {
    hash.update(file + '\0').update(fs.readFileSync(path.join(root, file)));
  }
  // Identifica uma geração local; não finge conhecer um commit nem cria URL com SHA falso.
  return {label: 'geração local ' + hash.digest('hex').slice(0, 16), ref: 'main'};
}
module.exports = {revisionInfo};
