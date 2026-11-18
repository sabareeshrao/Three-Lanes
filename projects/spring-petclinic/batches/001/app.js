(()=>{'use strict';
const byId=x=>document.getElementById(x),H=v=>String(v==null?'':v).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[x])),BASE='spring-projects/spring-petclinic';
const STORAGE='three-lanes-b001-v1',VERT='three-lanes-b001-scroll',MAX_LINES=100;
let data=[],commits=[],index=0,mode='view',tab='compare',selectedFile='',renderToken=0,sourceToken=0,activePeek={backend:null,frontend:null},restoreDone=false,pageFloor=0;
const store=(k,v)=>{try{localStorage.setItem(k,v)}catch{}},read=k=>{try{return localStorage.getItem(k)}catch{return null}};
try{const v=JSON.parse(read(STORAGE)||'{}');if(Number.isInteger(v.index))index=v.index;if(v.mode==='github'||v.mode==='view')mode=v.mode;}catch{}
const shaUrl=(sha,path,line)=>'https://github.com/'+BASE+'/blob/'+encodeURIComponent(sha)+'/'+path.split('/').map(encodeURIComponent).join('/')+(Number.isInteger(line)&&line>0?'#L'+line:'');
const commitUrl=s=>'https://github.com/'+BASE+'/commit/'+s;
const short=(s,n=38)=>String(s||'').length>n?String(s).slice(0,n-1)+'…':String(s||'');
const current=()=>data[index];
function preserve(fn){const y=window.scrollY,x=window.scrollX,app=byId('app');if(app){pageFloor=Math.max(pageFloor,app.offsetHeight,document.documentElement.scrollHeight,y+window.innerHeight+40);app.style.minHeight=Math.ceil(pageFloor)+'px';}const ret=fn();window.scrollTo({top:y,left:x,behavior:'instant'});requestAnimationFrame(()=>{if(Math.abs(window.scrollY-y)>1)window.scrollTo({top:y,left:x,behavior:'instant'})});return ret}
window.addEventListener('scroll',()=>{if(restoreDone)store(VERT,String(Math.round(window.scrollY)))},{passive:true});
function rowFileParts(s){return s.parts.filter(p=>p.rows?.length||p.binary);}
function renderTimeline(){const c=byId('timeline');c.innerHTML=commits.map(item=>{
const all=data.filter(s=>s.commitPosition===item.position),active=current()?.commitPosition===item.position;
const frontend=all.every(s=>s.lane==='frontend'),cls=frontend?'frontend':'backend';
return '<div class="commitgroup'+(active?' active':'')+'"><button class="commitbtn" type="button" data-commit="'+item.position+'"><span class="commitno '+cls+'">'+String(item.position).padStart(2,'0')+'</span><span><b>'+H(short(item.title,23))+'</b><small>'+H(item.sha.slice(0,8))+' · '+all.length+' steps</small></span></button><div class="substeps">'+all.map(s=>'<button type="button" data-step="'+H(s.id)+'" class="'+(s.id===current()?.id?'chosen':'')+'"><strong>'+H(s.id)+'</strong><span class="label">'+H(short(s.title,27))+'</span></button>').join('')+'</div></div>';
}).join('')}
function renderHeader(){const s=current();if(!s)return;byId('stepPosition').textContent=(index+1)+' / '+data.length;byId('prevStep').disabled=index<=0;byId('nextStep').disabled=index===data.length-1;
byId('viewMode').classList.toggle('chosen',mode==='view');byId('githubMode').classList.toggle('chosen',mode==='github');byId('inspectorTitle').textContent=mode==='view'?'Focused historical source':(tab==='compare'?'Before / After':tab==='diff'?'Commit changes':'Original source');
byId('backendCaption').textContent=s.lane==='backend'?s.title:'No backend source in this slice';byId('frontendCaption').textContent=s.lane==='frontend'?s.title:'No frontend source in this slice';
byId('backendChip').textContent=s.lane==='backend'?'CHANGED':'QUIET';byId('frontendChip').textContent=s.lane==='frontend'?'CHANGED':'QUIET';
byId('summary').innerHTML='<div><h2>Commit '+s.commitPosition+' · '+H(s.commitTitle)+'</h2><small>Historical SHA '+H(s.sha)+' · '+H(s.id)+' '+H(s.title)+'</small></div><div class="meta"><span class="chip">'+s.commitPosition+' / 10 original commits</span><span class="chip code">'+s.codeLineCount+' / 100 code lines</span><span class="chip">'+s.parts.length+' changed file slices</span><a href="'+H(commitUrl(s.sha))+'" target="_blank" rel="noopener noreferrer">Exact commit ↗</a></div>';
byId('commitLink').href=commitUrl(s.sha);
}
function linksMarkup(s){return s.sourceTargets.map((t,i)=>'<span class="refunit"><button type="button" data-source-ref="'+i+'">'+H(short(t.label,22))+':'+t.line+'</button><a href="'+H(shaUrl(t.sha,t.path,t.line))+'" target="_blank" rel="noopener noreferrer" aria-label="Open '+H(t.label)+' on GitHub">↗</a></span>').join('')}
function renderVisual(){const s=current(),token=++renderToken;for(const side of ['backend','frontend']){byId(side+'Peek').hidden=true;byId(side+'Peek').replaceChildren();activePeek[side]=null}
const backend=byId('backendGraphic'),frontend=byId('frontendGraphic');
const backendLinks=byId('backendLinks'),frontendLinks=byId('frontendLinks');
if(s.lane==='backend'){
 backend.innerHTML='<div class="loading">Loading commit-specific SVG…</div>';
 fetch(s.visual).then(r=>{if(!r.ok)throw Error('SVG unavailable (HTTP '+r.status+')');return r.text()}).then(svg=>{if(token!==renderToken)return;if(!/^\s*<svg[\s\S]*<\/svg>\s*$/.test(svg))throw Error('Invalid SVG asset');preserve(()=>{backend.innerHTML=svg;})}).catch(e=>{if(token===renderToken)backend.innerHTML='<div class="error">'+H(e.message)+'</div>'});
 frontend.innerHTML='<div class="quiet"><span class="quiet-glyph">▣</span><b>No frontend source changed</b><p>This subcommit concerns source code or configuration outside the presentation layer.</p></div>';
}else{
 backend.innerHTML='<div class="quiet"><span class="quiet-glyph">◇</span><b>Presentation-focused change</b><p>The source change is in JSP, CSS or historical static assets. No backend source is fabricated.</p></div>';
 frontend.innerHTML='<iframe sandbox="allow-scripts allow-popups" scrolling="no" title="'+H(s.title)+' — historical presentation illustration" src="'+H(s.visual)+'"></iframe>';
}
for(const side of ['backend','frontend']){
 const links=byId(side+'Links');links.hidden=side!==s.lane||!s.sourceTargets.length;
 links.innerHTML=links.hidden?'':'<div class="heading">SOURCE LINKS · '+H(s.sha.slice(0,8))+'</div><div class="sourceitems">'+linksMarkup(s)+'</div>';
}
}
function previewTarget(i){const s=current(),t=s?.sourceTargets?.[i];if(!t)return;const side=s.lane,peek=byId(side+'Peek'),key=t.sha+'|'+t.path+'|'+t.line;
return preserve(()=>{if(!peek.hidden&&activePeek[side]===key){peek.hidden=true;activePeek[side]=null;return}activePeek[side]=key;
const rows=s.parts.filter(p=>p.path===t.path).flatMap(p=>p.rows),loc=rows.findIndex(r=>r.new===t.line||r.old===t.line),near=rows.slice(Math.max(0,loc-5),loc+6);
peek.innerHTML='<div class="peekhead"><div><b>'+H(t.label)+'</b><small>'+H(t.path)+' · L'+t.line+' · '+H(t.sha.slice(0,8))+'</small></div><div><a href="'+H(shaUrl(t.sha,t.path,t.line))+'" target="_blank" rel="noopener noreferrer">GitHub ↗</a> <button type="button" data-close-peek="1">×</button></div></div><div class="peekcode codetable">'+near.map(r=>renderRow(r,t.path,!!r.new,null,r.new===t.line||r.old===t.line)).join('')+'</div>';
peek.hidden=false});
}
function renderRow(row,path,useNew,revOverride,highlight=false){const n=useNew?row.new:row.old;if(!Number.isInteger(n))return '';
const rev=revOverride||((useNew?current().sha:current().parentSha)||current().sha);
const cl=row.type==='add'?'add':row.type==='del'?'del':'';
return '<div class="coderow '+cl+(highlight?' highlight':'')+'"><a href="'+H(shaUrl(rev,path,n))+'" target="_blank" rel="noopener noreferrer">'+n+'</a><code>'+H(row.text)+'</code></div>';}
function codeFiles(which){const s=current();let count=0;return rowFileParts(s).map(p=>{if(!p.rows.length)return '<div class="filename">'+H(p.path)+'</div><div class="empty">Binary asset; there are no text source lines in this diff.</div>';
const rows=p.rows.filter(r=>which==='before'?!!r.old:which==='after'?!!r.new:true);
count+=rows.length;
return '<div class="filename">'+H(p.path)+'</div>'+(rows.length?rows.map(r=>renderRow(r,p.path,which==='before'?false:which==='after'?true:!!r.new)).join(''):'<div class="empty">'+(which==='before'?'File or lines introduced in this commit':'File or lines removed in this commit')+'</div>')}).join('');}
function selectFileOptions(){const s=current();const files=[...new Set(s.parts.map(p=>p.path))];if(!files.includes(selectedFile))selectedFile=files[0]||'';byId('fileSelect').innerHTML=files.map(p=>'<option value="'+H(p)+'"'+(p===selectedFile?' selected':'')+'>'+H(short(p,70))+'</option>').join('');byId('openFileLink').href=selectedFile?shaUrl(s.sha,selectedFile):commitUrl(s.sha)}
async function displayCompleteSource(){const s=current(),idx=++sourceToken,path=selectedFile;if(!path){byId('sourceContent').innerHTML='<div class="empty">No file selected</div>';return}
const target=byId('sourceContent');target.innerHTML='<div class="loading">Loading complete historical file from GitHub…</div>';
const url='https://raw.githubusercontent.com/'+BASE+'/'+s.sha+'/'+path.split('/').map(encodeURIComponent).join('/');
try{
 const res=await fetch(url);if(!res.ok)throw Error('HTTP '+res.status);
 const body=await res.text();
 if(idx!==sourceToken||s!==current()||tab!=='source'||mode!=='github')return;
 const lines=body.replace(/\r\n/g,'\n').split('\n');if(lines.at(-1)==='')lines.pop();
 preserve(()=>{target.innerHTML='<div class="singlepane"><div class="panehead">Complete original file · '+H(path)+' · '+H(s.sha.slice(0,9))+' · '+lines.length+' lines</div><div class="codetable">'+lines.map((txt,i)=>'<div class="coderow"><a href="'+H(shaUrl(s.sha,path,i+1))+'" target="_blank" rel="noopener noreferrer">'+(i+1)+'</a><code>'+H(txt)+'</code></div>').join('')+'</div></div>'});
}catch(e){if(idx===sourceToken)target.innerHTML='<div class="error">Complete file unavailable: '+H(e.message)+' — <a target="_blank" rel="noopener noreferrer" href="'+H(shaUrl(s.sha,path))+'">Open on GitHub ↗</a></div>'}
}
function renderSource(){const s=current();if(!s)return;sourceToken++;selectFileOptions();
byId('compareTab').classList.toggle('chosen',mode==='github'&&tab==='compare');byId('diffTab').classList.toggle('chosen',mode==='github'&&tab==='diff');byId('fullTab').classList.toggle('chosen',mode==='github'&&tab==='source');
byId('compareTab').disabled=mode==='view';byId('diffTab').disabled=mode==='view';byId('fullTab').disabled=mode==='view';
const target=byId('sourceContent');
if(s.codeLineCount>MAX_LINES){target.innerHTML='<div class="error">Source audit failed: code step exceeds '+MAX_LINES+' lines.</div>';return}
if(mode==='view'){
 target.innerHTML='<div class="singlepane"><div class="panehead">Focused code after selected commit · '+s.codeLineCount+' diff lines across all files</div><div class="codetable">'+codeFiles('after')+'</div></div>';
}else if(tab==='compare'){
 target.innerHTML='<div class="codecolumns"><div class="codepane"><div class="panehead before">Before · parent '+H((s.parentSha||'root').slice(0,8))+'</div><div class="codetable">'+codeFiles('before')+'</div></div><div class="codepane"><div class="panehead after">After · commit '+H(s.sha.slice(0,8))+'</div><div class="codetable">'+codeFiles('after')+'</div></div></div>';
}else if(tab==='diff'){
 target.innerHTML='<div class="singlepane"><div class="panehead">Exact changed lines, additions and deletions · '+s.codeLineCount+' / 100</div><div class="codetable">'+codeFiles('diff')+'</div></div>';
}else displayCompleteSource();
byId('auditline').textContent=s.codeLineCount+' instructional code/diff lines · exact SHA '+s.sha.slice(0,12)+' · '+s.binaryCount+' binary files · original full file archived separately';
}
function render(){if(!data.length)return;index=Math.max(0,Math.min(data.length-1,index));store(STORAGE,JSON.stringify({index,mode}));preserve(()=>{renderHeader();renderTimeline();renderVisual();renderSource()})}
function changeSelection(n){if(!data.length||n<0||n>=data.length)return;index=n;selectedFile='';tab='compare';render()}
byId('prevStep').onclick=()=>changeSelection(index-1);byId('nextStep').onclick=()=>changeSelection(index+1);
byId('viewMode').onclick=()=>{mode='view';render()};byId('githubMode').onclick=()=>{mode='github';tab='compare';render()};
byId('compareTab').onclick=()=>preserve(()=>{tab='compare';renderSource()});byId('diffTab').onclick=()=>preserve(()=>{tab='diff';renderSource()});byId('fullTab').onclick=()=>preserve(()=>{tab='source';renderSource()});
byId('fileSelect').onchange=e=>preserve(()=>{selectedFile=e.target.value;renderSource()});
byId('timeline').onclick=e=>{const step=e.target.closest('[data-step]');if(step){const i=data.findIndex(s=>s.id===step.dataset.step);if(i>=0)changeSelection(i);return}const c=e.target.closest('[data-commit]');if(c){const i=data.findIndex(s=>s.commitPosition===Number(c.dataset.commit));if(i>=0)changeSelection(i)}};
for(const side of ['backend','frontend']){
 byId(side+'Links').addEventListener('click',e=>{const btn=e.target.closest('[data-source-ref]');if(btn)previewTarget(+btn.dataset.sourceRef)});
 byId(side+'Peek').addEventListener('click',e=>{if(e.target.closest('[data-close-peek]'))preserve(()=>{byId(side+'Peek').hidden=true;activePeek[side]=null})});
}
byId('backendGraphic').addEventListener('click',e=>{const hit=e.target.closest('[data-target]');if(hit)previewTarget(+hit.dataset.target)});
byId('backendGraphic').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-target]')){e.preventDefault();previewTarget(+e.target.closest('[data-target]').dataset.target)}});
window.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||e.altKey||e.metaKey||e.ctrlKey||e.target.closest('input,textarea,select,[contenteditable=true]'))return;e.preventDefault();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){changeSelection(index+(e.key==='ArrowRight'?1:-1));return}const target=current()?.commitPosition+(e.key==='ArrowDown'?1:-1);const i=data.findIndex(x=>x.commitPosition===target);if(i>=0)changeSelection(i)});
Promise.all([fetch('./steps.json').then(r=>r.ok?r.json():Promise.reject(Error('steps.json HTTP '+r.status))),fetch('./commits.json').then(r=>r.ok?r.json():Promise.reject(Error('commits.json HTTP '+r.status)))]).then(([steps,history])=>{
 data=steps.steps;commits=history.commits;
 if(!data.length||commits.length!==10||data.some(s=>s.codeLineCount>MAX_LINES))throw Error('Invalid source manifest or 100-line invariant');
 render();
 const saved=+read(VERT)||0;if(saved>0&&saved<1000000){pageFloor=Math.max(pageFloor,saved+window.innerHeight+60);byId('app').style.minHeight=pageFloor+'px';requestAnimationFrame(()=>window.scrollTo({top:saved,behavior:'instant'}))}
 restoreDone=true;
}).catch(e=>{byId('summary').innerHTML='<div class="error">Unable to open Batch 001: '+H(e.message)+'</div>';byId('backendGraphic').innerHTML='<div class="error">Project data unavailable</div>'});
})();
