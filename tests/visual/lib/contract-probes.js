const { expect } = require('@playwright/test');
const { PNG } = require('pngjs');

const ratio = (a, b) => {
  const luminance = (rgb) => rgb.slice(0, 3).map((n) => { const v = n / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const x = luminance(a), y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const pixel = (png, x, y) => {
  x = Math.floor(x); y = Math.floor(y);
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) throw new Error(`Traço fora da viewport em ${x},${y}`);
  const i = (png.width * y + x) * 4;
  return [...png.data.subarray(i, i + 3)];
};

// Pixels de traço e fundo efetivamente pintados; não produz arquivo ou baseline.
async function paintedEdge(page, selector, kind) {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  const m = await target.evaluate((el) => {
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height,
      borderWidths: ['Top', 'Bottom', 'Left', 'Right'].map((side) => parseFloat(s[`border${side}Width`])), borderStyles: ['Top', 'Bottom', 'Left', 'Right'].map((side) => s[`border${side}Style`]),
      outlineWidth: parseFloat(s.outlineWidth), outlineStyle: s.outlineStyle, offset: parseFloat(s.outlineOffset) };
  });
  const widths = kind === 'border' ? m.borderWidths : Array(4).fill(m.outlineWidth);
  const styles = kind === 'border' ? m.borderStyles : Array(4).fill(m.outlineStyle);
  for (let i = 0; i < 4; i++) {
    expect(widths[i], `${selector}: largura do ${kind} lado ${i}`).toBeGreaterThanOrEqual(1);
    expect(['none', 'hidden'].includes(styles[i]), `${selector}: estilo do ${kind} lado ${i}`).toBe(false);
  }
  const midX = m.x + m.width / 2, midY = m.y + m.height / 2;
  const distances = widths.map((width) => kind === 'border' ? -width / 2 : m.offset + width / 2);
  const points = [[midX, m.y - distances[0]], [midX, m.y + m.height + distances[1] - 1], [m.x - distances[2], midY], [m.x + m.width + distances[3] - 1, midY]];
  const original = PNG.sync.read(await page.screenshot({ animations: 'disabled' }));
  let background;
  if (kind === 'outline') {
    await target.evaluate((el) => { el.dataset.rxOldStyle = el.getAttribute('style') ?? ''; el.style.setProperty('outline', 'none', 'important'); });
    try { background = PNG.sync.read(await page.screenshot({ animations: 'disabled' })); }
    finally { await target.evaluate((el) => { if (el.dataset.rxOldStyle) el.setAttribute('style', el.dataset.rxOldStyle); else el.removeAttribute('style'); delete el.dataset.rxOldStyle; }); }
  }
  const outside = [[midX, Math.floor(m.y) - 1], [midX, Math.ceil(m.y + m.height) + 1], [Math.floor(m.x) - 1, midY], [Math.ceil(m.x + m.width) + 1, midY]];
  for (let i = 0; i < points.length; i++) {
    const fg = pixel(original, ...points[i]);
    const bg = kind === 'border' ? pixel(original, ...outside[i]) : pixel(background, ...points[i]);
    expect(ratio(fg, bg), `${selector} ${kind} lado ${i}: ${fg} x ${bg}`).toBeGreaterThanOrEqual(3);
  }
}

async function textContrast(page, selector) {
  const target = typeof selector === 'string' ? page.locator(selector).first() : selector;
  const result = await target.evaluate((el) => {
    const rgba = (s) => { if (!/^rgba?\(/i.test(s)) throw new Error(`Cor não suportada: ${s}`); const m = s.match(/[\d.]+/g); return m.map(Number); };
    const blend = (f, b) => f.slice(0, 3).map((v, i) => v * (f[3] ?? 1) + b[i] * (1 - (f[3] ?? 1)));
    const background = (node) => { if (!node) return [255, 255, 255]; const style = getComputedStyle(node); if (style.backgroundImage !== 'none') throw new Error('Contraste com imagem de fundo não é suportado pela sonda'); return blend(rgba(style.backgroundColor), background(node.parentElement)); };
    const bg = background(el), fg = blend(rgba(getComputedStyle(el).color), bg);
    return { fg, bg, text: el.textContent.trim().slice(0, 80) };
  });
  expect(ratio(result.fg, result.bg), `Texto ${result.text}: ${result.fg} x ${result.bg}`).toBeGreaterThanOrEqual(4.5);
}
async function descendantTextContrast(page, selector) {
  const container = page.locator(selector).first();
  const nodes = container.locator(':scope, :scope *');
  let count = 0;
  for (let i = 0; i < await nodes.count(); i++) {
    const node = nodes.nth(i);
    if (!await node.isVisible()) continue;
    const hasText = await node.evaluate((el) => [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()));
    if (hasText) { await textContrast(page, node); count++; }
  }
  expect(count, `${selector}: texto visível não encontrado`).toBeGreaterThan(0);
}
module.exports = { paintedEdge, textContrast, descendantTextContrast };
