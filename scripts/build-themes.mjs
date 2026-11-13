#!/usr/bin/env node
// Três temas opt-in; os demais artefatos ainda não usam esta fonte.
import StyleDictionary from 'style-dictionary';

function rgbaComponents(color) {
  if (color.colorSpace !== 'srgb' || color.components.length !== 3) throw new Error('Cor deve ser sRGB.');
  return color.components.map((channel) => {
    if (typeof channel !== 'number' || channel < 0 || channel > 1) throw new Error('Canal sRGB inválido.');
    return Math.round(channel * 255);
  });
}
function renderColor(color, format) {
  const rgb = rgbaComponents(color);
  const hex = `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  if (color.hex && color.hex.toUpperCase() !== hex) throw new Error(`Cor DTCG inconsistente: ${color.hex} / ${hex}`);
  if (format.form === 'rgba') return `rgba(${rgb.join(', ')}, ${(color.alpha ?? 1).toFixed(format.precision)})`;
  if (color.alpha !== undefined && color.alpha !== 1) throw new Error('Transparência exige formato rgba.');
  if (format.form === 'hex-short' && [1, 3, 5].every((i) => hex[i] === hex[i + 1])) return `#${hex[1]}${hex[3]}${hex[5]}`;
  return hex;
}
function renderShadow(value, formats) {
  if (!Array.isArray(value) || value.length !== formats.length) throw new Error('Camadas da sombra divergentes.');
  return value.map((shadow, i) => {
    const fmt = formats[i];
    const dims = [shadow.offsetX, shadow.offsetY, shadow.blur, shadow.spread];
    const parts = dims.slice(0, fmt.parts).map((dimension, n) => {
      if (dimension.unit !== 'px') throw new Error('Dimensão da sombra deve ser em px.');
      return `${dimension.value}${fmt.units[n]}`;
    });
    return [...parts, renderColor(shadow.color, fmt.color)].join(' ');
  }).join(', ');
}
StyleDictionary.registerFormat({
  name: 'resultx/theme',
  format: ({ dictionary, file }) => {
    const theme = file.options.theme;
    const tokens = dictionary.allTokens.filter((token) => token.path[0] === 'legacy' && token.path[2] === theme)
      .sort((a, b) => a.$extensions['org.resultx.css'].index - b.$extensions['org.resultx.css'].index);
    if (!tokens.length) throw new Error(`Tema sem tokens: ${theme}`);
    const lines = tokens.map((token) => {
      const info = token.$extensions['org.resultx.css'];
      let value;
      if (token.$type === 'color') value = renderColor(token.$value, info.format);
      else if (token.$type === 'dimension') value = `${token.$value.value}${token.$value.unit}`;
      else if (token.$type === 'shadow') value = renderShadow(token.$value, info.format.segments);
      else throw new Error(`Tipo sem formato CSS: ${token.$type}`);
      return `  --${info.name}: ${value};`;
    });
    return `/* Gerado por scripts/build-themes.mjs a partir de tokens/tokens.json. Não editar. */\n[data-theme="${theme}"] {\n${lines.join('\n')}\n}\n`;
  },
});
const themes = ['premium-light', 'sober-dark', 'vibrant-dark'];
const sd = new StyleDictionary({
  usesDtcg: true,
  source: [process.env.RESULTX_THEMES_SOURCE || 'tokens/tokens.json'],
  platforms: {
    css: {
      transforms: [],
      buildPath: `${process.env.RESULTX_THEMES_OUTPUT || 'tokens/themes'}/`,
      files: themes.map((theme) => ({ destination: `${theme}.css`, format: 'resultx/theme', options: { theme } })),
    },
  },
  log: { verbosity: 'silent' },
});
await sd.buildAllPlatforms();
