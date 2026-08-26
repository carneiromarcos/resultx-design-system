const fs=require('fs'), opentype=require('opentype.js');
const W=100,H=118.5,ARM=19.5,K=0.30;
function xPath(){const cx=W/2,cy=H/2,o=ARM*K;
  return 'M '+[[0,0],[ARM,0],[cx,cy-o],[W-ARM,0],[W,0],[cx+o,cy],[W,H],[W-ARM,H],[cx,cy+o],[ARM,H],[0,H],[cx-o,cy]]
    .map(p=>p.map(v=>+v.toFixed(2)).join(' ')).join(' L ')+' Z';}
const D=xPath();
const defs=(s,sw)=>`
<linearGradient id="f${s}" x1="0.2" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26429a"/><stop offset=".5" stop-color="#2085d7"/><stop offset="1" stop-color="#00b8f4"/></linearGradient>
<linearGradient id="q${s}" x1="0.1" y1="1" x2="0.9" y2="0"><stop offset="0" stop-color="#8d5579"/><stop offset=".3" stop-color="#c9762e"/><stop offset=".65" stop-color="#cd8724"/><stop offset="1" stop-color="#b5a34d"/></linearGradient>
<linearGradient id="g${s}" x1="0" y1="0" x2="1" y2="0"><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity="1"/></linearGradient>
<mask id="m${s}"><rect x="-30" y="-30" width="180" height="200" fill="url(#g${s})"/></mask>`;
const xg=(s,sw)=>`<g fill="none" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"><path d="${D}" stroke="url(#f${s})"/><path d="${D}" stroke="url(#q${s})" mask="url(#m${s})"/></g>`;

// --- monograma: traco mais grosso, folga menor (legivel em 16px) ---
function mono(sw,pad,file,px,s){
  const vb=W+sw+pad*2, x0=-(sw/2+pad), y0=-(sw/2+pad)-(vb-(H+sw+pad*2))/2;
  fs.writeFileSync(file,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x0.toFixed(2)} ${y0.toFixed(2)} ${vb.toFixed(2)} ${vb.toFixed(2)}" width="${px}" height="${px}" role="img" aria-label="Xscore"><defs>${defs(s,sw)}</defs>${xg(s,sw)}</svg>`);
}
mono(7.4, 6, 'xscore-monogram.svg', 512, 'M');   // uso geral
mono(9.0, 4, 'xscore-favicon.svg', 64, 'F');    // traco reforcado p/ 16-32px

// --- wordmark ---
const font=opentype.parse(fs.readFileSync('f2-Archivo-Black.ttf').buffer);
function wordmark(cor,s,file){
  const FS=H*1.02, gap=7.5;
  const probe=font.getPath('score',0,0,FS,{kerning:true}), bb=probe.getBoundingBox();
  const tx=W+gap-bb.x1, ty=H-bb.y2;                     // base das letras na base do X
  const path=font.getPath('score',tx,ty,FS,{kerning:true});
  const total=W+gap+(bb.x2-bb.x1), vw=total+7.4+4, vh=H+7.4+4;
  fs.writeFileSync(file,`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-7.4/2-2} ${-7.4/2-2} ${vw.toFixed(2)} ${vh.toFixed(2)}" width="${Math.round(vw*4)}" height="${Math.round(vh*4)}" role="img" aria-label="Xscore"><defs>${defs(s,7.4)}</defs>${xg(s,7.4)}<path d="${path.toPathData(2)}" fill="${cor}"/></svg>`);
}
wordmark('#ffffff','L','xscore-wordmark-light.svg');
wordmark('#12161f','D','xscore-wordmark-dark.svg');
console.log('ok');
