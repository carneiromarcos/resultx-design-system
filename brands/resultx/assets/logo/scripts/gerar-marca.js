#!/usr/bin/env node
'use strict';

/**
 * Gera os ativos de marca da ResultX A PARTIR dos arquivos reais do site
 * (resultx-site: public/images/logo-resultx.svg e logo-icon.svg).
 * Nenhuma forma é redesenhada: só recorte, troca de cor do "result" e
 * conversão do X do ícone de texto para curva.
 *
 * Uso (na pasta assets/logo):
 *   npm install opentype.js            # fora do pacote do DS (ver README)
 *   node scripts/gerar-marca.js <logo-resultx.svg> <logo-icon.svg> <Poppins-ExtraBold.ttf>
 *
 * Precisa do `playwright` (devDependency do DS) com Chromium instalado.
 * Saída: os arquivos resultx-*.svg / .png ao lado do README.
 */

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const { chromium } = require('playwright');

const [logoSrc, iconSrc, fontPath] = process.argv.slice(2);
if (!logoSrc || !iconSrc || !fontPath) {
  console.error('uso: gerar-marca.js <logo-resultx.svg> <logo-icon.svg> <Poppins-ExtraBold.ttf>');
  process.exit(1);
}
const OUT = path.resolve(__dirname, '..');

/** Caixa visível da marca dentro da tela quadrada de 300 do arquivo do site. */
const CROP = { x: 20, y: 112.28125, w: 257.8125, h: 77.25 };
const LOGO_ASPECT = CROP.w / CROP.h;
/** Cor que substitui o branco de "result" no fundo claro (= --bg-base do DS escuro). */
const INK_ON_LIGHT = [0x0b, 0x0e, 0x14];

const write = (name, data) => fs.writeFileSync(path.join(OUT, name), data);

/** 1. Recorte: só troca o enquadramento do SVG original. */
function cropLogo(svg) {
  const head = svg.replace(
    /width="400"[^>]*?viewBox="0 0 300 299\.999988" height="400"/,
    `width="${Math.round(CROP.w * 4)}" zoomAndPan="magnify" viewBox="${CROP.x} ${CROP.y} ${CROP.w} ${CROP.h}" height="${Math.round(CROP.h * 4)}"`
  );
  if (head === svg) throw new Error('cabeçalho do SVG do site mudou; revise o recorte');
  return head;
}

/** 2. Fundo claro: no PNG de cor, o branco de "result" vira o grafite. O X (colorido) não muda. */
async function recolorWhite(page, pngBase64) {
  return page.evaluate(
    async ({ b64, ink }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, c.width, c.height);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        const lo = Math.min(px[i], px[i + 1], px[i + 2]);
        const hi = Math.max(px[i], px[i + 1], px[i + 2]);
        if (lo > 190 && hi - lo < 40) {
          px[i] = ink[0];
          px[i + 1] = ink[1];
          px[i + 2] = ink[2];
        }
      }
      ctx.putImageData(data, 0, 0);
      return c.toDataURL('image/png').split(',')[1];
    },
    { b64: pngBase64, ink: INK_ON_LIGHT }
  );
}

function logoOnLight(svg, recolored) {
  const images = [...svg.matchAll(/xlink:href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/g)];
  if (images.length !== 2) throw new Error('esperava 2 imagens no SVG do site');
  // A 1ª é a máscara (alfa); a 2ª é a cor visível.
  return svg.replace(images[1][1], recolored);
}

/** 3. Ícone: o X de Poppins ExtraBold vira curva, com o mesmo gradiente do arquivo do site. */
async function iconWithPath(page, svg) {
  const font = opentype.parse(fs.readFileSync(fontPath).buffer.slice(0));
  const glyph = font.getPath('X', 6, 25, 24);
  const d = glyph.toPathData(2);
  // O gradiente do original usa a caixa do <text>; medimos essa caixa no Chromium.
  const fontUrl = `data:font/ttf;base64,${fs.readFileSync(fontPath).toString('base64')}`;
  const box = await page.evaluate(
    async ({ fontUrl }) => {
      const face = new FontFace('PoppinsXB', `url(${fontUrl})`, { weight: '800' });
      await face.load();
      document.fonts.add(face);
      document.body.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"><text id="t" x="6" y="25" font-family="PoppinsXB" font-weight="800" font-size="24">X</text></svg>';
      const b = document.getElementById('t').getBBox();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    },
    { fontUrl }
  );
  const num = (n) => +n.toFixed(2);
  let out = svg.replace(/<text[^>]*>X<\/text>/, `<path d="${d}" fill="url(#gi)"/>`);
  out = out.replace(
    /<linearGradient id="gi"[^>]*>/,
    `<linearGradient id="gi" gradientUnits="userSpaceOnUse" x1="${num(box.x)}" y1="${num(box.y)}" x2="${num(box.x + box.w)}" y2="${num(box.y + box.h)}">`
  );
  if (out === svg || !out.includes('<path d=')) throw new Error('ícone do site mudou; revise a conversão');
  return out;
}

async function raster(page, svg, file, width, height, transparent) {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<style>html,body{margin:0;background:transparent}img{display:block;width:${width}px;height:${height}px}</style>` +
      `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}">`
  );
  await page.waitForFunction(() => document.images[0].complete);
  write(file, await page.screenshot({ omitBackground: transparent, clip: { x: 0, y: 0, width, height } }));
}

(async () => {
  const logo = fs.readFileSync(logoSrc, 'utf8');
  const icon = fs.readFileSync(iconSrc, 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const onDark = cropLogo(logo);
  const images = [...logo.matchAll(/xlink:href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/g)];
  const recolored = await recolorWhite(page, images[1][1]);
  const onLight = logoOnLight(onDark, recolored);
  write('resultx-logo-on-dark.svg', onDark);
  write('resultx-logo-on-light.svg', onLight);

  const favicon = await iconWithPath(page, icon);
  write('resultx-favicon.svg', favicon);

  const W = 1200;
  const H = Math.round(W / LOGO_ASPECT);
  await raster(page, onDark, `resultx-logo-on-dark-${W}.png`, W, H, true);
  await raster(page, onLight, `resultx-logo-on-light-${W}.png`, W, H, true);
  for (const size of [16, 32, 180, 512]) {
    await raster(page, favicon, `resultx-icon-${size}.png`, size, size, true);
  }
  await browser.close();
  console.log('ok');
})();
