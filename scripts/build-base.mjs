#!/usr/bin/env node
// Gera os tokens base e mantém a folha estrutural @layer emprega-base.
import fs from 'node:fs';
import StyleDictionary from 'style-dictionary';

const source = process.env.RESULTX_BASE_SOURCE || 'tokens/dtcg/tokens.json';
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
StyleDictionary.registerFormat({
  name: 'resultx/base',
  format: ({ dictionary }) => {
    const entries = dictionary.allTokens
      .filter((token) => token.path[0] === 'legacy' && token.path[1] === 'foundation')
      .map((token) => {
        const info = token.$extensions['org.resultx.css'];
        const format = info.format;
        let value;
        if (token.$type === 'dimension') value = `${token.$value.value}${token.$value.unit}`;
        else if (token.$type === 'number') value = `${token.$value}${format.unit || ''}`;
        else if (token.$type === 'fontWeight') value = String(token.$value);
        else if (token.$type === 'fontFamily') value = token.$value.map((name, i) => format.quoteIndices.includes(i) ? `'${name}'` : name).join(', ');
        else if (token.$type === 'transition') {
          const transition = token.$value;
          if (transition.duration.unit !== 'ms' || transition.delay.value !== 0 || transition.delay.unit !== 'ms') throw new Error('Transição base inválida.');
          const curve = transition.timingFunction;
          const expected = format.timing === 'ease' ? [0.25, 0.1, 0.25, 1] : format.timing === 'ease-out' ? [0, 0, 0.58, 1] : null;
          if (expected && JSON.stringify(curve) !== JSON.stringify(expected)) throw new Error(`Curva ${format.timing} inconsistente.`);
          const timing = expected ? format.timing : `cubic-bezier(${curve.join(', ')})`;
          value = `${transition.duration.value}ms ${timing}`;
        } else throw new Error(`Tipo base não suportado: ${token.$type}`);
        return { index: info.index, declaration: format.commented ? `  /* --${info.name}: ${value}; */` : `  --${info.name}: ${value};` };
      });
    for (const item of data.$extensions['org.resultx.css'].foundationStatic) {
      const value = item.lineBreakAfter ? `${item.values.slice(0, item.lineBreakAfter).join(', ')},\n    ${item.values.slice(item.lineBreakAfter).join(', ')}` : item.values.join(', ');
      entries.push({ index: item.index, declaration: `  --${item.name}: ${value};` });
    }
    entries.sort((a, b) => a.index - b.index);
    const structural = `@layer emprega-base {\n  h1, h2, h3, h4, h5, h6 {\n    font-family: var(--font-heading);\n    font-weight: var(--weight-semibold);\n    letter-spacing: var(--tracking-tight);\n    line-height: var(--leading-snug);\n  }\n  body {\n    font-family: var(--font-body);\n    font-weight: var(--weight-regular);\n    line-height: var(--leading-normal);\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n  code, kbd, pre, samp {\n    font-family: var(--font-mono);\n  }\n}`;
    return `/* Gerado por scripts/build-base.mjs a partir de tokens/dtcg/tokens.json. Não editar. */\n:root {\n${entries.map((entry) => entry.declaration).join('\n')}\n}\n\n${structural}\n`;
  },
});
const sd = new StyleDictionary({
  usesDtcg: true,
  source: [source],
  platforms: { css: { transforms: [], buildPath: `${process.env.RESULTX_BASE_OUTPUT || 'tokens/base'}/`,
    files: [{ destination: 'tokens-base.css', format: 'resultx/base' }] } },
  log: { verbosity: 'silent' },
});
await sd.buildAllPlatforms();
