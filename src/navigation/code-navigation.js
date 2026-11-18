/* Verified, commit-pinned code navigation for the SVG and frontend lanes. */
(function(){
'use strict';
const manifest=window.THREE_LANES_SOURCE_MANIFEST?.steps||{};
const ROOT='https://raw.githubusercontent.com/spring-projects/spring-petclinic/';
const BLOB='https://github.com/spring-projects/spring-petclinic/blob/';
const fileCache=new Map();
const MAX_CACHE=100;
const escapeHtml=value=>String(value==null?'':value).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]});
const isSafePath=p=>typeof p==='string'&&(/^(src\/[A-Za-z0-9_./-]+|pom\.xml)$/.test(p))&&!p.includes('..');
const sourceUrl=(sha,path,line)=>BLOB+encodeURIComponent(sha)+'/'+path.split('/').map(encodeURIComponent).join('/')+(Number.isInteger(line)&&line>0?'#L'+line:'');
function getText(sha,path){
 if(!/^[a-f0-9]{40}$/.test(sha)||!isSafePath(path))return Promise.reject(Error('Invalid revision or file path'));
 const key=sha+'|'+path;
 if(fileCache.has(key))return fileCache.get(key);
 const url=ROOT+sha+'/'+path.split('/').map(encodeURIComponent).join('/');
 const job=fetch(url,{headers:{Accept:'text/plain'}}).then(response=>{
   if(!response.ok)throw Error('File is not available at this commit (HTTP '+response.status+')');
   return response.text();
 });
 fileCache.set(key,job);
 if(fileCache.size>MAX_CACHE)fileCache.delete(fileCache.keys().next().value);
 return job;
}
function buildRefs(step,side){
 const config=manifest[step.id]||{};
 const primary={label:'Changed source',role:'change',path:step.file,needle:config.needle||'',svg:config.svg||[]};
 const refs=[primary].concat(config.related||[]);
 return refs.filter(ref=>isSafePath(ref.path)).slice(0,5);
}
async function resolve(sha,ref){
 try{
  const code=await getText(sha,ref.path);
  const lines=code.replace(/\r\n/g,'\n').split('\n');
  const needle=String(ref.needle||'').trim();
  const idx=needle?lines.findIndex(line=>line.includes(needle)):-1;
  if(idx<0)return {ref,available:false};
  return {ref,available:true,code,lines,line:idx+1,url:sourceUrl(sha,ref.path,idx+1)};
 }catch(error){return {ref,available:false,error:String(error?.message||error)}}
}
function displayName(path){return String(path).split('/').pop()}
function paintPeek(side,item){
 const peek=document.getElementById(side+'SourcePeek');
 if(!peek)return;
 const start=Math.max(1,item.line-5),end=Math.min(item.lines.length,item.line+6);
 const rows=[];
 for(let n=start;n<=end;n++){
  rows.push('<div class="nav-source-row'+(n===item.line?' selected':'')+'"><a href="'+escapeHtml(sourceUrl(item.sha,item.ref.path,n))+'" target="_blank" rel="noopener noreferrer" class="nav-line-number" aria-label="Open source line '+n+'">'+n+'</a><code>'+escapeHtml(item.lines[n-1])+'</code></div>');
 }
 peek.hidden=false;
 peek.innerHTML='<div class="nav-peek-head"><div><b>'+escapeHtml(item.ref.label)+'</b><small>'+escapeHtml(item.ref.path)+' · '+item.line+' · '+item.sha.slice(0,10)+'</small></div><div class="nav-peek-actions"><a href="'+escapeHtml(item.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Open line on GitHub">GitHub ↗</a><button type="button" data-source-close="'+escapeHtml(side)+'" aria-label="Close source preview">×</button></div></div><div class="nav-peek-code">'+rows.join('')+'</div>';
}
function activateSvg(svg,items,side){
 if(!svg)return;
 const visible=items.filter(x=>x.available);
 if(!visible.length)return;
 // Labels already inside the diagram are the click targets: no added fake boxes or tooltips.
 const targets=svg.querySelectorAll('text');
 for(const label of targets){
   const phrase=(label.textContent||'').trim().toLowerCase();
   if(!phrase)continue;
   const match=visible.find(item=>(item.ref.svg||[]).some(term=>term.length>=4&&phrase.includes(term.toLowerCase())));
   if(!match)continue;
   label.classList.add('nav-svg-target');
   label.setAttribute('role','link');
   label.setAttribute('tabindex','0');
   label.setAttribute('aria-label','View '+match.ref.label+' at commit '+match.sha.slice(0,8)+' line '+match.line);
   label.addEventListener('click',e=>{e.stopPropagation();paintPeek(side,match)});
   label.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();paintPeek(side,match)}});
 }
 // Architectural icons are also navigable: database cylinders -> schema/repository; servers -> controller.
 for(const group of svg.querySelectorAll('g[transform]')){
   if(group.closest('.nav-svg-target'))continue;
   const database=!!group.querySelector('ellipse');
   const iconRole=database?['schema','dependency']:['controller','change'];
   const target=visible.find(x=>iconRole.includes(x.ref.role))||visible[0];
   if(!target||!(group.querySelector('ellipse')||group.querySelector('rect')))continue;
   group.classList.add('nav-svg-icon');
   group.setAttribute('role','link');group.setAttribute('tabindex','0');
   group.setAttribute('aria-label','View '+target.ref.label+' source');
   group.addEventListener('click',e=>{e.stopPropagation();paintPeek(side,target)});
   group.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopPropagation();paintPeek(side,target)}});
 }
}
function mount(args){
 const side=args.side;
 const nav=document.getElementById(side+'SourceNav'),peek=document.getElementById(side+'SourcePeek');
 if(!nav||!peek)return;
 nav.replaceChildren();peek.hidden=true;peek.textContent='';
 const step=args.step;
 if(!step||!args.sha||(!step.kind.includes(side)&&step.kind!=='both')){
   nav.hidden=true;return;
 }
 nav.hidden=false;
 const stamp=args.sha+'|'+args.id+'|'+side;
 nav.dataset.current=stamp;
 nav.innerHTML='<div class="nav-links-title">SOURCE LINKS <span>Resolving at '+escapeHtml(args.sha.slice(0,8))+'…</span></div>';
 const refs=buildRefs({...step,id:args.id},side);
 Promise.all(refs.map(ref=>resolve(args.sha,ref))).then(resolved=>{
  if(nav.dataset.current!==stamp)return;
  const items=resolved.filter(x=>x.available).map(x=>({...x,sha:args.sha}));
  if(!items.length){
    nav.innerHTML='<div class="nav-links-title">SOURCE LINKS <span>Exact source lines unavailable for this revision</span></div>';
    return;
  }
  nav.innerHTML='<div class="nav-links-title">SOURCE LINKS <span>Exact commit · '+escapeHtml(args.sha.slice(0,8))+'</span></div><div class="nav-links-list">'+items.map((x,i)=>'<span class="nav-link-unit"><button type="button" data-source-peek="'+i+'" aria-label="Preview '+escapeHtml(x.ref.label)+'"><b>'+escapeHtml(x.ref.label)+'</b><small>'+escapeHtml(displayName(x.ref.path))+':'+x.line+'</small></button><a href="'+escapeHtml(x.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+escapeHtml(x.ref.label)+' on GitHub">↗</a></span>').join('')+'</div>';
  nav.onclick=e=>{
    const btn=e.target.closest('[data-source-peek]');
    if(!btn)return;
    const item=items[Number(btn.dataset.sourcePeek)];
    if(item)paintPeek(side,item);
  };
  const svg=args.visual.querySelector('svg');
  if(svg)activateSvg(svg,items,side);
 });
}
document.addEventListener('click',event=>{
 const close=event.target.closest('[data-source-close]');
 if(!close)return;
 const peek=document.getElementById(close.dataset.sourceClose+'SourcePeek');
 if(peek)peek.hidden=true;
});
window.THREE_LANES_CODE_NAV=Object.freeze({mount,sourceUrl,resolve});
})();
