#!/usr/bin/env node
// Geração bloqueada por SHA: a cópia usada por IMO/EditalHub não pode mudar.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';
import StyleDictionary from 'style-dictionary';
import { renderLayoutValues } from './lib/layout-values.mjs';

const source = process.env.RESULTX_EDS_SOURCE || 'tokens/tokens.json';
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
const frozen = 'c2366a517a96da9e8f31f5a466e82fc8bc37de66ed769a190b0c22b67931ce86';
function color(value, format) {
  if (value.colorSpace !== 'srgb' || value.components.length !== 3) throw new Error('Cor deve ser sRGB.');
  const rgb = value.components.map((channel) => {
    if (typeof channel !== 'number' || channel < 0 || channel > 1) throw new Error('Canal sRGB inválido.');
    return Math.round(channel * 255);
  });
  let hex = `#${rgb.map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
  if (value.hex && value.hex.toUpperCase() !== hex) throw new Error(`Cor DTCG inconsistente: ${value.hex} / ${hex}`);
  if (format.form === 'transparent') {
    if ((value.alpha ?? 1) !== 0) throw new Error('Cor transparente exige alpha zero.');
    return 'transparent';
  }
  if (format.form === 'rgba') {
    let alpha = (value.alpha ?? 1).toFixed(format.precision);
    if (format.omitLeadingZero && alpha.startsWith('0.')) alpha = alpha.slice(1);
    return `rgba(${rgb[0]}${format.separators[0]}${rgb[1]}${format.separators[1]}${rgb[2]}${format.separators[2]}${alpha})`;
  }
  if (value.alpha !== undefined && value.alpha !== 1) throw new Error('Hexadecimal não aceita transparência neste formato.');
  if (format.form === 'hex-short' && [1, 3, 5].every((i) => hex[i] === hex[i + 1])) hex = `#${hex[1]}${hex[3]}${hex[5]}`;
  return format.lower ? hex.toLowerCase() : hex;
}
function shadow(value, formats) {
  if (!Array.isArray(value) || value.length !== formats.length) throw new Error('Camadas da sombra divergentes.');
  return value.map((s, i) => {
    const fmt = formats[i], dims = [s.offsetX, s.offsetY, s.blur, s.spread];
    return [...dims.slice(0, fmt.parts).map((d, n) => {
      if (d.unit !== 'px') throw new Error('Dimensão da sombra deve ser px.');
      return `${d.value}${fmt.units[n]}`;
    }), color(s.color, fmt.color)].join(' ');
  }).join(', ');
}
StyleDictionary.registerFormat({
  name: 'resultx/eds-root',
  format: ({ dictionary }) => {
    const tokens = new Map(dictionary.allTokens.map((token) => [token.path.join('.'), token]));
    const occurrences = data.$extensions['org.resultx.css'].edsOccurrences;
    const root = postcss.parse(fs.readFileSync('tokens/dtcg/layouts/eds-root.css.tmpl', 'utf8'));
    renderLayoutValues(root, dictionary, data, 'eds-root');
    const used = new Set();
    root.walkDecls((decl) => {
      const match = /^__RX_(e\d+)__$/.exec(decl.value);
      if (!match) return;
      const id = match[1], entry = occurrences[id];
      if (!entry || used.has(id) || decl.prop !== `--${entry.name}`) throw new Error(`Ocorrência EDS inválida: ${id}`);
      used.add(id);
      const fmt = entry.format;
      const token = tokens.get(`legacy.eds.${entry.scope}.${entry.name}`);
      let value;
      if (fmt.form === 'css-expression') value = fmt.value;
      else if (!token || token.$type !== entry.type) throw new Error(`Token EDS ausente ou incompatível: ${id}`);
      else if (entry.type === 'color') value = color(token.$value, fmt);
      else if (entry.type === 'shadow') value = shadow(token.$value, fmt.segments);
      else if (entry.type === 'dimension') value = `${token.$value.value}${token.$value.unit}`;
      else if (entry.type === 'fontFamily') value = token.$value.map((name, i) => fmt.quoteIndices.includes(i) ? `'${name}'` : name).join(', ');
      else throw new Error(`Tipo EDS sem formato CSS: ${entry.type}`);
      decl.value = value;
    });
    if (used.size !== Object.keys(occurrences).length) throw new Error('Ocorrências EDS ausentes no layout.');
    return root.toString();
  },
});
const sd = new StyleDictionary({
  usesDtcg: true, source: [source],
  platforms: { css: { transforms: [], files: [{ destination: 'eds-root.css', format: 'resultx/eds-root' }] } },
  log: { verbosity: 'silent' },
});
const result = await sd.formatAllPlatforms();
const generated = result.css[0].output;
const digest = crypto.createHash('sha256').update(generated).digest('hex');
const recorded = fs.readFileSync('brands/emprega-mais/tokens/eds-root.sha256', 'utf8');
const current = crypto.createHash('sha256').update(fs.readFileSync('brands/emprega-mais/tokens/eds-root.css')).digest('hex');
if (digest !== frozen || current !== frozen || recorded !== `${frozen}\n`) throw new Error(`EDS congelado: SHA gerado ${digest}, esperado ${frozen}; nenhum arquivo foi escrito.`);
if (process.argv.includes('--check')) process.exit(0);
const outputDir = process.env.RESULTX_EDS_OUTPUT || 'brands/emprega-mais/tokens';
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'eds-root.css'), generated);
fs.writeFileSync(path.join(outputDir, 'eds-root.sha256'), recorded);
