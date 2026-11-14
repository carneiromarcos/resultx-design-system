const { parseCssColor } = require('./visual/lib/css-color');

test('interpreta canais sRGB reais e alpha sem arredondamento', () => {
  expect(parseCssColor('color(srgb 0.213529 0.22 0.519804)')).toEqual([0.213529 * 255, 0.22 * 255, 0.519804 * 255]);
  expect(parseCssColor('color(srgb 0.5 1 0 / 0.25)')).toEqual([127.5, 255, 0, 0.25]);
  expect(parseCssColor('color(srgb 0.5 1 0 / 50%)')).toEqual([127.5, 255, 0, 0.5]);
});

test('preserva rgb/rgba e recusa espaços de cor desconhecidos', () => {
  expect(parseCssColor('rgb(10, 20, 30)')).toEqual([10, 20, 30]);
  expect(parseCssColor('rgba(10, 20, 30, 0.2)')).toEqual([10, 20, 30, 0.2]);
  expect(() => parseCssColor('color(display-p3 1 0 0)')).toThrow('Cor não suportada');
});
