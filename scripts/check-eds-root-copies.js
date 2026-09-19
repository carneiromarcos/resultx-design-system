#!/usr/bin/env node
'use strict';

/**
 * ResultX Design System — eds-root.css: as três cópias batem?
 *
 * ADR-0002 decisão 3 / passo 4c. O arquivo Laravel da marca Emprega+
 * (`brands/emprega-mais/tokens/eds-root.css`) é vendored — copiado, não
 * instalado — em dois produtos. A trava de cada repo (teste que compara o
 * SHA-256 da própria cópia com `eds-root.sha256`) impede edição local sem
 * intenção, mas NÃO enxerga os outros repos. Este script fecha esse buraco:
 * baixa cada cópia pela API do GitHub e compara com o canônico local.
 *
 * Uso: `npm run check:eds-root` (exige `gh auth status` ok; os repos dos
 * produtos são privados). Sai com 1 se qualquer cópia divergir.
 *
 * Ao mudar eds-root.css: regravar eds-root.sha256, copiar o arquivo para os
 * dois produtos e atualizar a constante do teste de cada um. Depois rodar
 * este script até as três linhas dizerem "igual".
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CANONICAL = path.join(ROOT, 'brands/emprega-mais/tokens/eds-root.css');
const SHA_FILE = path.join(ROOT, 'brands/emprega-mais/tokens/eds-root.sha256');

// Onde cada produto guarda a cópia. `ref` é a branch onde a cópia é
// verdade: o IMO sobe direto na main; o EditalHub só é verdade em `dev`
// até ser promovido (ADR-0006 de lá).
const COPIES = [
  { repo: 'empregamais/emprega-mais-imo', ref: 'main', file: 'public/css/eds-root.css' },
  { repo: 'empregamais/app', ref: 'dev', file: 'public/site/css/eds-root.css' },
  { repo: 'empregamais/app', ref: 'main', file: 'public/site/css/eds-root.css' },
];

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function fetchRemote({ repo, ref, file }) {
  // Accept.raw devolve o conteúdo bruto, sem base64 — o hash é do byte.
  return execFileSync(
    'gh',
    ['api', '-H', 'Accept: application/vnd.github.raw', `repos/${repo}/contents/${file}?ref=${ref}`],
    { encoding: 'buffer', stdio: ['ignore', 'pipe', 'pipe'] }
  );
}

function main() {
  const local = sha256(fs.readFileSync(CANONICAL));
  const recorded = fs.readFileSync(SHA_FILE, 'utf8').trim();

  console.log(`canônico  ${local.slice(0, 12)}…  brands/emprega-mais/tokens/eds-root.css`);
  if (local !== recorded) {
    console.error(`✗ eds-root.sha256 registra ${recorded.slice(0, 12)}…, o arquivo dá ${local.slice(0, 12)}…`);
    console.error('  Regrave o .sha256 antes de conferir as cópias.');
    process.exit(1);
  }

  let divergent = 0;
  for (const copy of COPIES) {
    const label = `${copy.repo}@${copy.ref}:${copy.file}`;
    let remote;
    try {
      remote = sha256(fetchRemote(copy));
    } catch (err) {
      const msg = (err.stderr && err.stderr.toString().trim()) || err.message;
      // 404 na main do EditalHub é esperado enquanto a #662 não for promovida.
      console.log(`?  ausente   ${label}\n   ${msg.split('\n')[0]}`);
      divergent += 1;
      continue;
    }
    const same = remote === local;
    if (!same) divergent += 1;
    console.log(`${same ? '✓ igual   ' : '✗ DIVERGE '} ${remote.slice(0, 12)}…  ${label}`);
  }

  if (divergent) {
    console.error(`\n${divergent} cópia(s) fora do canônico.`);
    process.exit(1);
  }
  console.log('\nAs três cópias batem com o canônico.');
}

main();
