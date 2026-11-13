#!/usr/bin/env node
// A compatibilidade é opt-in: o CSS padrão não recebe novas variáveis.
import StyleDictionary from 'style-dictionary';
StyleDictionary.registerFormat({
  name: 'resultx/legacy-aliases',
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens.filter((token) => token.path[0] === 'legacy' && token.path[1] === 'consumer')
      .sort((a, b) => a.$extensions['org.resultx.css'].index - b.$extensions['org.resultx.css'].index);
    if (tokens.length !== 5) throw new Error(`Esperados 5 aliases de consumo; encontrados ${tokens.length}.`);
    const lines = tokens.map((token) => {
      const info = token.$extensions['org.resultx.css'];
      if (!token.$deprecated || token.original.$value !== `{semantic.core.dark.${info.target}}`) throw new Error(`Alias inválido: ${info.name}`);
      return `  --${info.name}: var(--${info.target});`;
    });
    return `/* Compatibilidade opt-in, gerada de tokens/tokens.json. Aliases obsoletos. */\n:root, [data-theme] {\n${lines.join('\n')}\n}\n`;
  },
});
const sd = new StyleDictionary({
  usesDtcg: true,
  source: [process.env.RESULTX_ALIASES_SOURCE || 'tokens/tokens.json'],
  platforms: { css: { transforms: [], buildPath: `${process.env.RESULTX_ALIASES_OUTPUT || 'tokens'}/`,
    files: [{ destination: 'legacy-aliases.css', format: 'resultx/legacy-aliases' }] } },
  log: { verbosity: 'silent' },
});
await sd.buildAllPlatforms();
