#!/usr/bin/env node
// Migração gradual: apenas a camada compartilhada de dados está nesta fonte.
import StyleDictionary from 'style-dictionary';

function cssColor(color) {
  if (color.colorSpace !== 'srgb' || color.components.length !== 3 || color.alpha !== undefined) {
    throw new Error('A paleta compartilhada aceita apenas cores sRGB opacas.');
  }
  const hex = `#${color.components.map((channel) => {
    if (typeof channel !== 'number' || channel < 0 || channel > 1) throw new Error('Canal sRGB inválido.');
    return Math.round(channel * 255).toString(16).padStart(2, '0');
  }).join('').toUpperCase()}`;
  if (color.hex && color.hex.toUpperCase() !== hex) throw new Error(`Cor DTCG inconsistente: ${color.hex} / ${hex}`);
  return hex;
}

StyleDictionary.registerFormat({
  name: 'resultx/data-layer',
  format: ({ dictionary }) => {
    const tokens = dictionary.allTokens
      .filter((token) => token.path[0] === 'legacy' && token.path.length === 2)
      .sort((a, b) => a.$extensions['org.resultx.css'].index - b.$extensions['org.resultx.css'].index);
    const lines = tokens.map((token) => {
      const info = token.$extensions['org.resultx.css'];
      let value;
      if (token.$type === 'color') value = cssColor(token.$value);
      else if (token.$type === 'dimension') value = `${token.$value.value}${token.$value.unit}`;
      else if (token.$type === 'gradient') {
        const stops = token.$value.map((stop) => `${cssColor(stop.color)} ${stop.position * 100}%`).join(', ');
        value = `linear-gradient(${info.angle}deg, ${stops})`;
      } else throw new Error(`Tipo sem formato CSS: ${token.$type}`);
      return `  --${info.name}: ${value};`;
    });
    return `/* Gerado por scripts/build-data-layer.mjs a partir de tokens/tokens.json. Não editar. */\n:root {\n${lines.join('\n')}\n}\n`;
  },
});

const sd = new StyleDictionary({
  usesDtcg: true,
  source: [process.env.RESULTX_DATA_LAYER_SOURCE || 'tokens/tokens.json'],
  platforms: {
    css: {
      transforms: [],
      buildPath: `${process.env.RESULTX_DATA_LAYER_OUTPUT || 'tokens/themes'}/`,
      files: [{ destination: '_data-layer-shared.css', format: 'resultx/data-layer' }],
    },
  },
  log: { verbosity: 'silent' },
});
await sd.buildAllPlatforms();
