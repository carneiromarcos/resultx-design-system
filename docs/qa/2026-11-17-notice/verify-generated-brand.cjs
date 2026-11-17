const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const base='64a26656170ae506f3bb4c05647c5f3c63c43177';
const directory='brands/emprega-mais/previews/brand-system/';
const old=file=>execFileSync('git',['show',`${base}:${directory}${file}`]);
const before=JSON.parse(old('provenance.json')),after=JSON.parse(fs.readFileSync(directory+'provenance.json'));
assert.deepEqual(after.components,[...before.components,'notice'].sort());
const previousInputs=new Map(before.inputs.map(input=>[input.file,input.sha256]));
const currentInputs=new Map(after.inputs.map(input=>[input.file,input.sha256]));
const added=after.inputs.filter(input=>!previousInputs.has(input.file)).map(input=>input.file).sort();
assert.deepEqual(added,['contracts/notice.yaml','generated/component-cards/notice.md']);
const changed=before.inputs.filter(input=>currentInputs.get(input.file)!==input.sha256).map(input=>input.file).sort();
assert.deepEqual(changed,['brands/emprega-mais/tokens/pilot-aliases.css','contracts/status-badge.yaml','generated/component-cards/status-badge.md']);
const remaining=object=>Object.fromEntries(Object.entries(object).filter(([key])=>!['components','inputs','contentId'].includes(key)));
assert.deepEqual(remaining(after),remaining(before));
const brandChanges=execFileSync('git',['diff',base,'--name-only','--','brands/emprega-mais'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
const allowedBrandChanges=new Set([directory+'index.html',directory+'dark.html',directory+'provenance.json','brands/emprega-mais/tokens/pilot-aliases.css','brands/emprega-mais/tokens/pilot-aliases.css.sha256']);
assert.ok(brandChanges.every(file=>allowedBrandChanges.has(file)),'Only the five explicitly reserved generated files may differ');
const html=[];
for(const [file,theme]of[['index.html','light'],['dark.html','dark']]){
 const original=old(file),current=fs.readFileSync(directory+file,'utf8');
 const opening=`<article><h3><a href="https://carneiromarcos.github.io/resultx-design-system/catalog/emprega/${theme}/notice/">`;
 const start=current.indexOf(opening);assert.ok(start>=0);assert.equal(current.indexOf(opening,start+1),-1);
 const end=current.indexOf('</article>',start)+'</article>'.length;
 const cleaned=(current.slice(0,start)+current.slice(end)).replaceAll(after.contentId.slice(0,12),before.contentId.slice(0,12));
 assert.ok(Buffer.from(cleaned).equals(original),`${file}: only the Notice article and content hash may differ`);
 html.push({file:directory+file,onlyNoticeLinkAndContentId:true,sha256:crypto.createHash('sha256').update(current).digest('hex')});
}
console.log(JSON.stringify({base,html,noticeRegistrationOnly:true,addedInputs:added,changedInputHashes:changed,otherProvenanceFieldsIdentical:true,brandGeneratorTestCssFontLogoUnchanged:true,brandChanges},null,2));
