const q=id=>document.getElementById(id);
const state={assets:[],category:'All',query:'',selected:null,source:''};
const categories=()=>['All',...new Set(state.assets.map(a=>a.category))];
const escape=s=>String(s);
function element(tag,klass,text){const e=document.createElement(tag);if(klass)e.className=klass;if(text!==undefined)e.textContent=text;return e;}
async function copy(text,button){
 try{await navigator.clipboard.writeText(text);button.textContent='Copied ✓';setTimeout(()=>{button.textContent=button.dataset.original||'Copy ID'},1000)}
 catch{button.textContent='Copy unavailable';setTimeout(()=>{button.textContent=button.dataset.original||'Copy ID'},1400)}
}
function makeCard(asset){
 const a=element('article','card');
 const preview=element('div','preview'),img=document.createElement('img');
 img.src=asset.source+'?v=kit-200';img.alt=asset.title+' illustration';img.loading='lazy';
 preview.append(img);a.append(preview);
 const meta=element('div','meta');
 meta.append(element('span','category',asset.category),element('h3','',asset.title),element('code','id',asset.id));
 meta.append(element('div','tags',asset.tags.slice(0,5).map(t=>'#'+t).join('  ')));
 const actions=element('div','actions');
 const copyBtn=element('button','copy-id','Copy ID');copyBtn.type='button';copyBtn.dataset.original='Copy ID';copyBtn.addEventListener('click',()=>copy(asset.id,copyBtn));
 const codeBtn=element('button','code','SVG code');codeBtn.type='button';codeBtn.addEventListener('click',()=>showSource(asset));
 const link=element('a','github','GitHub ↗');link.href=asset.github;link.target='_blank';link.rel='noopener noreferrer';
 actions.append(copyBtn,codeBtn,link);meta.append(actions);a.append(meta);return a;
}
function render(){
 const selected=state.category.toLowerCase(),needle=state.query.trim().toLowerCase();
 const items=state.assets.filter(a=>(selected==='all'||a.category.toLowerCase()===selected)&&(!needle||[a.id,a.title,a.category,...a.tags].join(' ').toLowerCase().includes(needle)));
 q('gallery').replaceChildren(...(items.length?items.map(makeCard):[element('p','empty','No matching illustrations. Create a new SVG with your own ID if this mechanism needs one.')]));
 q('resultCount').textContent=items.length+' of '+state.assets.length+' modules';
}
function renderCategories(){
 const filters=q('filters');filters.replaceChildren();
 for(const cat of categories()){
  const b=element('button','filter',cat);b.type='button';b.setAttribute('aria-pressed',String(cat===state.category));
  b.addEventListener('click',()=>{state.category=cat;renderCategories();render()});filters.append(b);
 }
}
async function showSource(asset){
 state.selected=asset;state.source='';q('sourceDialog').showModal();
 q('dialogTitle').textContent=asset.title+' — '+asset.id;
 q('sourceHint').textContent='Standalone, editable SVG. Use this ID in the catalog or compose it with other modules.';
 q('sourceCode').textContent='Loading SVG source…';q('githubSource').href=asset.github;
 try{const response=await fetch(asset.source);if(!response.ok)throw Error('HTTP '+response.status);const content=await response.text();
  if(state.selected?.id===asset.id){state.source=content;q('sourceCode').textContent=content;}
 }catch(e){q('sourceCode').textContent='Could not fetch SVG source: '+e.message;}
}
q('search').addEventListener('input',e=>{state.query=e.target.value;render()});
q('closeDialog').addEventListener('click',()=>q('sourceDialog').close());
q('sourceDialog').addEventListener('close',()=>{state.selected=null;state.source=''});
q('copySvg').addEventListener('click',()=>{if(state.source)copy(state.source,q('copySvg'))});
fetch('catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()})
.then(data=>{
 if(!data.openVocabulary)throw Error('Catalog must allow user-generated new IDs');
 state.assets=data.assets||[];q('total').textContent=String(state.assets.length);renderCategories();render();
}).catch(e=>{q('gallery').replaceChildren(element('p','empty','Unable to load library: '+e.message))});
