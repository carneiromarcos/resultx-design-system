// Brand-only generator. Requires potrace 1.16 and this repository's dev dependencies.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {PNG}=require('pngjs');
const os=require('node:os'),assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
async function generate(){
const dir=path.resolve(__dirname,'..'),out=dir,temp=fs.mkdtempSync(path.join(os.tmpdir(),'xscore-logo-'));
try {
assert.match(cp.execFileSync('potrace',['--version'],{encoding:'utf8'}),/^potrace 1\.16\b/);
const files=['source/wordmark-light-background.png','source/wordmark-dark-background.png'];
const images=files.map(f=>PNG.sync.read(fs.readFileSync(path.join(dir,f))));
const p=images[0],W=p.width,H=p.height,seen=new Uint8Array(W*H),components=[];
for(let n=0;n<W*H;n++)if(!seen[n]&&p.data[n*4+3]>=128){const q=[n],points=[];seen[n]=1;while(q.length){const v=q.pop();points.push(v);const x=v%W,y=Math.floor(v/W);for(const z of [x? v-1:-1,x<W-1?v+1:-1,y?v-W:-1,y<H-1?v+W:-1])if(z>=0&&!seen[z]&&p.data[z*4+3]>=128){seen[z]=1;q.push(z);}}if(points.length>=10)components.push(points);}
components.sort((a,b)=>Math.min(...a.map(n=>n%W))-Math.min(...b.map(n=>n%W)));
const symbols=components.filter(a=>Math.max(...a.map(n=>n%W))<108),letters=components.filter(a=>Math.min(...a.map(n=>n%W))>=108).flat();
if(symbols.length!==2||components.length!==7)throw Error('Unexpected artwork components');
const masks=[...symbols,letters];
const SCALE=4,labels=new Int16Array(W*H).fill(-1),queue=[];
masks.forEach((points,i)=>points.forEach(n=>{labels[n]=i;queue.push(n);}));
for(let k=0;k<queue.length;k++){const n=queue[k],x=n%W,y=Math.floor(n/W);for(const z of [x?n-1:-1,x<W-1?n+1:-1,y?n-W:-1,y<H-1?n+W:-1])if(z>=0&&labels[z]===-1&&p.data[z*4+3]>0){labels[z]=labels[n];queue.push(z);}}
const paths=masks.map((points,i)=>{
 const value=(x,y)=>x<0||y<0||x>=W||y>=H||labels[y*W+x]!==i?0:p.data[(y*W+x)*4+3];
 let pbm=`P1\n${W*SCALE} ${H*SCALE}\n`;
 for(let y=0;y<H*SCALE;y++){const sy=(y+.5)/SCALE-.5,y0=Math.floor(sy),fy=sy-y0,row=[];for(let x=0;x<W*SCALE;x++){const sx=(x+.5)/SCALE-.5,x0=Math.floor(sx),fx=sx-x0;const alpha=value(x0,y0)*(1-fx)*(1-fy)+value(x0+1,y0)*fx*(1-fy)+value(x0,y0+1)*(1-fx)*fy+value(x0+1,y0+1)*fx*fy;row.push(alpha>=128?1:0);}pbm+=row.join(' ')+'\n';}
 const name=path.join(temp,`mask-${i}.pbm`);fs.writeFileSync(name,pbm);cp.execFileSync('potrace',[name,'--svg','--flat','--opttolerance','0.2','--turdsize','1','--output',path.join(temp,`trace-${i}.svg`)]);const svg=fs.readFileSync(path.join(temp,`trace-${i}.svg`),'utf8');return [...svg.matchAll(/<path\s+d="([\s\S]*?)"\s*\/?>(?:<\/path>)?/g)].map(m=>m[1]).join(' ');
});
function gradient(points,id){
 const samples=points.filter(n=>p.data[n*4+3]===255).map(n=>({x:n%W,y:Math.floor(n/W),rgb:[...p.data.subarray(n*4,n*4+3)]}));
 let best;
 for(let degrees=0;degrees<180;degrees+=2){const vx=Math.cos(degrees*Math.PI/180),vy=Math.sin(degrees*Math.PI/180);const projected=samples.map(s=>({...s,t:s.x*vx+s.y*vy})),min=Math.min(...projected.map(s=>s.t)),max=Math.max(...projected.map(s=>s.t));
  const stops=Array.from({length:9},(_,j)=>{const t=min+(max-min)*j/8,near=projected.filter(s=>Math.abs(s.t-t)<(max-min)/12),pool=near.length?near:projected,mean=[0,1,2].map(c=>pool.reduce((a,s)=>a+s.rgb[c],0)/pool.length);let chosen=pool[0],score=Infinity;for(const s of pool){const e=s.rgb.reduce((a,v,c)=>a+(v-mean[c])**2,0)+((s.t-t)/(max-min)*10)**2;if(e<score){score=e;chosen=s;}}return{offset:j/8,color:chosen.rgb,sampledAt:[chosen.x,chosen.y]};});
  let error=0;for(const s of projected){const t=(s.t-min)/(max-min)*8,k=Math.min(7,Math.floor(t)),f=t-k;for(let c=0;c<3;c++)error+=(s.rgb[c]-(stops[k].color[c]*(1-f)+stops[k+1].color[c]*f))**2;}
  error/=samples.length*3;if(!best||error<best.error)best={degrees,vx,vy,min,max,stops,error};
 }
 const origin=[best.vx*best.min,best.vy*best.min],end=[best.vx*best.max,best.vy*best.max];
 return{...best,svg:`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${(origin[0]*10*SCALE).toFixed(4)}" y1="${((H-origin[1])*10*SCALE).toFixed(4)}" x2="${(end[0]*10*SCALE).toFixed(4)}" y2="${((H-end[1])*10*SCALE).toFixed(4)}">${best.stops.map(s=>`<stop offset="${s.offset}" stop-color="rgb(${s.color.join(' ')})"/>`).join('')}</linearGradient>`};
}
const gradients=symbols.map((s,i)=>gradient(s,'xscore-ribbon-'+i));
const scoreColors=images.map(img=>{const hist=new Map();for(const n of letters)if(img.data[n*4+3]===255){const c=[...img.data.subarray(n*4,n*4+3)].join(',');hist.set(c,(hist.get(c)||0)+1);}return [...hist].sort((a,b)=>b[1]-a[1])[0][0].split(',').map(Number);});
const art=(score)=>`<defs>${gradients.map(g=>g.svg).join('')}</defs><g transform="translate(0 400) scale(.025 -.025)">${paths.slice(0,2).map((d,i)=>`<path fill="url(#xscore-ribbon-${i})" d="${d}"/>`).join('')}<path fill="rgb(${score.join(' ')})" d="${paths[2]}"/></g>`;
const provenance=JSON.parse(fs.readFileSync(path.join(dir,'source/provenance.json')));
for(let i=0;i<2;i++){
 const mode=i===0?'light-background':'dark-background',artwork=art(scoreColors[i]).replaceAll('xscore-ribbon-',`xscore-${mode}-ribbon-`);
 const name=i===0?'xscore-wordmark-dark.svg':'xscore-wordmark-light.svg';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="26 152 358 96" width="358" height="96" role="img" aria-label="Xscore">${artwork}</svg>\n`;
 assert.equal(crypto.createHash('sha256').update(svg).digest('hex'),provenance.approvedSvgSha256[name], 'Reproduction must keep the approved vector bytes');
 fs.writeFileSync(path.join(out,name),svg);
}
const report={method:'Alpha128 connected components, contour from alpha interpolated4x; two symbol ribbons and score traced with potrace; score paths, no font substitution; per-ribbon linear gradients with exact sampled RGB stops',source:files.map(f=>({file:f,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,f))).digest('hex')})),components:components.map(a=>({pixels:a.length,bbox:[Math.min(...a.map(n=>n%W)),Math.min(...a.map(n=>Math.floor(n/W))),Math.max(...a.map(n=>n%W)),Math.max(...a.map(n=>Math.floor(n/W)))]})),scoreColors,gradients:gradients.map(({svg,...g})=>g)};
fs.writeFileSync(path.join(out,'source/tracing.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({components:report.components,scoreColors,gradientFits:gradients.map(g=>({degrees:g.degrees,rmse:Math.sqrt(g.error)}))},null,2));

const symbolArt=art(scoreColors[1]).replace(/<path fill="rgb\([^"]+\)" d="[\s\S]*?"\/>/,'').replaceAll('xscore-ribbon-','xscore-monogram-ribbon-');
assert.equal((symbolArt.match(/<path\b/g)||[]).length,2);
const monogram=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="16 150 100 100" width="512" height="512" role="img" aria-label="Xscore">${symbolArt}</svg>\n`;
fs.writeFileSync(path.join(out,'xscore-monogram.svg'),monogram);
const faviconArt=symbolArt.replaceAll('xscore-monogram-ribbon-','xscore-favicon-ribbon-');
const favicon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Xscore"><rect width="128" height="128" fill="rgb(255 255 255)"/><rect x="2" y="2" width="124" height="124" rx="16" fill="none" stroke="rgb(27 42 74)" stroke-width="2"/><svg x="16" y="10" width="96" height="108" viewBox="26 152 80 96">${faviconArt}</svg></svg>\n`;
fs.writeFileSync(path.join(out,'xscore-favicon.svg'),favicon);
const pngs=new Map();let browser;
try {
 browser=await chromium.launch();
 for(const size of [16,32,48,180,512]){
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  const image=favicon.replace('width="64" height="64"',`width="${size}" height="${size}"`);
  await page.goto('data:image/svg+xml;base64,'+Buffer.from(image).toString('base64'));
  const png=await page.screenshot({omitBackground:false,animations:'disabled'});pngs.set(size,png);
  if(size!==48)fs.writeFileSync(path.join(out,`xscore-icon-${size}.png`),png);
  await page.close();
 }

 const tokenCss=fs.readFileSync(path.join(dir,'../../tokens/tokens.css'),'utf8');
 const background=tokenCss.match(/--surface-1:\s*(#[0-9a-f]{6})/i)[1];
 const rgb=hex=>[0,2,4].map(i=>parseInt(hex.slice(1+i,3+i),16));
 const luminance=color=>color.map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
 const contrast=color=>{const a=luminance(color),b=luminance(rgb(background));return(Math.max(a,b)+.05)/(Math.min(a,b)+.05);};
 const parts=[];
 for(let part=0;part<2;part++){
  let index=0;
  const wordmark=fs.readFileSync(path.join(out,'xscore-wordmark-light.svg'),'utf8');
  const svg=wordmark.replace(/<path\b[^>]*\/>/g,tag=>index++===part?tag:'').replace('width="358" height="96"','width="180" height="52"');
  const page=await browser.newPage({viewport:{width:180,height:52},deviceScaleFactor:1});
  await page.goto('data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64'));
  const pixels=PNG.sync.read(await page.screenshot({omitBackground:true,animations:'disabled'}));
  let count=0,min=Infinity,max=0,minColor;
  for(let at=0;at<pixels.data.length;at+=4)if(pixels.data[at+3]===255){const color=[...pixels.data.subarray(at,at+3)],ratio=contrast(color);count++;if(ratio<min){min=ratio;minColor=color;}max=Math.max(max,ratio);}
  assert.ok(count>0,'Contrast sample must contain fully opaque symbol pixels');
  parts.push({part:part===0?'blue-ribbon':'warm-ribbon',fullyOpaquePixels:count,minimumRatio:min,maximumRatio:max,minimumColor:minColor,belowReference3to1:min<3});
  await page.close();
 }
 fs.writeFileSync(path.join(out,'source/contrast.json'),JSON.stringify({schema:1,method:'SVG rendered at180x52; fully opaque symbol pixels; WCAG relative luminance against existing dark surface role. Measurement, not a conformity verdict.',surfaceRole:'--surface-1',background,viewport:[180,52],referenceMinimum:3,parts,decision:'Preserve the approved artwork; no recoloring or token changes.'},null,2)+'\n');
}finally{if(browser)await browser.close();}
// Next's ICO decoder requires PNG RGBA (colorType 6), including opaque entries.
for(const size of [16,32,48])pngs.set(size,PNG.sync.write(PNG.sync.read(pngs.get(size)),{colorType:6,inputColorType:6}));
const sizes=[16,32,48],header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);
let offset=header.length;
sizes.forEach((size,i)=>{const at=6+16*i,png=pngs.get(size);header[at]=size;header[at+1]=size;header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(png.length,at+8);header.writeUInt32LE(offset,at+12);offset+=png.length;});
fs.writeFileSync(path.join(out,'xscore-favicon.ico'),Buffer.concat([header,...sizes.map(size=>pngs.get(size))]));
const outputs=['xscore-wordmark-dark.svg','xscore-wordmark-light.svg','xscore-monogram.svg','xscore-favicon.svg','xscore-favicon.ico',...[16,32,180,512].map(size=>`xscore-icon-${size}.png`)];
const manifest={schema:1,method:'Approved vector contour; sampled gradient colors; derived symbol and opaque white/navy icon tile; PNGs rendered with the repository browser',assets:outputs.map(file=>{const bytes=fs.readFileSync(path.join(out,file));return{file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};})};
fs.writeFileSync(path.join(out,'asset-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({generated:outputs.length,approvedWordmarkBytesPreserved:true,temporaryFilesRemoved:true}));
}finally{fs.rmSync(temp,{recursive:true,force:true});}
}
generate().catch(error=>{console.error(error.message);process.exitCode=1;});
