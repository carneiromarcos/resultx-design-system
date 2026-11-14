const { chromium } = require('@playwright/test');
const { controlBoundary } = require(process.cwd() + '/tests/visual/lib/contract-probes');
const { pathToFileURL } = require('url');
const fs = require('fs');
const samples = JSON.parse(fs.readFileSync('reports/pilot-primary-marcas.json'));
function hsl(h, l) { const c = (1 - Math.abs(2 * l - 1)), x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2; const rgb = h < 60 ? [c,x,0] : h < 120 ? [x,c,0] : h < 180 ? [0,c,x] : h < 240 ? [0,x,c] : h < 300 ? [x,0,c] : [c,0,x]; return '#' + rgb.map(v => Math.round((v+m)*255).toString(16).padStart(2,'0')).join(''); }
(async () => {
 const browser = await chromium.launch({ ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}), headless:true });
 const page = await browser.newPage({ viewport:{ width:1440,height:900 }});
 const lines = ['grade,marca,matiz,luminosidade,tema,estado,preenchimento,contraste_limite'];
 for (const theme of ['light','dark']) {
  await page.goto(pathToFileURL(process.cwd() + '/examples/pilot.html').href + '?theme=' + theme);
  for (const type of ['marcas','grade']) for (const row of samples) {
   const fill = type === 'grade' ? hsl(row.matiz, {escura:.25,media:.5,média:.5,clara:.75}[row.luminosidade]) : row[theme === 'light' ? 'claro' : 'escuro'];
   const hover = type === 'grade' ? fill : row[theme === 'light' ? 'claroHover' : 'escuroHover'];
   await page.locator('#primary').evaluate((e, [a,b]) => { e.style.setProperty('--accent-primary', a); e.style.setProperty('--accent-primary-hover', b); }, [fill,hover]);
   for (const state of ['normal','hover']) { if(state === 'normal') await page.mouse.move(0,0); else await page.locator('#primary').hover(); const v=await controlBoundary(page,'#primary'); lines.push([type,row.marca,row.matiz,row.luminosidade,theme,state,state==='hover'?hover:fill,v.toFixed(3)].join(',')); }
  }
 }
 fs.writeFileSync('reports/pilot-primary-limites.csv', lines.join('\n')+'\n'); console.log(`${lines.length-1} medições aprovadas`); await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1});
