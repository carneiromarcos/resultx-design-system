// Evidência local de documentação; PNG nunca é baseline versionada.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
const require = createRequire(import.meta.url);
const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(here, '../../../..');
const {build} = require('../build.cjs');
const {ratio} = require('../../../../../scripts/catalog/lib.cjs');
const {parseCssColor} = require('../../../../../tests/visual/lib/css-color.js');
const out = process.env.QA_OUT || path.join(os.tmpdir(),'resultx-emprega-brand-system');
fs.mkdirSync(out,{recursive:true});
// Uma falha não pode conservar uma prova verde de uma execução anterior.
fs.rmSync(path.join(out,'manifest.json'),{force:true});
const provenance = build();
const prefix = '/ds';
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.woff2':'font/woff2','.png':'image/png','.json':'application/json'};
const server = http.createServer((request,response)=>{
  const url = new URL(request.url,'http://fixture.test');
  if (!url.pathname.startsWith(prefix+'/')) {response.writeHead(404).end();return;}
  const target = path.resolve(root,'.'+decodeURIComponent(url.pathname.slice(prefix.length)));
  if (!target.startsWith(root+path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {response.writeHead(404).end();return;}
  response.writeHead(200,{'Content-Type':mime[path.extname(target)]||'text/plain; charset=utf-8'});
  fs.createReadStream(target).pipe(response);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const toHex = color => '#'+parseCssColor(color).slice(0,3).map(n=>Math.round(n).toString(16).padStart(2,'0')).join('');
const contrast = (a,b)=>ratio(toHex(a),toHex(b));
const manifest=[];
const hash = file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
try {
  browser = await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined});
  for (const theme of ['light','dark']) for (const width of [390,1440]) {
    const context = await browser.newContext({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce'});
    const external=[],badResponses=[],pageErrors=[];
    await context.route('**/*',route=>{
      if(new URL(route.request().url()).origin!==origin){external.push(route.request().url());return route.abort();}
      return route.continue();
    });
    const page=await context.newPage();
    page.on('response',r=>{if(r.status()>=400)badResponses.push({path:new URL(r.url()).pathname,status:r.status()});});
    page.on('pageerror',e=>pageErrors.push(e.message));
    const file=theme==='light'?'index.html':'dark.html';
    const url=origin+prefix+'/brands/emprega-mais/previews/brand-system/'+file;
    try {
      const response=await page.goto(url,{waitUntil:'networkidle'});
      assert.equal(response.status(),200);
      const fonts=await page.evaluate(async()=>{
        const used=[['Inter',400],['Inter',500],['Inter',600],['Sora',600],['JetBrains Mono',400]];
        const result=[];
        for(const [family,weight]of used){
          const faces=await document.fonts.load(`${weight} 16px "${family}"`);
          result.push({family,weight,check:document.fonts.check(`${weight} 16px "${family}"`),loaded:faces.length>0&&faces.every(f=>f.status==='loaded')});
        }
        await document.fonts.ready;
        return result;
      });
      assert.ok(fonts.every(f=>f.check&&f.loaded),'Fonte usada não carregou.');
      const surface=await page.evaluate(()=>({theme:document.documentElement.dataset.theme,width:innerWidth,scrollWidth:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),scripts:document.scripts.length,csp:document.querySelector('meta[http-equiv="Content-Security-Policy"]').content,images:[...document.images].every(e=>e.complete&&e.naturalWidth>0)}));
      assert.equal(surface.theme,theme);
      if(surface.scrollWidth>surface.width){const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].map(e=>({tag:e.tagName,class:e.className,id:e.id,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(e=>e.right>innerWidth+1||e.x<0));fs.writeFileSync(path.join(out,`overflow-${theme}-${width}.json`),JSON.stringify({surface,overflow},null,2));await page.screenshot({path:path.join(out,`overflow-${theme}-${width}.png`),fullPage:true});}
      assert.ok(surface.scrollWidth<=surface.width,'Rolagem horizontal da página.');assert.equal(surface.scripts,0);assert.equal(surface.csp,"default-src 'self'");assert.equal(surface.images,true);
      const selectors=['#surfaces h2','.reading .secondary','#sample-muted','.theme-link','.action-reading p'];
      const contrasts=[];
      for(let i=0;i<selectors.length;i++){
        const colors=await page.locator(selectors[i]).first().evaluate(el=>{
          let n=el,bg;
          while(n){const c=getComputedStyle(n).backgroundColor;if(c.replaceAll(' ','')!=='rgba(0,0,0,0)'&&c!=='transparent'){bg=c;break;}n=n.parentElement;}
          return {fg:getComputedStyle(el).color,bg};
        });
        const measured=contrast(colors.fg,colors.bg),expected=provenance.contrasts[theme][i];
        assert.ok(Math.abs(measured-expected.ratio)<0.02,`Cor real diferente da fonte em ${expected.label}`);
        if(i!==2)assert.ok(measured>=4.5,`Texto de leitura abaixo de 4,5: ${expected.label}`);
        contrasts.push({label:expected.label,...colors,ratio:Number(measured.toFixed(4)),minimum:4.5,status:measured>=4.5?'ATENDE':'PENDENTE'});
      }
      if(contrasts[2].status==='PENDENTE')assert.ok(await page.getByText('Uma amostra precisa de revisão').isVisible());
      const screenshot=`emprega-${theme}-${width}.png`;
      await page.screenshot({path:path.join(out,screenshot),fullPage:true});
      for(let step=0;step<3;step++) await page.keyboard.press('Tab');
      await page.waitForFunction(()=>document.activeElement===document.querySelector('.theme-link'));
      const focus=await page.locator('.theme-link').evaluate(e=>{
        const s=getComputedStyle(e),r=e.getBoundingClientRect();
        return {active:e===document.activeElement,visible:e.matches(':focus-visible'),width:parseFloat(s.outlineWidth),offset:parseFloat(s.outlineOffset),style:s.outlineStyle,color:s.outlineColor,background:getComputedStyle(e.closest('.topbar')).backgroundColor,box:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},viewport:{width:innerWidth,height:innerHeight}};
      });
      assert.ok(focus.active&&focus.visible);assert.ok(focus.width>0&&focus.style!=='none');
      const margin=focus.width+focus.offset;
      assert.ok(focus.box.x-margin>=0&&focus.box.y-margin>=0&&focus.box.right+margin<=focus.viewport.width&&focus.box.bottom+margin<=focus.viewport.height,'Contorno de foco fora da viewport.');
      focus.ratio=Number(contrast(focus.color,focus.background).toFixed(4));assert.ok(focus.ratio>=3);
      const focusShot=`emprega-${theme}-${width}-focus.png`;
      await page.screenshot({path:path.join(out,focusShot)});
      await page.keyboard.press('Enter');
      const other=theme==='light'?'dark.html':'index.html';
      await page.waitForURL(origin+prefix+'/brands/emprega-mais/previews/brand-system/'+other);
      assert.equal(await page.locator('html').getAttribute('data-theme'),theme==='light'?'dark':'light');
      let mobileNav={applicable:false};
      if(width===390){
        await page.locator('.mobile-nav summary').focus();await page.keyboard.press('Enter');
        await page.waitForFunction(()=>document.querySelector('.mobile-nav').open===true);
        await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('.mobile-nav').open===false);
        mobileNav={applicable:true,keyboardOpenClose:true};
      }
      assert.deepEqual(external,[]);assert.deepEqual(badResponses,[]);assert.deepEqual(pageErrors,[]);
      manifest.push({theme,width,fonts,surface,contrasts,focus,mobileNav,externalRequests:external.length,failedResponses:badResponses.length,screenshots:[screenshot,focusShot].map(file=>({file,sha256:hash(path.join(out,file))}))});
      console.log(`${theme} ${width}: fontes OK, zero externo/404, foco ${focus.ratio}:1, sem rolagem horizontal.`);
    }finally{await context.close();}
  }
  fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({contentId:provenance.contentId,cases:manifest,passed:manifest.length,failed:0,skipped:0,retries:0},null,2)+'\n');
}finally{
  if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
}
