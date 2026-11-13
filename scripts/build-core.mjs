#!/usr/bin/env node
// Estrutura CSS está em layout; valores e aliases vêm exclusivamente do DTCG.
import fs from 'node:fs';
import postcss from 'postcss';
import StyleDictionary from 'style-dictionary';

const source = process.env.RESULTX_CORE_SOURCE || 'tokens/tokens.json';
const layout = process.env.RESULTX_CORE_LAYOUT || 'tokens/dtcg/layouts/core.css.tmpl';
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
function color(value, format) {
  if (value.colorSpace !== 'srgb' || value.components.length !== 3) throw new Error('Cor deve ser sRGB.');
  const rgb = value.components.map((channel) => {
    if (typeof channel !== 'number' || channel < 0 || channel > 1) throw new Error('Canal sRGB inválido.');
    return Math.round(channel * 255);
  });
  let hex = `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  if (value.hex && value.hex.toUpperCase() !== hex) throw new Error(`Cor DTCG inconsistente: ${value.hex} / ${hex}`);
  if (format.form === 'rgba') return `rgba(${rgb.join(', ')}, ${(value.alpha ?? 1).toFixed(format.precision)})`;
  if (value.alpha !== undefined && value.alpha !== 1) throw new Error('Cor hexadecimal não pode ter transparência.');
  if (format.form === 'hex-short' && [1, 3, 5].every((i) => hex[i] === hex[i + 1])) hex = `#${hex[1]}${hex[3]}${hex[5]}`;
  return format.lower ? hex.toLowerCase() : hex;
}
function shadow(value, formats) {
  if (!Array.isArray(value) || value.length !== formats.length) throw new Error('Camadas da sombra divergentes.');
  return value.map((s, i) => {
    const format = formats[i], dims = [s.offsetX, s.offsetY, s.blur, s.spread];
    const parts = dims.slice(0, format.parts).map((dimension, n) => {
      if (dimension.unit !== 'px') throw new Error('Dimensão da sombra deve ser em px.');
      return `${dimension.value}${format.units[n]}`;
    });
    return [...parts, color(s.color, format.color)].join(' ');
  }).join(', ');
}
StyleDictionary.registerFormat({
  name: 'resultx/core',
  format: ({ dictionary }) => {
    const tokens = new Map(dictionary.allTokens.map((token) => [token.path.join('.'), token]));
    const occurrences = data.$extensions['org.resultx.css'].coreOccurrences;
    const root = postcss.parse(fs.readFileSync(layout, 'utf8'));
    const used = new Set();
    root.walkDecls((decl) => {
      const marker = /^__RX_(t\d+)__$/.exec(decl.value);
      if (!marker) return;
      const id = marker[1], entry = occurrences[id];
      if (!entry || used.has(id) || decl.prop !== `--${entry.name}`) throw new Error(`Ocorrência inválida: ${id}`);
      used.add(id);
      const fmt = entry.format;
      const token = tokens.get(`legacy.core.${entry.theme}.${entry.name}`);
      let value;
      if (fmt.form === 'literal') value = fmt.value;
      else if (fmt.form === 'css-reference') {
        const primitive = tokens.get(`primitives.core.${entry.theme}.${entry.name}`);
        if (!token || token.$type !== 'fontWeight' || primitive?.original?.$value !== `{semantic.foundation.${fmt.target}}`) throw new Error(`Alias inválido: ${id}`);
        value = `var(--${fmt.target})`;
      } else if (!token || token.$type !== entry.type) throw new Error(`Token ausente ou incompatível: ${id}`);
      else if (entry.type === 'color') value = color(token.$value, fmt);
      else if (entry.type === 'shadow') value = shadow(token.$value, fmt.segments);
      else if (entry.type === 'dimension' || entry.type === 'duration') value = `${token.$value.value}${token.$value.unit}`;
      else if (entry.type === 'number' || entry.type === 'fontWeight') value = String(token.$value);
      else if (entry.type === 'cubicBezier') value = `cubic-bezier(${token.$value.join(', ')})`;
      else throw new Error(`Tipo sem formato CSS: ${entry.type}`);
      decl.value = value;
    });
    if (used.size !== Object.keys(occurrences).length) throw new Error('Ocorrências da fonte ausentes no layout.');
    return root.toString();
  },
});
const sd = new StyleDictionary({
  usesDtcg: true,
  source: [source],
  platforms: { css: { transforms: [], buildPath: `${process.env.RESULTX_CORE_OUTPUT || 'tokens'}/`,
    files: [{ destination: 'tokens.css', format: 'resultx/core' }] } },
  log: { verbosity: 'silent' },
});
await sd.buildAllPlatforms();
