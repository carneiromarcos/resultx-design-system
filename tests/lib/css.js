/**
 * Leitura de CSS para os testes de contrato (lote P em diante).
 *
 * Não casa com o testMatch do Jest (não termina em .test.js), então não roda
 * como suíte. Os parsers são os mesmos de tests/brand-orb.test.js, extraídos
 * para não serem copiados a cada componente novo.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), 'utf-8');
const exists = (...p) => fs.existsSync(path.join(ROOT, ...p));
const semComentarios = (texto) => texto.replace(/\/\*[\s\S]*?\*\//g, '');

/** Lê um CSS sem comentários; string vazia se o arquivo ainda não existe. */
const css = (...p) => (exists(...p) ? semComentarios(read(...p)) : '');

/** Lê um arquivo qualquer; string vazia se ainda não existe. */
const texto = (...p) => (exists(...p) ? read(...p) : '');

/** Corpo de um bloco `{ … }` a partir do índice da chave de abertura. */
const corpoDoBloco = (fonte, abre) => {
  let profundidade = 1;
  let pos = abre + 1;
  while (pos < fonte.length && profundidade > 0) {
    if (fonte[pos] === '{') profundidade++;
    if (fonte[pos] === '}') profundidade--;
    pos++;
  }
  return fonte.slice(abre + 1, pos - 1);
};

/** Separa uma lista de seletores nas vírgulas de topo (não as de :is()). */
const seletoresDe = (cabeca) => {
  const partes = [];
  let nivel = 0;
  let atual = '';
  for (const ch of cabeca) {
    if (ch === '(') nivel++;
    if (ch === ')') nivel--;
    if (ch === ',' && nivel === 0) {
      partes.push(atual);
      atual = '';
    } else {
      atual += ch;
    }
  }
  partes.push(atual);
  return partes.map((s) => s.trim().replace(/\s+/g, ' '));
};

/** Todas as regras folha, com a pilha de at-rules (`contexto`). */
const regras = (fonte, contexto = []) => {
  const lista = [];
  let pos = 0;
  while (pos < fonte.length) {
    const abre = fonte.indexOf('{', pos);
    if (abre === -1) break;
    // Instruções sem bloco antes da regra (`@import …;`) não fazem parte dela.
    const cabeca = fonte.slice(pos, abre).split(';').pop().trim();
    const corpo = corpoDoBloco(fonte, abre);
    if (cabeca.startsWith('@')) {
      if (!cabeca.startsWith('@keyframes') && !cabeca.startsWith('@property')) {
        lista.push(...regras(corpo, [...contexto, cabeca]));
      }
    } else {
      for (const seletor of seletoresDe(cabeca)) {
        lista.push({ seletor, corpo, contexto });
      }
    }
    pos = abre + corpo.length + 2;
  }
  return lista;
};

/** Valor de uma declaração dentro de um corpo de regra (a última vence). */
const valor = (corpo, prop) => {
  const escapado = prop.replace(/-/g, '\\-');
  const achados = [
    ...corpo.matchAll(new RegExp(`(?:^|[;{\\s])${escapado}\\s*:\\s*([^;]+);`, 'g')),
  ];
  return achados.length ? achados[achados.length - 1][1].trim() : null;
};

const emReduzido = (r) => r.contexto.some((c) => /prefers-reduced-motion:\s*reduce/.test(c));

/**
 * Corpos das regras cujo seletor é exatamente `seletor`, juntos. Sem
 * `contexto`, só as que estão fora de at-rule; com ele, só as que estão
 * dentro de uma at-rule que contém o trecho.
 */
const regra = (fonte, seletor, { contexto } = {}) =>
  regras(fonte)
    .filter((r) => r.seletor === seletor)
    .filter((r) =>
      contexto === undefined
        ? r.contexto.length === 0
        : r.contexto.some((c) => c.includes(contexto)),
    )
    .map((r) => r.corpo)
    .join('\n');

/** Keyframes declarados: [{ nome, corpo }]. */
const keyframes = (fonte) =>
  [...fonte.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)].map((m) => ({
    nome: m[1],
    corpo: corpoDoBloco(fonte, fonte.indexOf('{', m.index)),
  }));

/** Propriedades que um keyframe mexe. */
const propsDoKeyframe = (corpo) => [...corpo.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);

module.exports = {
  ROOT,
  read,
  exists,
  css,
  texto,
  semComentarios,
  corpoDoBloco,
  regras,
  regra,
  valor,
  emReduzido,
  keyframes,
  propsDoKeyframe,
};
