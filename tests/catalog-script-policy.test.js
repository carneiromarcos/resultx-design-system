const fs=require('fs'),path=require('path'),os=require('os'),yaml=require('js-yaml');
const {coverage}=require('../scripts/catalog/lib.cjs');
const approved=['sidebar-overlay','menu-drawer','split-pane','header-float','cta-dock','disclosure'];
function fixture(run){const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'catalog-scripts-'));try{for(const dir of ['catalog','contracts','docs/components','components','adapters','examples','generated','tokens'])fs.cpSync(dir,path.join(tmp,dir),{recursive:true});fs.mkdirSync(path.join(tmp,'dist'),{recursive:true});for(const id of approved)fs.copyFileSync('dist/'+id+'.js',path.join(tmp,'dist',id+'.js'));const file=path.join(tmp,'catalog/manifest.yaml'),m=yaml.load(fs.readFileSync(file,'utf8'));run(tmp,m,updated=>fs.writeFileSync(file,yaml.dump(updated)));}finally{fs.rmSync(tmp,{recursive:true,force:true});}}
test.each(approved)('script publicado %s é permitido somente na sua própria página',id=>fixture((tmp,m,save)=>{
 m.pages.push({id,recipe:'catalog/recipes/familia.html',css:[],js:['dist/'+id+'.js']});save(m);
 expect(()=>coverage(tmp)).not.toThrow();
}));
test.each(approved)('script %s em Button é recusado',id=>fixture((tmp,m,save)=>{
 m.pages.find(p=>p.id==='button').js=['dist/'+id+'.js'];save(m);
 expect(()=>coverage(tmp)).toThrow('JavaScript fora da autorização do catálogo: button');
}));
test.each(approved)('página %s não pode carregar o módulo de outro componente',id=>fixture((tmp,m,save)=>{
 const other=approved.find(x=>x!==id);m.pages.push({id,recipe:'catalog/recipes/familia.html',css:[],js:['dist/'+other+'.js']});save(m);
 expect(()=>coverage(tmp)).toThrow('JavaScript fora da autorização do catálogo: '+id);
}));
