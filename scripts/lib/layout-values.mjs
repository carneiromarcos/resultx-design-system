// Renderiza apenas valores tipados da fonte; a estrutura permanece no modelo CSS.
export function renderLayoutValues(root, dictionary, data, layout) {
  const entries = data.$extensions['org.resultx.css'].layoutOccurrences[layout];
  const tokens = new Map(dictionary.allTokens.map((token) => [token.path.join('.'), token]));
  const used = new Set();
  root.walkDecls((decl) => {
    const match = /^__RX_(v\d+)__$/.exec(decl.value);
    if (!match) return;
    const id = match[1], entry = entries[id];
    if (!entry || used.has(id) || decl.prop !== entry.prop) throw new Error(`Valor estrutural inválido: ${layout}/${id}`);
    used.add(id);
    const token = tokens.get(`component.layout.${layout}.${entry.name}`);
    if (!token) throw new Error(`Token estrutural ausente: ${layout}/${id}`);
    const fmt = entry.format, value = token.$value;
    let css;
    if (fmt.form === 'dimension' && ['dimension', 'duration', 'number'].includes(token.$type)) {
      css = token.$type === 'number' ? `${value}${fmt.unit}` : `${value.value}${value.unit}`;
      css = fmt.pattern.replace('{value}', css);
    } else if (fmt.form === 'color' && token.$type === 'color') {
      const hex = value.components.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
      if (value.colorSpace !== 'srgb' || (value.hex && value.hex.toUpperCase() !== `#${hex}`)) throw new Error(`Cor inconsistente: ${layout}/${id}`);
      css = fmt.pattern.replace('{value}', fmt.lower ? `#${hex.toLowerCase()}` : `#${hex}`);
    } else if (fmt.form === 'shadow' && token.$type === 'shadow') {
      const dim = (v) => v.value === 0 ? '0' : `${v.value}${v.unit}`;
      const c = value.color, rgb = c.components.map((v) => Math.round(v * 255));
      if (c.colorSpace !== 'srgb' || value.spread.value !== 0) throw new Error(`Sombra inválida: ${layout}/${id}`);
      css = `${dim(value.offsetX)} ${dim(value.offsetY)} ${dim(value.blur)} rgba(${rgb.join(', ')}, ${c.alpha ?? 1})`;
    } else throw new Error(`Tipo estrutural incompatível: ${layout}/${id}`);
    decl.value = css;
  });
  if (used.size !== Object.keys(entries).length) throw new Error(`Valor estrutural não utilizado: ${layout}`);
}
