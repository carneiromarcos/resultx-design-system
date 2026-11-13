#!/usr/bin/env node
// Gera CSS de marcas a partir dos tokens DTCG e seus layouts estruturais.
import fs from 'node:fs';
import postcss from 'postcss';
import StyleDictionary from 'style-dictionary';

const source = process.env.RESULTX_BRANDS_SOURCE || 'tokens/tokens.json';
const data = JSON.parse(fs.readFileSync(source, 'utf8'));
const brands = ['electia', 'emprega-mais', 'pdv', 'resultx', 'xscore'];
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
function gradient(value, format) {
  if (!Array.isArray(value) || value.length !== format.stops.length) throw new Error('Paradas do gradiente divergentes.');
  const stops = value.map((stop, i) => {
    const fmt = format.stops[i];
    const explicit = fmt.position || stop.position !== i / (value.length - 1);
    return `${color(stop.color, fmt.color)}${explicit ? ` ${stop.position * 100}%` : ''}`;
  });
  return `${format.functionName}(${format.geometry}, ${stops.join(', ')})`;
}
StyleDictionary.registerFormat({
  name: 'resultx/brand',
  format: ({ dictionary, file }) => {
    const brand = file.options.brand;
    const tokens = new Map(dictionary.allTokens.map((token) => [token.path.join('.'), token]));
    const occurrences = data.$extensions['org.resultx.css'].brandOccurrences[brand];
    const layout = `tokens/dtcg/layouts/brand-${brand}.css.tmpl`;
    const root = postcss.parse(fs.readFileSync(layout, 'utf8'));
    const used = new Set();
    root.walkDecls((decl) => {
      const match = /^__RX_(b\d+)__$/.exec(decl.value);
      if (!match) return;
      const id = match[1], entry = occurrences[id];
      if (!entry || used.has(id) || decl.prop !== `--${entry.name}`) throw new Error(`Ocorrência de marca inválida: ${brand}/${id}`);
      used.add(id);
      const fmt = entry.format;
      const token = tokens.get(`legacy.brand.${brand}.${entry.scope}.${entry.name}`);
      let value;
      if (fmt.form === 'css-expression') value = fmt.value;
      else if (!token || token.$type !== entry.type) throw new Error(`Token de marca ausente ou incompatível: ${brand}/${id}`);
      else if (entry.type === 'color') value = color(token.$value, fmt);
      else if (entry.type === 'shadow') value = shadow(token.$value, fmt.segments);
      else if (entry.type === 'gradient') value = gradient(token.$value, fmt);
      else if (entry.type === 'dimension' || entry.type === 'duration') value = `${token.$value.value}${token.$value.unit}`;
      else if (entry.type === 'number' || entry.type === 'fontWeight') value = `${token.$value}${fmt.unit || ''}`;
      else if (entry.type === 'fontFamily') value = token.$value.map((name, i) => fmt.quoteIndices.includes(i) ? `'${name}'` : name).join(', ');
      else if (entry.type === 'cubicBezier') value = `cubic-bezier(${token.$value.join(', ')})`;
      else if (entry.type === 'transition') {
        const t = token.$value, expected = fmt.timing === 'ease' ? [0.25, 0.1, 0.25, 1] : fmt.timing === 'ease-out' ? [0, 0, 0.58, 1] : null;
        if (t.duration.unit !== 'ms' || t.delay.value !== 0 || t.delay.unit !== 'ms') throw new Error(`Transição inválida: ${id}`);
        if (expected && JSON.stringify(t.timingFunction) !== JSON.stringify(expected)) throw new Error(`Curva ${fmt.timing} inconsistente.`);
        value = `${t.duration.value}ms ${expected ? fmt.timing : `cubic-bezier(${t.timingFunction.join(', ')})`}`;
      } else throw new Error(`Tipo sem formato CSS: ${entry.type}`);
      decl.value = value;
    });
    if (used.size !== Object.keys(occurrences).length) throw new Error(`Ocorrências ausentes no layout de ${brand}.`);
    return root.toString();
  },
});
const sd = new StyleDictionary({
  usesDtcg: true, source: [source],
  platforms: { css: { transforms: [], buildPath: `${process.env.RESULTX_BRANDS_OUTPUT || 'brands'}/`,
    files: brands.map((brand) => ({ destination: `${brand}/tokens/tokens.css`, format: 'resultx/brand', options: { brand } })) } },
  log: { verbosity: 'silent' },
});
await sd.buildAllPlatforms();
