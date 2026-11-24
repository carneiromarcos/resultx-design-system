// Brand-only generator. Requires potrace 1.16 and this repository's dev dependencies.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {PNG}=require('pngjs');
const os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
const dir=path.resolve(__dirname,'..'),out=dir,qa=path.resolve(dir,'../../docs/qa');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const SOURCES={light:'source/wordmark-light-background.png',dark:'source/wordmark-dark-background.png',symbol:'source/symbol-transparent-background.png'};
const METHOD='Alpha128 connected components; contour from alpha interpolated (4x wordmark, 2x symbol) and traced with potrace; score paths, no font substitution; per-ribbon linear gradients with exact sampled RGB stops';
const MARGIN=2,ICON_SIZES=[16,32,48,180,512];
const neighbours=(n,W,H)=>{const x=n%W,y=Math.floor(n/W);return[x?n-1:-1,x<W-1?n+1:-1,y?n-W:-1,y<H-1?n+W:-1].filter(z=>z>=0);};
const bbox=points=>(W=>[Math.min(...points.map(n=>n%W)),Math.min(...points.map(n=>Math.floor(n/W))),Math.max(...points.map(n=>n%W)),Math.max(...points.map(n=>Math.floor(n/W)))]);
function components(p){
 const W=p.width,H=p.height,seen=new Uint8Array(W*H),found=[];
 for(let n=0;n<W*H;n++)if(!seen[n]&&p.data[n*4+3]>=128){const q=[n],points=[];seen[n]=1;while(q.length){const v=q.pop();points.push(v);for(const z of neighbours(v,W,H))if(!seen[z]&&p.data[z*4+3]>=128){seen[z]=1;q.push(z);}}if(points.length>=10)found.push(points);}
 return found.map(points=>({points,box:bbox(points)(W)})).sort((a,b)=>a.box[0]-b.box[0]);
}
function alphaExtent(p){let x0=Infinity,y0=Infinity,x1=-1,y1=-1;for(let n=0;n<p.width*p.height;n++)if(p.data[n*4+3]>0){const x=n%p.width,y=Math.floor(n/p.width);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}return[x0,y0,x1,y1];}
// Every partially transparent pixel joins the nearest traced mask, so antialias edges stay with their own shape.
function trace(p,masks,scale,temp,prefix){
 const W=p.width,H=p.height,labels=new Int16Array(W*H).fill(-1),queue=[];
 masks.forEach((points,i)=>points.forEach(n=>{labels[n]=i;queue.push(n);}));
 for(let k=0;k<queue.length;k++){const n=queue[k];for(const z of neighbours(n,W,H))if(labels[z]===-1&&p.data[z*4+3]>0){labels[z]=labels[n];queue.push(z);}}
 return masks.map((_,i)=>{
  const value=(x,y)=>x<0||y<0||x>=W||y>=H||labels[y*W+x]!==i?0:p.data[(y*W+x)*4+3];
  const rows=[`P1\n${W*scale} ${H*scale}`];
  for(let y=0;y<H*scale;y++){const sy=(y+.5)/scale-.5,y0=Math.floor(sy),fy=sy-y0,row=[];for(let x=0;x<W*scale;x++){const sx=(x+.5)/scale-.5,x0=Math.floor(sx),fx=sx-x0;const alpha=value(x0,y0)*(1-fx)*(1-fy)+value(x0+1,y0)*fx*(1-fy)+value(x0,y0+1)*(1-fx)*fy+value(x0+1,y0+1)*fx*fy;row.push(alpha>=128?1:0);}rows.push(row.join(' '));}
  const name=path.join(temp,`${prefix}-${i}.pbm`),svgName=path.join(temp,`${prefix}-${i}.svg`);fs.writeFileSync(name,rows.join('\n')+'\n');
  cp.execFileSync('potrace',[name,'--svg','--flat','--opttolerance','0.2','--turdsize','1','--output',svgName]);
  return [...fs.readFileSync(svgName,'utf8').matchAll(/<path\s+d="([\s\S]*?)"\s*\/?>(?:<\/path>)?/g)].map(m=>m[1]).join(' ');
 });
}
function fitGradient(p,points){
 const W=p.width,samples=points.filter(n=>p.data[n*4+3]===255).map(n=>({x:n%W+.5,y:Math.floor(n/W)+.5,rgb:[...p.data.subarray(n*4,n*4+3)]}));
 let best;
 for(let degrees=0;degrees<180;degrees+=2){const vx=Math.cos(degrees*Math.PI/180),vy=Math.sin(degrees*Math.PI/180);const projected=samples.map(s=>({...s,t:s.x*vx+s.y*vy})),min=Math.min(...projected.map(s=>s.t)),max=Math.max(...projected.map(s=>s.t));
  const stops=Array.from({length:9},(_,j)=>{const t=min+(max-min)*j/8,near=projected.filter(s=>Math.abs(s.t-t)<(max-min)/12),pool=near.length?near:projected,mean=[0,1,2].map(c=>pool.reduce((a,s)=>a+s.rgb[c],0)/pool.length);let chosen=pool[0],score=Infinity;for(const s of pool){const e=s.rgb.reduce((a,v,c)=>a+(v-mean[c])**2,0)+((s.t-t)/(max-min)*10)**2;if(e<score){score=e;chosen=s;}}return{offset:j/8,color:chosen.rgb,sampledAt:[Math.floor(chosen.x),Math.floor(chosen.y)]};});
  let error=0;for(const s of projected){const t=(s.t-min)/(max-min)*8,k=Math.min(7,Math.floor(t)),f=t-k;for(let c=0;c<3;c++)error+=(s.rgb[c]-(stops[k].color[c]*(1-f)+stops[k+1].color[c]*f))**2;}
  error/=samples.length*3;if(!best||error<best.error)best={degrees,vx,vy,min,max,stops,error};
 }
 return best;
}
function gradientSvg(g,id,H,scale){
 const k=10*scale,o=[g.vx*g.min,g.vy*g.min],e=[g.vx*g.max,g.vy*g.max];
 return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${(o[0]*k).toFixed(4)}" y1="${((H-o[1])*k).toFixed(4)}" x2="${(e[0]*k).toFixed(4)}" y2="${((H-e[1])*k).toFixed(4)}">${g.stops.map(s=>`<stop offset="${s.offset}" stop-color="rgb(${s.color.join(' ')})"/>`).join('')}</linearGradient>`;
}
// Symbol ribbons plus an optional solid path, in potrace units mapped back to source pixels.
function artwork({gradients,paths,H,scale,prefix,solid}){
 const k=+(0.1/scale).toFixed(4);
 return `<defs>${gradients.map((g,i)=>gradientSvg(g,`${prefix}-${i}`,H,scale)).join('')}</defs><g transform="translate(0 ${H}) scale(${k} ${-k})">${gradients.map((_,i)=>`<path fill="url(#${prefix}-${i})" d="${paths[i]}"/>`).join('')}${solid?`<path fill="rgb(${solid.color.join(' ')})" d="${solid.d}"/>`:''}</g>`;
}
const dominant=(img,points)=>{const hist=new Map();for(const n of points)if(img.data[n*4+3]===255){const c=[...img.data.subarray(n*4,n*4+3)].join(',');hist.set(c,(hist.get(c)||0)+1);}return [...hist].sort((a,b)=>b[1]-a[1])[0][0].split(',').map(Number);};
async function render(browser,svg,width,height,omitBackground=true){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 try{await page.goto('data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64'));return await page.screenshot({omitBackground,animations:'disabled'});}finally{await page.close();}
}
// Pixel comparison of a vector rendered on the source 400 x 400 grid against the source RGBA.
function compare(source,rendered,isSymbol){
 let inter=0,union=0,symInter=0,symUnion=0,alpha=0,colorSq=0,colorN=0;
 const diff=new PNG({width:source.width,height:source.height});
 for(let n=0;n<source.width*source.height;n++){
  const a=source.data[n*4+3],b=rendered.data[n*4+3],A=a>=128,B=b>=128,sym=isSymbol(n%source.width);
  if(A&&B){inter++;if(sym)symInter++;}if(A||B){union++;if(sym)symUnion++;}alpha+=Math.abs(a-b)/255;
  if(a===255&&b===255){for(let c=0;c<3;c++)colorSq+=(source.data[n*4+c]-rendered.data[n*4+c])**2;colorN++;}
  const px=A&&B?[150,150,150]:A?[220,30,30]:B?[30,90,220]:[255,255,255];diff.data.set([...px,255],n*4);
 }
 return{metrics:{alphaIoU128:inter/union,symbolAlphaIoU128:symInter/symUnion,meanAbsAlpha:alpha/(source.width*source.height),opaqueColorRmse:Math.sqrt(colorSq/(colorN*3)),pixelsOnlyInSource:union-inter},diff};
}
// Side-by-side QA sheet: source over white, vector over white, mask difference (grey both, red source only, blue vector only).
function sheet(panels,[x0,y0,w,h],zoom){
 const outPng=new PNG({width:w*zoom*panels.length+8*(panels.length-1),height:h*zoom});outPng.data.fill(255);
 panels.forEach((img,i)=>{for(let y=0;y<h*zoom;y++)for(let x=0;x<w*zoom;x++){const sx=x0+Math.floor(x/zoom),sy=y0+Math.floor(y/zoom),s=(sy*img.width+sx)*4,a=img.data[s+3]/255,d=(y*outPng.width+i*(w*zoom+8)+x)*4;for(let c=0;c<3;c++)outPng.data[d+c]=Math.round(img.data[s+c]*a+255*(1-a));}});
 return PNG.sync.write(outPng);
}
function themeSurfaces(){
 const css=fs.readFileSync(path.join(dir,'../../tokens/tokens.css'),'utf8'),light=css.slice(css.search(/^\[data-theme="light"\]\s*\{/m));
 const pick=(block,token)=>block.match(new RegExp(`${token}:\\s*(#[0-9a-f]{6})`,'i'))[1];
 const tokens=['--bg','--surface-1','--surface-2','--surface-3','--surface-4'];
 return{dark:tokens.map(token=>({token,hex:pick(css,token)})),light:tokens.map(token=>({token,hex:pick(light,token)}))};
}
const rgb=hex=>[0,2,4].map(i=>parseInt(hex.slice(1+i,3+i),16));
const luminance=color=>color.map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
async function generate(){
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'xscore-logo-'));
try {
assert.match(cp.execFileSync('potrace',['--version'],{encoding:'utf8'}),/^potrace 1\.16\b/);
const light=PNG.sync.read(fs.readFileSync(path.join(dir,SOURCES.light))),dark=PNG.sync.read(fs.readFileSync(path.join(dir,SOURCES.dark))),symbol=PNG.sync.read(fs.readFileSync(path.join(dir,SOURCES.symbol)));
for(let n=3;n<light.data.length;n+=4)assert.equal(light.data[n],dark.data[n],'Both wordmark sources must share one alpha mask');
// Wordmark: two X ribbons then five score letters, left to right.
const found=components(light);
if(found.length!==7)throw Error('Unexpected wordmark components: '+found.length);
const ribbons=found.slice(0,2),letters=found.slice(2);
assert.ok(Math.max(...ribbons.map(c=>c.box[2]))<letters[0].box[0],'X and score must not overlap horizontally');
const lettersAt=letters[0].box[0],H=light.height,WS=4;
const wordPaths=trace(light,[...ribbons.map(c=>c.points),letters.flatMap(c=>c.points)],WS,temp,'wordmark');
const wordGradients=ribbons.map(c=>fitGradient(light,c.points));
const scoreColors=[light,dark].map(img=>dominant(img,letters.flatMap(c=>c.points)));
const [ex0,ey0,ex1,ey1]=alphaExtent(light),viewBox=[ex0-MARGIN,ey0-MARGIN,ex1-ex0+1+2*MARGIN,ey1-ey0+1+2*MARGIN];
const provenance=JSON.parse(fs.readFileSync(path.join(dir,'source/provenance.json')));
const wordmarks={};
for(const [i,mode,name] of [[0,'light-background','xscore-wordmark-dark.svg'],[1,'dark-background','xscore-wordmark-light.svg']]){
 const art=artwork({gradients:wordGradients,paths:wordPaths,H,scale:WS,prefix:`xscore-${mode}-ribbon`,solid:{color:scoreColors[i],d:wordPaths[2]}});
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}" width="${viewBox[2]}" height="${viewBox[3]}" role="img" aria-label="Xscore">${art}</svg>\n`;
 assert.equal(sha(svg),provenance.approvedSvgSha256[name],`Reproduction must keep the approved vector bytes (${name} is ${sha(svg)})`);
 fs.writeFileSync(path.join(out,name),svg);wordmarks[name]=svg;
}
// Monogram, favicon and icons come from the 400 px symbol source, not from the small X inside the wordmark.
const symbolParts=components(symbol);
if(symbolParts.length!==2)throw Error('Unexpected symbol components: '+symbolParts.length);
const SS=2,symbolPaths=trace(symbol,symbolParts.map(c=>c.points),SS,temp,'symbol');
const symbolGradients=symbolParts.map(c=>fitGradient(symbol,c.points));
const [sx0,sy0,sx1,sy1]=alphaExtent(symbol),side=Math.max(sx1-sx0+1,sy1-sy0+1)+2*MARGIN*4;
const square=[Math.round((sx0+sx1+1)/2-side/2),Math.round((sy0+sy1+1)/2-side/2),side,side];
const symbolArt=prefix=>artwork({gradients:symbolGradients,paths:symbolPaths,H:symbol.height,scale:SS,prefix});
const monogram=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${square.join(' ')}" width="512" height="512" role="img" aria-label="Xscore">${symbolArt('xscore-monogram-ribbon')}</svg>\n`;
fs.writeFileSync(path.join(out,'xscore-monogram.svg'),monogram);
const navy=scoreColors[0];
const favicon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Xscore"><rect width="128" height="128" fill="rgb(255 255 255)"/><rect x="2" y="2" width="124" height="124" rx="16" fill="none" stroke="rgb(${navy.join(' ')})" stroke-width="2"/><svg x="12" y="12" width="104" height="104" viewBox="${square.join(' ')}">${symbolArt('xscore-favicon-ribbon')}</svg></svg>\n`;
fs.writeFileSync(path.join(out,'xscore-favicon.svg'),favicon);
const report={method:METHOD,source:Object.values(SOURCES).map(f=>({file:f,sha256:sha(fs.readFileSync(path.join(dir,f)))})),wordmark:{viewBox,components:found.map(c=>({pixels:c.points.length,bbox:c.box})),scoreColors,gradients:wordGradients},symbol:{viewBox:square,components:symbolParts.map(c=>({pixels:c.points.length,bbox:c.box})),gradients:symbolGradients},fidelity:[]};
const pngs=new Map(),surfaces=themeSurfaces(),contrast={schema:2,method:'Symbol: SVG rendered at 180 px wide, fully opaque pixels against the dark --surface-1. Score: flat sampled colour against every surface role of the theme in which that artwork is used. WCAG relative luminance; measurement, not a conformity verdict.',referenceMinimum:{symbol:3,score:4.5}};
let browser;
try {
 browser=await chromium.launch();
 for(const size of ICON_SIZES){
  const png=await render(browser,favicon.replace('width="64" height="64"',`width="${size}" height="${size}"`),size,size,false);pngs.set(size,png);
  if(size!==48)fs.writeFileSync(path.join(out,`xscore-icon-${size}.png`),png);
 }
 const full=svg=>svg.replace(/viewBox="[^"]+" width="\d+" height="\d+"/,'viewBox="0 0 400 400" width="400" height="400"');
 fs.mkdirSync(qa,{recursive:true});
 for(const [asset,svg,source,isSymbol,crop] of [
  ['xscore-wordmark-dark.svg',wordmarks['xscore-wordmark-dark.svg'],light,x=>x<lettersAt,viewBox],
  ['xscore-wordmark-light.svg',wordmarks['xscore-wordmark-light.svg'],dark,x=>x<lettersAt,viewBox],
  ['xscore-monogram.svg',monogram,symbol,()=>true,square]]){
  const rendered=PNG.sync.read(await render(browser,full(svg),400,400));
  const {metrics,diff}=compare(source,rendered,isSymbol);report.fidelity.push({asset,renderedAt:[400,400],...metrics});
  if(asset!=='xscore-wordmark-light.svg'){const c=crop.map(Math.round).map((v,i)=>i<2?Math.max(0,v):Math.min(v,400-Math.max(0,crop[i-2])));fs.writeFileSync(path.join(qa,`logo-fidelity-${asset==='xscore-monogram.svg'?'monogram':'wordmark'}.png`),sheet([source,rendered,diff],c,asset==='xscore-monogram.svg'?1:3));}
 }
 const height=Math.round(180*viewBox[3]/viewBox[2]),dark1=surfaces.dark.find(s=>s.token==='--surface-1').hex;
 contrast.symbol={surfaceRole:'--surface-1',background:dark1,viewport:[180,height],parts:[]};
 for(let part=0;part<2;part++){
  let index=0;
  const svg=wordmarks['xscore-wordmark-light.svg'].replace(/<path\b[^>]*\/>/g,tag=>index++===part?tag:'').replace(`width="${viewBox[2]}" height="${viewBox[3]}"`,`width="180" height="${height}"`);
  const pixels=PNG.sync.read(await render(browser,svg,180,height));
  let count=0,min=Infinity,max=0,minColor;
  for(let at=0;at<pixels.data.length;at+=4)if(pixels.data[at+3]===255){const color=[...pixels.data.subarray(at,at+3)],r=ratio(color,rgb(dark1));count++;if(r<min){min=r;minColor=color;}max=Math.max(max,r);}
  assert.ok(count>0,'Contrast sample must contain fully opaque symbol pixels');
  contrast.symbol.parts.push({part:part===0?'cool-ribbon':'warm-ribbon',fullyOpaquePixels:count,minimumRatio:min,maximumRatio:max,minimumColor:minColor,belowReference3to1:min<3});
 }
}finally{if(browser)await browser.close();}
contrast.score=[['xscore-wordmark-dark.svg',scoreColors[0],'light'],['xscore-wordmark-light.svg',scoreColors[1],'dark']].map(([asset,color,theme])=>({asset,color,theme,surfaces:surfaces[theme].map(s=>({...s,ratio:ratio(color,rgb(s.hex))}))}));
contrast.decision='Preserve the approved artwork; no recoloring or token changes.';
fs.writeFileSync(path.join(out,'source/contrast.json'),JSON.stringify(contrast,null,2)+'\n');
fs.writeFileSync(path.join(out,'source/tracing.json'),JSON.stringify(report,null,2)+'\n');
// Next's ICO decoder requires PNG RGBA (colorType 6), including opaque entries.
const sizes=[16,32,48];for(const size of sizes)pngs.set(size,PNG.sync.write(PNG.sync.read(pngs.get(size)),{colorType:6,inputColorType:6}));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const at=6+16*i,png=pngs.get(size);header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(png.length,at+8);header.writeUInt32LE(offset,at+12);offset+=png.length;});
fs.writeFileSync(path.join(out,'xscore-favicon.ico'),Buffer.concat([header,...sizes.map(size=>pngs.get(size))]));
const outputs=['xscore-wordmark-dark.svg','xscore-wordmark-light.svg','xscore-monogram.svg','xscore-favicon.svg','xscore-favicon.ico',...[16,32,180,512].map(size=>`xscore-icon-${size}.png`)];
const manifest={schema:1,method:'Approved vector contour; sampled gradient colors; symbol from the 400 px X source; opaque white/navy icon tile; PNGs rendered with the repository browser',assets:outputs.map(file=>{const bytes=fs.readFileSync(path.join(out,file));return{file,bytes:bytes.length,sha256:sha(bytes)};})};
fs.writeFileSync(path.join(out,'asset-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({generated:outputs.length,viewBox,square,scoreColors,fidelity:report.fidelity,score:contrast.score.map(s=>({asset:s.asset,min:Math.min(...s.surfaces.map(x=>x.ratio))})),symbol:contrast.symbol.parts.map(({part,minimumRatio,maximumRatio})=>({part,minimumRatio,maximumRatio}))},null,1));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
}
generate().catch(error=>{console.error(error.message);process.exitCode=1;});
