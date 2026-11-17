// Read-only compatibility proof: previous public showcase, current contract runner.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {spawn,execFileSync}=require('node:child_process');
const {once}=require('node:events');
const assert=require('node:assert/strict'),yaml=require('js-yaml');
const {requiredDeclaration}=require('../tests/visual/lib/contract-capabilities');
const root=path.resolve(__dirname,'..'),sourceSha='64a26656170ae506f3bb4c05647c5f3c63c43177';
const previous=execFileSync('git',['show',`${sourceSha}:examples/pilot.html`],{cwd:root});
const cases=fs.readdirSync(path.join(root,'contracts')).filter(f=>f.endsWith('.yaml')).flatMap(f=>yaml.load(fs.readFileSync(path.join(root,'contracts',f),'utf8')).casos_teste.map(c=>c.id));
const newer=cases.filter(requiredDeclaration).length,output=fs.mkdtempSync(path.join(os.tmpdir(),'ds-pilot-compat-'));
const server=http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://127.0.0.1').pathname;
  if(pathname==='/examples/legacy-pilot.html'){res.setHeader('Content-Type','text/html');return res.end(previous);}
  const file=path.resolve(root,'.'+decodeURIComponent(pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
  try{res.setHeader('Content-Type',{'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'}[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}
});
(async()=>{try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url=`http://127.0.0.1:${server.address().port}/examples/legacy-pilot.html`;
 const child=spawn(process.execPath,[require.resolve('@playwright/test/cli'),'test','tests/visual/pilot-contracts.spec.js','--grep','(light|dark):','--workers=2','--reporter=json','--output',output],{cwd:root,env:{...process.env,RESULTX_ADAPTER_URL:url},stdio:['ignore','pipe','pipe']});
 let stdout='',stderr='';child.stdout.on('data',c=>stdout+=c);child.stderr.on('data',c=>stderr+=c);
 const [exit]=await once(child,'exit');assert.equal(exit,0,stderr||stdout);
 const report=JSON.parse(stdout);assert.equal(report.stats.unexpected,0);assert.equal(report.stats.skipped,newer*2);assert.equal(report.stats.expected,(cases.length-newer)*2);
 console.log(JSON.stringify({sourceSha,previousShowcase:true,currentRunner:true,passed:report.stats.expected,failed:report.stats.unexpected,skippedNewObligations:report.stats.skipped,latestConformity:false},null,2));
 }finally{server.closeAllConnections();if(server.listening)await new Promise(resolve=>server.close(resolve));fs.rmSync(output,{recursive:true,force:true});}})().catch(error=>{console.error(error.message);process.exitCode=1;});
