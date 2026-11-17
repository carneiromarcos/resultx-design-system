// Measurements use this repository's generated catalog and installed browser.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('@playwright/test');
const {brands}=require('../catalog/bindings.config');
const {bindings,resolve}=require('./catalog/lib.cjs');
const {parseCssColor}=require('../tests/visual/lib/css-color');
const {elementById}=require('./catalog/components.cjs');
const root=path.resolve(__dirname,'..'),site=path.join(root,'_site/catalog');
const rgb=s=>s.startsWith('#')?[0,2,4].map(i=>parseInt((s.length===4?[...s.slice(1)].map(x=>x+x).join(''):s.slice(1)).slice(i,i+2),16)):parseCssColor(s);
const opaque=s=>{const c=rgb(s);if(c.length>3&&c[3]!==1)throw Error('A sonda exige par opaco explicitamente resolvido');return c;};
const luminance=c=>c.slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((s,n,i)=>s+n*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{const x=luminance(opaque(a)),y=luminance(opaque(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const rows=[],geometry=[],failedRequests=[];
const server=http.createServer((req,res)=>{const file=path.resolve(site,'.'+new URL(req.url,'http://127.0.0.1').pathname);if(!file.startsWith(site+path.sep)){res.writeHead(403);return res.end();}try{res.setHeader('Content-Type',{'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
const measurementFailed = report => Boolean(report.baseFailures || report.geometryFailures || report.additionalFailures || report.failedRequests.length);
module.exports = { measurementFailed };
if (require.main === module) {
require('node:child_process').execFileSync(process.execPath,[path.join(__dirname,'catalog/build.cjs')],{cwd:root,stdio:['ignore','ignore','inherit']});
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
 page.on('requestfailed',r=>failedRequests.push({path:new URL(r.url()).pathname,error:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)failedRequests.push(new URL(r.url()).pathname);});
 for(const brand of brands)for(const theme of ['light','dark']){
  for(const kind of ['badge','notice']){
   await page.goto(`${base}/${brand.id}/${theme}/${kind==='badge'?'status-badge':'notice'}/example.html`,{waitUntil:'networkidle'});await page.evaluate(async()=>{await Promise.all([...document.fonts].map(face=>face.load()));for(const selector of ['body','h1','.rx-notice__title']){const el=document.querySelector(selector);if(!el)continue;const s=getComputedStyle(el),family=s.fontFamily.split(',')[0],descriptor=`${s.fontWeight} ${s.fontSize} ${family}`;const loaded=await document.fonts.load(descriptor);if(!loaded.length||!document.fonts.check(descriptor))throw Error('Face local exigida não carregada');}await document.fonts.ready;});
   for(const variant of ['warning','info']){
    const selector=`[data-contract-state=normal] .rx-${kind}--${variant}`;
    const c=await page.locator(selector).first().evaluate(el=>{const s=getComputedStyle(el);let parent=el.parentElement;while(parent&&getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)')parent=parent.parentElement;return {text:s.color,background:s.backgroundColor,border:s.borderTopColor,borderStyle:s.borderTopStyle,borderWidth:parseFloat(s.borderTopWidth),adjacent:getComputedStyle(parent).backgroundColor};});
    const text=ratio(c.text,c.background),inside=ratio(c.border,c.background),outside=ratio(c.border,c.adjacent);
    rows.push({brand:brand.dir,theme,kind,variant,context:'surface-1',colors:c,textRatio:text,borderInside:inside,borderOutside:outside,pass:text>=4.5&&inside>=3&&outside>=3&&c.borderStyle==='solid'&&c.borderWidth>0});
    if(kind==='badge'&&variant==='warning'){
     const surface2=resolve(bindings(root,brand,theme).values,'--bg-surface-2');const edge=ratio(c.border,surface2);
     rows.push({brand:brand.dir,theme,kind,variant,context:'surface-2-adjacent',foreground:c.border,background:surface2,minimum:3,ratio:edge,pass:edge>=3});
     const table=elementById(fs.readFileSync(path.join(root,'examples/pilot.html'),'utf8'),'table');
     const tableColor=await page.evaluate(html=>{const box=document.createElement('div');box.innerHTML=html;document.body.append(box);let node=box.querySelector('tbody tr');while(getComputedStyle(node).backgroundColor==='rgba(0, 0, 0, 0)')node=node.parentElement;const color=getComputedStyle(node).backgroundColor;box.remove();return color;},table);
     const edgeTable=ratio(c.border,tableColor);rows.push({brand:brand.dir,theme,kind,variant,context:'rx-table-row',foreground:c.border,background:tableColor,minimum:3,ratio:edgeTable,pass:edgeTable>=3});
    }
   }
   if(kind==='notice'){
    for(const width of [390,1440]){await page.setViewportSize({width,height:1000});const boxes=await page.locator('.rx-notice').evaluateAll(nodes=>nodes.map(el=>{const title=el.querySelector('.rx-notice__title'),range=document.createRange();range.selectNodeContents(title);return {lines:range.getClientRects().length,fits:el.scrollWidth<=el.clientWidth};}));geometry.push({brand:brand.dir,theme,width,boxes,pass:boxes.every(b=>b.lines===1&&b.fits)});}
    const action=page.locator('[data-contract-state=normal] .rx-notice a').first();await action.focus();
    const c=await action.evaluate(el=>({foreground:getComputedStyle(el).outlineColor,background:getComputedStyle(el.parentElement).backgroundColor,style:getComputedStyle(el).outlineStyle,width:parseFloat(getComputedStyle(el).outlineWidth)}));
    const r=ratio(c.foreground,c.background);rows.push({brand:brand.dir,theme,kind:'action',context:'focus',...c,minimum:3,ratio:r,pass:r>=3&&c.style==='solid'&&c.width>0});
    await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);
   }
  }
 }
 const hashes=Object.fromEntries(['adapters/css/pilot.css','contracts/notice.yaml','contracts/status-badge.yaml','catalog/bindings.config.js'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
 const report={method:'Computed browser colors from generated catalog; WCAG luminance, unrounded comparisons; no token value changes',sources:hashes,basePairs:rows.filter(r=>r.context==='surface-1').length,baseFailures:rows.filter(r=>r.context==='surface-1'&&!r.pass).length,geometryFailures:geometry.filter(r=>!r.pass).length,geometry,additionalFailures:rows.filter(r=>r.context!=='surface-1'&&!r.pass).length,failedRequests,rows};
 console.log(JSON.stringify(report,null,2));if(measurementFailed(report))process.exitCode=1;
 }finally{if(browser)await browser.close();server.closeAllConnections();if(server.listening)await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error.message);process.exitCode=1;});

}
