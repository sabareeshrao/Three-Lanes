(()=>{
'use strict';
const ROOT='https://api.github.com/repos/';
const DEFAULT_REPO='spring-projects/spring-petclinic';
const DEMO=window.PETCLINIC_DEMO||[];
const byId=id=>document.getElementById(id);
const H=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const storage={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};

// Keep the user's exact vertical reading level through commit, mode, and async source changes.
const VERTICAL_SCROLL_KEY='three-lanes-scroll-y-v1';
let reservedPageHeight=0,verticalLockDepth=0,lockedScrollY=0,lockedScrollX=0,verticalFrame=0;
function reserveReadingHeight(y=window.scrollY){
  const app=document.querySelector('.app');
  if(!app)return;
  const top=app.getBoundingClientRect().top+window.scrollY;
  const available=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
  reservedPageHeight=Math.max(reservedPageHeight,app.offsetHeight,available-top,y+window.innerHeight-top+32);
  app.style.minHeight=Math.ceil(reservedPageHeight)+'px';
}
function keepReadingLevel(update){
  if(verticalLockDepth===0){
    lockedScrollY=window.scrollY;
    lockedScrollX=window.scrollX;
    reserveReadingHeight(lockedScrollY);
  }
  verticalLockDepth++;
  try{return update();}
  finally{
    if(--verticalLockDepth===0){
      const y=lockedScrollY,x=lockedScrollX,frame=++verticalFrame;
      window.scrollTo({top:y,left:x,behavior:'instant'});
      requestAnimationFrame(()=>{
        if(frame===verticalFrame&&Math.abs(window.scrollY-y)>1)
          window.scrollTo({top:y,left:x,behavior:'instant'});
      });
    }
  }
}
let initialVerticalRestoreDone=false;
window.addEventListener('scroll',()=>{
  if(initialVerticalRestoreDone&&verticalLockDepth===0)
    storage.set(VERTICAL_SCROLL_KEY,String(Math.round(window.scrollY)));
},{passive:true});
function restoreSavedReadingLevel(){
  const saved=Number(storage.get(VERTICAL_SCROLL_KEY));
  if(Number.isFinite(saved)&&saved>0&&saved<1000000){
    reserveReadingHeight(saved);
    window.scrollTo({top:saved,left:0,behavior:'instant'});
    requestAnimationFrame(()=>window.scrollTo({top:saved,left:0,behavior:'instant'}));
  }
  initialVerticalRestoreDone=true;
}

// SHA-pinned historical source is the only viewer mode in the simplified prototype.
let mode='live',commits=DEMO.map(c=>({...c,needsFetch:true})),selection={ci:0,si:0},repo=DEFAULT_REPO,page=1, mobileView='auto';
// The ten curated lesson IDs (including .1/.2 steps) are stable across both modes.
// Live GitHub changes the source shown in those lessons, not the lesson index.
const liveCache=new Map();
// Cache complete GitHub commit metadata and full source files by immutable SHA.
const exactCommitCache=new Map();
const originalFileCache=new Map();
let codeMode={backend:'compare',frontend:'compare'};
let chosenFile={backend:null,frontend:null};
let selectedSharedFile=null,inspectorOpen=true;
let exactFetchSeq=0;

let modeEpoch=0;
let previewMode='after'; let uiTab='visit',message='',userData={name:'Bella',type:'Dog',birth:'2022-07-15',visits:[],owner:'George Franklin',city:'Madison',address:'123 Lake Street'};
try{const old=JSON.parse(storage.get('petlab-project')||'null');if(old&&typeof old==='object')userData={...userData,...old}}catch{}
try{const last=JSON.parse(storage.get('petlab-selection-focused-v3')||'null');if(last&&Number.isInteger(last.ci)&&Number.isInteger(last.si))selection=last}catch{}
// Remember the selected step, but ignore the legacy View/GitHub toggle setting.
let totalFetched=0;
function current(){const c=commits[selection.ci]||commits[0];const s=c?.steps?.[selection.si]||c?.steps?.[0];return {c,s};}
function namePath(p){return String(p||'unknown').split('/').pop()}
function shortSha(s){return (s||'').slice(0,8)}
function daysFromNow(n){let d=new Date();d.setDate(d.getDate()+n);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function commitNumber(ci=selection.ci){return ci+1}
function stepIndex(){return `${commitNumber()}.${selection.si+1}`}
function flags(){const n=selection.ci+1,at=selection.si+1;return {bootstrap:n>=1,templating:n>=2,birth:n>=3,petEdit:n>=4,visitLabel:n>=5,visitDate:n>6||(n===6&&at>=3),unique:n>=7,searchTrim:n>=8,length:n>=9,ownerLength:n>=10}}
function persist(){storage.set('petlab-selection-focused-v3',JSON.stringify(selection));storage.set('petlab-project',JSON.stringify(userData));storage.set('petlab-mode-chatgpt-v1',mode)}
function tokenType(t,lang){if(t.startsWith('//')||t.startsWith('/*')||t.startsWith('<!--'))return 'comment';if(t[0]==='"'||t[0]==="'")return 'string';if(t.startsWith('@'))return 'attr';if(/^\d/.test(t))return 'num';if(/^<\/?[a-zA-Z]/.test(t))return 'tag';if(/^(class|public|private|static|final|void|new|return|if|else|try|catch|import|this|int|boolean|for|while|throws|extends|true|false|null|CREATE|TABLE|ALTER|ADD|CONSTRAINT|UNIQUE|INDEX|ON|NOT|NULL|VARCHAR|INTEGER|PRIMARY|KEY|FOREIGN|SELECT|FROM|WHERE|REFERENCES|DEFAULT|IDENTITY|void)$/.test(t))return 'kw';if(/^[A-Z][\w]*$/.test(t))return 'type';return 'attr'}
function syntaxLine(src,lang){const pat=/(<!--[^\n]*?-->|\/\/[^\n]*|\/\*[^\n]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[\w]+|<\/?[A-Za-z][\w:-]*|\b(?:class|public|private|static|final|void|new|return|if|else|try|catch|import|this|int|boolean|for|while|throws|extends|true|false|null|CREATE|TABLE|ALTER|ADD|CONSTRAINT|UNIQUE|INDEX|ON|NOT|NULL|VARCHAR|INTEGER|PRIMARY|KEY|FOREIGN|SELECT|FROM|WHERE|REFERENCES|DEFAULT|IDENTITY)\b|\b\d+\b)/g;let out='',last=0;for(const m of src.matchAll(pat)){out+=H(src.slice(last,m.index));out+=`<span class="syn-${tokenType(m[0],lang)}">${H(m[0])}</span>`;last=m.index+m[0].length}return out+H(src.slice(last))}
function editor(code,lang){const lines=String(code||'// No patch text supplied by GitHub for this file').replaceAll('\t','  ').split('\n');return lines.map((l,i)=>`<div class="editorline ${l.startsWith('+')?'plus':l.startsWith('-')?'minus':''}"><span class="ln">${i+1}</span><span>${syntaxLine(l,lang)}</span></div>`).join('')}
// The source editor deliberately never renders the lesson's shortened `code` sample.
// Only the complete file patch returned by GitHub (or an explicit load/error state)
// may appear as commit code. Original Source is the full immutable file at the SHA.
function langForFile(path){return language(path)}
function changedFileKind(f,curated){
  const exact=curated?.steps?.find(s=>s.file===f.filename);
  return exact?.kind||guess(f.filename);
}
function fileUrl(commit,file,line=null,previous=false){
  const ref=previous?(commit.parents?.[0]?.sha||commit.sha):commit.sha;
  const path=(previous&&file.previous_filename)||file.filename;
  return `https://github.com/${DEFAULT_REPO}/blob/${encodeURIComponent(ref)}/${path.split('/').map(encodeURIComponent).join('/')}${line?'#L'+line:''}`;
}
function lineLink(commit,file,line,side){
  if(!Number.isInteger(line))return '·';
  return `<a href="${H(fileUrl(commit,file,line,side==='old'))}" target="_blank" rel="noopener noreferrer" aria-label="Open line ${line} on GitHub">${line}</a>`;
}
function parseFullPatch(patch){
  let oldLine=null,newLine=null,adds=new Set(),deletes=new Set(),rows=[],hasHunk=false;
  for(const raw of String(patch||'').replace(/\r\n/g,'\n').split('\n')){
    const m=raw.match(/^@@ -([0-9]+)(?:,([0-9]+))? \+([0-9]+)(?:,([0-9]+))? @@(.*)$/);
    if(m){oldLine=+m[1];newLine=+m[3];hasHunk=true;rows.push({type:'hunk',text:raw});continue}
    if(!hasHunk){if(raw)rows.push({type:'meta',text:raw});continue}
    if(raw.startsWith('\\ No newline')){rows.push({type:'meta',text:raw});continue}
    const symbol=raw[0]||' ',content=raw.slice(1);
    if(symbol==='+'){rows.push({type:'added',newNo:newLine,text:content});adds.add(newLine);newLine++}
    else if(symbol==='-'){rows.push({type:'removed',oldNo:oldLine,text:content});deletes.add(oldLine);oldLine++}
    else if(symbol===' '){rows.push({type:'context',oldNo:oldLine,newNo:newLine,text:content});oldLine++;newLine++}
    else {rows.push({type:'meta',text:raw})}
  }
  return {rows,adds,deletes};
}
function completeDiffHtml(commit,file){
  if(!Object.hasOwn(file,'patch')||typeof file.patch!=='string'){
    return `<div class="source-state">GitHub returned no text patch for this file. Use <b>Original source</b> to inspect the complete file.</div>`;
  }
  const parsed=parseFullPatch(file.patch);
  const haveAdds=parsed.rows.filter(r=>r.type==='added').length;
  const haveRemoves=parsed.rows.filter(r=>r.type==='removed').length;
  const maybeTruncated=Number.isInteger(file.additions)&&Number.isInteger(file.deletions)&&
    (haveAdds<file.additions||haveRemoves<file.deletions);
  const warning=maybeTruncated?`<div class="source-incomplete">GitHub’s commit API supplied an incomplete patch (${haveAdds}/${file.additions} added, ${haveRemoves}/${file.deletions} removed lines). Original source displays the full file; the GitHub commit link shows the complete change.</div>`:'';
  if(!parsed.rows.length)return `<div class="source-state">GitHub returned an empty patch for this file.</div>`;
  const lang=langForFile(file.filename);
  return warning+parsed.rows.map(row=>{
    if(row.type==='hunk')return `<div class="source-hunk">${H(row.text)}</div>`;
    if(row.type==='meta')return `<div class="source-meta">${H(row.text)}</div>`;
    const mark=row.type==='added'?'+':row.type==='removed'?'-':' ';
    return `<div class="source-row ${row.type}"><span class="sourceno">${lineLink(commit,file,row.oldNo,'old')}</span><span class="sourceno">${lineLink(commit,file,row.newNo,'new')}</span><span class="source-mark">${mark}</span><span class="source-text">${syntaxLine(row.text,lang)}</span></div>`;
  }).join('');
}
function wholeSourceHtml(commit,file,text,oldVersion=false){
  const lines=text.replace(/\r\n/g,'\n').split('\n');
  if(lines.at(-1)==='')lines.pop();
  const parsed=parseFullPatch(file.patch||'');
  const affected=oldVersion?parsed.deletes:parsed.adds;
  const lang=langForFile(file.filename);
  return lines.map((line,i)=>{
    const n=i+1,marked=affected.has(n);
    const link=fileUrl(commit,file,n,oldVersion);
    return `<div class="source-row original ${marked?'changed':''}" id="code-${H(oldVersion?'old':'new')}-${H(file.filename).replace(/[^a-zA-Z0-9_-]/g,'-')}-${n}"><span class="sourceno"><a href="${H(link)}" target="_blank" rel="noopener noreferrer" aria-label="Open line ${n} on GitHub">${n}</a></span><span class="source-mark">${marked?'+':' '}</span><span class="source-text">${syntaxLine(line,lang)}</span></div>`;
  }).join('');
}
function guidedCodeHtml(commit,file){
  if(typeof file.patch!=='string')return '<div class="source-state">No text patch supplied for this file. Open the original source to inspect it.</div>';
  const parsed=parseFullPatch(file.patch),lang=langForFile(file.filename);
  if(!parsed.rows.length)return '<div class="source-state">No text change returned for this file.</div>';
  let hunk=0,printed=0;
  const html=parsed.rows.map(row=>{
    if(row.type==='hunk'){
      // A subtle separator indicates omitted intervening lines; the View editor is a
      // focused presentation of all changed HUNKS, not a fake full file.
      return hunk++?'<div class="guided-hunk">···</div>':'';
    }
    if(row.type==='removed'||row.type==='meta')return '';
    printed++;
    const line=row.newNo;
    return `<div class="guided-row ${row.type==='added'?'new-line':''}"><span class="guided-ln"><a href="${H(fileUrl(commit,file,line))}" target="_blank" rel="noopener noreferrer">${line||''}</a></span><span class="guided-text">${syntaxLine(row.text,lang)}</span></div>`;
  }).join('');
  return printed?html:'<div class="source-state">This change removes code. Use GitHub to see the removed lines.</div>';
}
function guidedFallbackCode(s,kind){
  const body=String(s.code||'').replaceAll('\t','  ');
  return '<div class="guided-uncached">Loading exact source from GitHub · offline preview shown</div>'+body.split('\n').map(line=>`<div class="guided-row"><span class="guided-ln">·</span><span class="guided-text">${syntaxLine(line,s.lang||kind)}</span></div>`).join('');
}
function renderGuidedSource(side){
  const {c,s}=current(),region=byId(side+'SourceRegion'),code=byId(side+'Code');
  region.classList.remove('compare-active');
  const active=s.kind===side||s.kind==='both';
  region.style.display=active?'':'none';if(!active)return;
  const actions=byId(side+'SourceActions');actions.style.display='none';
  const filebar=byId(side+'File'),stat=byId(side+'CodeStats');
  filebar.parentElement.style.display='';code.style.display='';
  const name=s.file||'unknown';
  filebar.innerHTML=`<b>${H(namePath(name))}</b><span>${H(name)}</span>`;
  const entry=exactCommitCache.get(c.sha);
  const raw=entry?.raw;
  // Each lesson focuses on one source file. Never accidentally show all source
  // files as if they belonged to the current substep.
  const target=raw?.files?.find(f=>f.filename===name);
  if(target){
    code.innerHTML=guidedCodeHtml(raw,target);
    const parsed=parseFullPatch(target.patch||'');
    stat.textContent='Actual GitHub source · '+shortSha(raw.sha);
  }else{
    code.innerHTML=guidedFallbackCode(s,s.lang);
    stat.textContent=entry?.error?'GitHub source unavailable':'Loading verified line numbers…';
  }
}
function compareRows(commit,file,which){
  if(typeof file.patch!=='string')return '<div class="source-state">GitHub supplied no text patch for this file.</div>';
  const lang=langForFile(file.filename),rows=parseFullPatch(file.patch).rows;
  return rows.map(row=>{
    if(row.type==='hunk')return `<div class="compare-hunk">${H(row.text)}</div>`;
    if(row.type==='meta')return '';
    if(which==='old'&&row.type==='added')return '';
    if(which==='new'&&row.type==='removed')return '';
    const n=which==='old'?row.oldNo:row.newNo;
    return `<div class="compare-row ${row.type}"><a class="compare-ln" target="_blank" rel="noopener noreferrer" href="${H(fileUrl(commit,file,n,which==='old'))}">${n||''}</a><span class="compare-text">${syntaxLine(row.text,lang)}</span></div>`;
  }).join('');
}
function showComparison(side,commit,file){
  const holder=byId('wideCompare');holder.hidden=false;
  byId('compareColumns').hidden=false;byId('compareDiff').hidden=true;
  byId('compareTitle').textContent=`${namePath(file.filename)} · before / after`;
  byId('comparePath').textContent=file.filename;
  byId('compareBefore').innerHTML=compareRows(commit,file,'old');
  byId('compareAfter').innerHTML=compareRows(commit,file,'new');
  holder.dataset.side=side;
}
function showSharedDiff(side,commit,file){
  const holder=byId('wideCompare');holder.hidden=false;
  byId('compareColumns').hidden=true;byId('compareDiff').hidden=false;
  byId('compareTitle').textContent=`${namePath(file.filename)} · commit changes`;
  byId('comparePath').textContent=file.filename;
  byId('compareDiff').innerHTML=completeDiffHtml(commit,file);
  holder.dataset.side=side;
}
function showSharedSourceState(message,error=false){
  const holder=byId('wideCompare');holder.hidden=!inspectorOpen;
  byId('compareColumns').hidden=true;byId('compareDiff').hidden=false;
  byId('compareTitle').textContent='Verified GitHub source';
  byId('comparePath').textContent=current().s.file||'';
  byId('compareDiff').innerHTML='<div class="source-state '+(error?'source-error':'')+'">'+H(message)+'</div>';
  holder.dataset.side=current().s.kind==='frontend'?'frontend':'backend';
}
function hideComparison(){return keepReadingLevel(()=>{byId('wideCompare').hidden=true;delete byId('wideCompare').dataset.side})}
function renderSourcePanel(side){return keepReadingLevel(()=>renderSourcePanelCore(side))}
function renderSourcePanelCore(side){
  // The one shared footer serves the selected step, irrespective of which lane it belongs to.
  const {c,s}=current(),activeSide=s.kind==='frontend'?'frontend':'backend';
  if(side!==activeSide)return;
  const entry=exactCommitCache.get(c.sha),raw=entry?.raw;
  const files=raw?.files||[],wanted=selectedSharedFile||s.file;
  const target=files.find(f=>f.filename===wanted||f.previous_filename===wanted)
    ||files.find(f=>f.filename===s.file)||files[0]||null;
  const picker=byId('sharedFileSelect');
  picker.innerHTML=files.length?files.map(f=>'<option value="'+H(f.filename)+'"'+(target&&f.filename===target.filename?' selected':'')+'>'+H(f.filename)+(f.status==='removed'?' (deleted)':'')+'</option>').join('')
    :'<option value="">'+(entry?.error?'Source unavailable':'Loading changed files…')+'</option>';
  picker.disabled=!target;
  byId('sharedFileLink').href=target?fileUrl(raw,target,null,target.status==='removed')
    :'https://github.com/'+DEFAULT_REPO+'/commit/'+encodeURIComponent(c.sha);
  byId('sharedFileLink').textContent=target?'Open file ↗':'GitHub commit ↗';
  syncOriginalSourceLink();
  for(const view of ['compare','diff']){
    const button=byId(view==='compare'?'sharedViewTab':'sharedDiffTab');
    const selected=codeMode[activeSide]===view;
    button.classList.toggle('chosen',selected);
    button.setAttribute('aria-pressed',String(selected));
  }
  if(!inspectorOpen){byId('wideCompare').hidden=true;return;}
  if(!raw){showSharedSourceState(entry?.error?'GitHub source unavailable: '+entry.error:'Loading verified GitHub commit source…',!!entry?.error);return;}
  if(!target){showSharedSourceState('GitHub returned no changed source files for this historical commit.',true);return;}
  if(codeMode[activeSide]==='diff')showSharedDiff(activeSide,raw,target);
  else showComparison(activeSide,raw,target);
}
async function fetchOriginal(ref,path,force=false){
  const key=ref+'|'+path;
  if(!force&&originalFileCache.has(key))return originalFileCache.get(key);
  const pending=(async()=>{
    try{
      const url=`https://raw.githubusercontent.com/${DEFAULT_REPO}/${encodeURIComponent(ref)}/${path.split('/').map(encodeURIComponent).join('/')}`;
      const response=await fetch(url,{headers:{Accept:'text/plain'}});
      if(!response.ok)throw Error(`GitHub HTTP ${response.status}`);
      return {content:await response.text()};
    }catch(error){return {error:String(error.message||error)}}
  })();
  originalFileCache.set(key,{pending:true});
  const result=await pending;
  originalFileCache.set(key,result);
  return result;
}
async function ensureExactCommit(ci,force=false){
  const item=DEMO[ci];if(!item)return;
  let entry=exactCommitCache.get(item.sha);
  if(entry&&!force)return entry.promise||entry;
  ++exactFetchSeq;
  const promise=api('commits/'+encodeURIComponent(item.sha)).then(raw=>{
    if(raw.sha!==item.sha)throw Error('Commit SHA mismatch');
    const value={raw};exactCommitCache.set(item.sha,value);
    if(current().c.sha===item.sha){const side=current().s.kind==='frontend'?'frontend':'backend';renderSourcePanel(side==='frontend'?'backend':'frontend');renderSourcePanel(side)}
    return value;
  }).catch(error=>{
    const value={error:String(error.message||error)};exactCommitCache.set(item.sha,value);
    if(current().c.sha===item.sha){const side=current().s.kind==='frontend'?'frontend':'backend';renderSourcePanel(side==='frontend'?'backend':'frontend');renderSourcePanel(side)}
    return value;
  });
  exactCommitCache.set(item.sha,{promise});
  return promise;
}
function renderSourceForSelection(){
  // Focus the expanded comparison on the lane belonging to this learning step.
  const side=current().s.kind==='frontend'?'frontend':'backend';
  renderSourcePanel(side==='frontend'?'backend':'frontend');
  renderSourcePanel(side);
  ensureExactCommit(selection.ci);
}
function typeLabel(t){return t==='frontend'?'FRONTEND':t==='both'?'FULL STACK':'BACKEND'}
// The top Original source action opens the source file on GitHub, never an inline tab.
// Deleted files use their existing revision at the selected commit's parent SHA.
function originalSourceUrl(){
  const {c,s}=current();
  const side=s.kind==='frontend'?'frontend':'backend';
  const raw=exactCommitCache.get(c.sha)?.raw;
  const wanted=selectedSharedFile||s.file;
  const file=raw?.files?.find(f=>f.filename===wanted||f.previous_filename===wanted);
  const deleted=file?.status==='removed';
  const revision=deleted?(raw.parents?.[0]?.sha||c.sha):c.sha;
  const path=deleted?(file.previous_filename||file.filename):(file?.filename||wanted);
  if(!/^[a-f0-9]{40}$/i.test(revision)||typeof path!=='string'||!path)
    return 'https://github.com/'+DEFAULT_REPO+'/commit/'+encodeURIComponent(c.sha);
  return 'https://github.com/'+DEFAULT_REPO+'/blob/'+encodeURIComponent(revision)+'/'+path.split('/').map(encodeURIComponent).join('/');
}
function syncOriginalSourceLink(){
 const link=byId('openOriginalSource');
 if(link)link.href=originalSourceUrl();
}
function head(){
 const {c,s}=current();if(!c)return;
 const kind=s.kind||c.kind;
 byId('summary').innerHTML=`<div class="summary-main"><span class="chip summary-kind ${H(kind)}">${H(typeLabel(kind))}</span><h2>${H(c.name)}</h2><p><b>${H(s.name)}.</b> ${H(s.explain)}</p></div><div class="rightsummary"><a class="source original-launch" id="openOriginalSource" href="${H(originalSourceUrl())}" target="_blank" rel="noopener noreferrer">Original source ↗</a><a class="source" href="https://github.com/${H(repo)}/commit/${encodeURIComponent(c.sha)}" target="_blank" rel="noopener noreferrer">GitHub commit ↗</a></div>`;
 updateStepper();
}

function timeline(){
  const rail=byId('railItems');
  rail.innerHTML=commits.map((commit,i)=>{
    const selected=i===selection.ci,n=String(commitNumber(i));
    const chip='<button type="button" class="commitBtn '+H(commit.kind)+' '+(selected?'selected':'')+'" data-c="'+i+'" data-s="0" aria-current="'+(selected?'true':'false')+'" aria-label="Commit '+H(n)+(selected?' current':'')+'"><span class="no">'+H(n)+'</span><span class="mini">'+H(shortSha(commit.sha).slice(0,5))+'</span></button>';
    const steps=selected?'<div class="substeps">'+commit.steps.map((step,j)=>'<button type="button" class="subbtn '+(j===selection.si?'selected':'')+'" data-c="'+i+'" data-s="'+j+'" aria-current="'+(j===selection.si?'step':'false')+'" aria-label="Step '+H(n)+'.'+(j+1)+(j===selection.si?' current':'')+'">'+H(n)+'.'+(j+1)+'</button>').join('')+'</div>':'<div class="rail-gap" aria-hidden="true"></div>';
    return '<div class="railitem '+H(commit.kind)+'">'+chip+steps+'</div>';
  }).join('');
  // Scroll the rail only when the current substep is outside its visible area.
  const picked=rail.querySelector('.subbtn.selected')||rail.querySelector('.commitBtn.selected');
  if(picked){
    const pos=picked.getBoundingClientRect().top-rail.getBoundingClientRect().top+rail.scrollTop,bottom=pos+picked.offsetHeight;
    if(pos<rail.scrollTop)rail.scrollTop=Math.max(0,pos-12);
    else if(bottom>rail.scrollTop+rail.clientHeight)rail.scrollTop=bottom-rail.clientHeight+12;
  }
}
function backendDiagram(s){if(s.kind==='frontend')return window.PETCLINIC_DIAGRAMS.quiet();if(mode==='demo'||s.curatedStep)return window.PETCLINIC_DIAGRAMS.draw(selection.ci+1,selection.si+1,s);const k=({petBirthdate:3,petEdit:4,visitDate:6,petNameUnique:7,ownerSearch:8,petAssociation:9,ownerLength:10,petNameLength:9})[s.feature];return window.PETCLINIC_DIAGRAMS.draw(k||0,k===7&&s.lang==='sql'?3:selection.si+1,s)}

function setFocus(kind){const b=byId('backendLane'),f=byId('frontendLane'),w=document.querySelector('.workspace');w.classList.toggle('has-visible-impact',mode==='live'&&current().s.visualImpact);b.classList.toggle('focused',kind!=='frontend');f.classList.toggle('focused',kind!=='backend');b.classList.toggle('idle',kind==='frontend');f.classList.toggle('idle',kind==='backend');w.classList.toggle('focus-frontend',kind==='frontend');w.classList.toggle('focus-backend',kind==='backend');w.classList.toggle('focus-both',kind==='both');if(mobileView==='auto')mobileView=kind==='both'?'both':kind==='frontend'?'frontend':'backend';displayMobile();}

function displayMobile(){return keepReadingLevel(displayMobileCore)}
function displayMobileCore(){const isMobile=matchMedia('(max-width:820px)').matches;document.querySelector('.workspace').classList.toggle('mobile-both',isMobile&&mobileView==='both');byId('backendLane').classList.toggle('mobilehide',isMobile&&mobileView==='frontend');byId('frontendLane').classList.toggle('mobilehide',isMobile&&mobileView==='backend');for(const b of document.querySelectorAll('[data-mview]'))b.classList.toggle('active',b.dataset.mview===mobileView)}
function renderBackend(){const {s}=current(),quiet=s.kind==='frontend';byId('backendInfo').textContent=quiet?'NO BACKEND CHANGE':'CHANGED IN THIS STEP';byId('backendName').textContent=quiet?'No server source modified':s.name;byId('backendGraphic').innerHTML=backendDiagram(s);
window.THREE_LANES_VISUAL_LIBRARY?.mount('backend',current().c.sha,stepIndex(),byId('backendGraphic'));
// SVGs are static drawings, not interactive source-link targets.
byId('backendInfoLine').textContent='';
byId('backendCode').style.display='';byId('backendFile').parentElement.style.display='';byId('backendFile').parentElement.previousElementSibling.style.display='';if(!quiet){byId('backendFile').textContent=s.file;}
}

function frontendTab(scene){if(scene==='owners')return 'owners';if(scene==='ownerDetail')return 'owner';if(scene==='search')return 'search';if(scene==='pet')return 'pet';if(scene==='visit')return 'visit';return 'owners'}
function makePreview(){const {c,s}=current();return window.PETCLINIC_PREVIEWS.preview({mode:'demo',ci:selection.ci,si:selection.si,c,s,message,userData,daysFromNow,previewMode});}

function renderFrontend(){const {s}=current(),quiet=s.kind==='backend',effect=mode==='live'&&s.visualImpact;
byId('frontendInfo').textContent=quiet?(mode==='live'?'NO FRONTEND FILE':effect?'USER-VISIBLE EFFECT':'NO FRONTEND SOURCE'):'FRONTEND SOURCE CHANGED';
byId('frontendName').textContent=quiet?(mode==='live'?'No frontend file changed':effect?'Impact of '+s.name:'No view file changed in this step'):s.name;
byId('frontendGraphic').innerHTML=makePreview();
window.THREE_LANES_VISUAL_LIBRARY?.mount('frontend',current().c.sha,stepIndex(),byId('frontendGraphic'));
// No SVG-to-code focus; actual frontend form controls remain interactive.
byId('frontendFile').parentElement.style.display='';byId('frontendCode').style.display='';byId('frontendFile').parentElement.previousElementSibling.style.display='';
if(!quiet){byId('frontendFile').textContent=s.file;}
}

function render(){return keepReadingLevel(renderCore)}
function renderCore(){if(!commits.length)return;document.body.classList.toggle('github-source-mode',mode==='live');document.querySelector('.workspace').classList.toggle('github-source-mode',mode==='live');selection.ci=Math.min(Math.max(selection.ci,0),commits.length-1);selection.si=Math.min(Math.max(selection.si,0),commits[selection.ci].steps.length-1);const {c,s}=current();if(selection.ci!==render.prevci||selection.si!==render.prevsi){previewMode='after';message='';chosenFile={backend:null,frontend:null};selectedSharedFile=null}render.prevci=selection.ci;render.prevsi=selection.si;head();timeline();renderBackend();renderFrontend();renderSourceForSelection();setFocus(mode==='live'?c.kind:(s.kind||c.kind));byId('status').innerHTML=`${mode==='demo'?'10 hand-picked real commits · '+DEMO.reduce((a,c)=>a+c.steps.length,0)+' focused learning steps':'Exactly 10 selected commits · refreshed from GitHub'} · <span class="statusok">Selected ${H(stepIndex())}</span>`;persist()}
function select(ci,si){if(ci<0||ci>=10||ci>=commits.length)return;if(mode==='live'&&commits[ci]?.needsFetch){selectLive(ci,si);return}selection={ci,si};mobileView='auto';render()}
byId('railItems').addEventListener('click',e=>{let b=e.target.closest('button[data-c]');if(!b)return;select(+b.dataset.c,+b.dataset.s)});
byId('mobileTabs').addEventListener('click',e=>{const b=e.target.closest('[data-mview]');if(!b)return;mobileView=b.dataset.mview;displayMobile()});
byId('frontendGraphic').addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;if(b.dataset.act==='tab'){uiTab=b.dataset.tab;message=''}if(b.dataset.act==='today'){const input=byId('visitForm')?.elements.date;if(input)input.value=daysFromNow(0);message='Selected today. Submit to test validation.'}if(b.dataset.act==='test-pet'){const input=byId('petForm')?.elements.petName;if(input)input.value='A'.repeat(31);message='Name set to 31 characters. Submit to test.'}renderFrontend()});
byId('frontendGraphic').addEventListener('submit',e=>{e.preventDefault();const form=e.target, f=flags();if(form.id==='petForm'){const name=form.elements.petName.value.trim(),birth=form.elements.birth.value,type=form.elements.type.value;if(f.birth&&birth>daysFromNow(0)){message='✕ Birth date cannot be in the future.'}else if(f.length&&name.length>30){message='✕ Pet name must be no more than 30 characters.'}else if(f.unique&&['Buddy','Max'].some(x=>x.toLowerCase()===name.toLowerCase())){message='✕ A pet with that name already exists for this sample owner.'}else{userData={...userData,name,birth,type};message='✓ Pet changes saved in this browser simulation.'}}else if(form.id==='visitForm'){let date=form.elements.date.value;if(f.visitDate&&date<=daysFromNow(0)){message='✕ Visit date must be in the future.'}else{userData.visits=[...userData.visits,{date,description:form.elements.description.value}];message='✓ Visit added to this browser simulation.'}}else if(form.id==='searchForm'){let q=form.elements.lastName.value;if(f.searchTrim)q=q.trim();message=q.trim().toLowerCase()==='davis'&&(!q.startsWith(' ')&&!q.endsWith(' '))?'✓ Owner Betty Davis found.':'✕ No matching owners in this sample result.'}else if(form.id==='ownerForm'){let city=form.elements.city.value,address=form.elements.address.value;if(f.ownerLength&&(city.length>80||address.length>255)){message='✕ City must be ≤80 characters and address ≤255.'}else{userData.city=city;userData.address=address;message='✓ Owner information saved in this browser simulation.'}}persist();renderFrontend()});
byId('searchFormMain').addEventListener('submit',e=>{e.preventDefault();const q=byId('search').value.trim();if(!q){byId('status').textContent='Search these 10 commits by number, substep, SHA, or topic.';return}let match=q.match(/^#?(\d+)(?:\.(\d+))?$/);if(match){const n=+match[1],sub=match[2]?+match[2]:1,ci=n-1;if(ci>=0&&ci<DEMO.length&&sub>=1&&sub<=commits[ci].steps.length){select(ci,sub-1);return}byId('status').innerHTML='<span class="error">Only commits 1–10 and their existing substeps are available.</span>';return}const i=commits.findIndex(c=>c.sha.toLowerCase().startsWith(q.toLowerCase())||c.name.toLowerCase().includes(q.toLowerCase())||c.steps.some(s=>s.file.toLowerCase().includes(q.toLowerCase())||s.name.toLowerCase().includes(q.toLowerCase())));if(i>=0){const si=commits[i].steps.findIndex(s=>s.name.toLowerCase().includes(q.toLowerCase())||s.file.toLowerCase().includes(q.toLowerCase()));select(i,Math.max(0,si));return}byId('status').innerHTML=`<span class="error">Not among the 10 selected commits. No other commits will be loaded.</span>`});
async function api(path){const url=ROOT+repo+'/'+path;const r=await fetch(url,{headers:{Accept:'application/vnd.github+json'}});if(!r.ok){let detail='';try{detail=(await r.json()).message||''}catch{}throw Error(`GitHub HTTP ${r.status}. ${detail}`)}return r.json()}
function guess(path){return /(?:^|\/)(?:templates|static|webapp|frontend|assets)\b|\.(?:html|jsp|css|js|tsx|jsx|vue|svelte)$/i.test(path)?'frontend':'backend'}
function language(path){return /\.java$/i.test(path)?'java':/\.sql$/i.test(path)?'sql':/\.css$/i.test(path)?'css':/\.(?:xml|pom)$/i.test(path)?'xml':/\.ya?ml$/i.test(path)?'yaml':/\.md$/i.test(path)?'markdown':'html'}
function sceneFor(path){return /visit/i.test(path)?'visit':/pet/i.test(path)?'pet':/search|find/i.test(path)?'search':/owner/i.test(path)?'ownerDetail':/vet/i.test(path)?'vets':'system'}
function detectImpact(file,patch,commitTitle){
 const p=file.filename||'', t=patch||'', title=commitTitle||'', evidence=t+' '+title, low=evidence.toLowerCase(), front=guess(p)==='frontend', lang=language(p), isTest=/\/test\/|Tests?\.java$|\/test[s]?\//i.test(p);
 let feature='none', visualImpact=false, demoIndex=null;
 if(isTest){feature='test'}
 else if(/unique_owner_pet_name|case.insensitive duplicate pet|duplicate pet name|unique pet names/i.test(evidence)){feature='petNameUnique';demoIndex=[6,0]}
 else if(/minVisitDate|Visit date must be in the future|isAfter\(LocalDate\.now\(\)\)|future visit dates/i.test(evidence) && /visit/i.test(p+' '+title)){feature='visitDate';demoIndex=[5,1]}
 else if(/birthDate.*isAfter|birthdate validation/i.test(evidence)){feature='petBirthdate';demoIndex=[2,0]}
 else if(/updatePetDetails|pet update functionality/i.test(evidence)){feature='petEdit';demoIndex=[3,0]}
 else if(/lastName\.strip\(\)|normalize whitespace in owner search/i.test(evidence)){feature='ownerSearch';demoIndex=[7,0]}
 else if(/MAX_NAME_LENGTH|Name must be no more than 30 characters/i.test(evidence) && /PetValidator|Pet/.test(p)){feature='petNameLength';demoIndex=[8,1]}
 else if(/@Size\(max\s*=\s*(?:255|80)\)|city\/address exceed column length/i.test(evidence)){feature='ownerLength';demoIndex=[9,0]}
 else if(/getPets\(\)\.contains\(pet\)|persisted pet association/i.test(evidence)){feature='petAssociation';demoIndex=[8,0]}
 else if(/#\{addVisit\}|\$\{addVisit\}|button to miss its text/i.test(evidence)){feature='visitButton';demoIndex=[4,0]}
 if(feature!=='none'){visualImpact=true}
 else if(front){
   visualImpact=true;
   feature=/\.css$/i.test(p)?'css':/\.js$/i.test(p)?'script':/welcome/i.test(p)?'welcome':/ownersList|list\.jsp/i.test(p)?'ownersList':/findOwners|search\.jsp/i.test(p)?'ownerSearchUi':/ownerDetails|show\.jsp/i.test(p)?'ownerDetails':/VisitForm|visits?/i.test(p)?'visitForm':/PetForm|pets?/i.test(p)?'petForm':/layout|header/i.test(p)?'navigation':'template';
 } else if(/Tests?\.java$|test\/|tests\//i.test(p)){feature='test'}
 else if(/\.sql$/i.test(p)){feature='database'}
 else if(/pom\.xml|build\.gradle|gradlew|Dockerfile|\.ya?ml|\.md$/i.test(p)){feature='infrastructure'}
 else feature='internal';
 // A text-only commit should not be depicted as creating a new UI. Backend changes
 // with a known UI effect do show the affected control, without inventing frontend source.
 return {feature,visualImpact,demoIndex,lang};
}
function autoCommit(raw,num){
 const sha=raw.sha,files=raw.files||[],commitTitle=raw.commit?.message?.split('\n')[0]||raw.message?.split('\n')[0]||`Commit ${shortSha(sha)}`;let steps=[];
 for(const f of files){const patch=f.patch||'', info=detectImpact(f,patch,commitTitle),kind=guess(f.filename), lines=patch?patch.split('\n'):[];
   const segments=lines.length?Math.ceil(lines.length/32):1;
   for(let part=0;part<segments;part++){
     const batch=lines.slice(part*32,(part+1)*32);
     const noPatch=!batch.length;
     steps.push({name:`${namePath(f.filename)}${segments>1?' · part '+(part+1):''}`,file:f.filename,kind,scene:sceneFor(f.filename),feature:info.feature,visualImpact:info.visualImpact,demoIndex:info.demoIndex,lang:info.lang,fileStatus:f.status||'modified',code:noPatch?'// GitHub did not return a text patch for this file.\n// See exact commit for binary or truncated changes.':batch.join('\n'),explain:noPatch?'No text patch provided by the GitHub API.':`${f.status||'Changed'} source · ${batch.length} displayed diff lines${segments>1?' · section '+(part+1)+'/'+segments:''}. `,illustrative:noPatch});
   }
 }
 if(!steps.length)steps=[{name:'No file patch returned',file:'commit',kind:'backend',feature:'internal',visualImpact:false,code:'// No file diff returned',explain:'Open commit on GitHub to inspect.'}];
 const kinds=new Set(steps.map(s=>s.kind));return {sha,name:commitTitle,date:raw.commit?.author?.date?.slice(0,10)||raw.created_at?.slice(0,10)||'',kind:kinds.size>1?'both':steps[0].kind,detail:`Live GitHub · ${files.length} changed files · ${steps.length} expandable source sections.`,steps};
}
// Scope is intentionally fixed: only the 10 verified commit SHAs in data.js.
// Live mode refreshes those exact commits, never lists repository history.
// Select the actual changed hunk while keeping a stable curated substep number.
// The original lesson is used only as a locator; the dark editor shows API diff text.
function hydrateCuratedCommit(raw,i){
  const base=DEMO[i],rawFiles=raw.files||[];
  const updated=base.steps.map((lesson,j)=>{
    const file=rawFiles.find(f=>f.filename===lesson.file);
    const patch=file?.patch||'';
    const source=patch;
    const info=detectImpact(file||{filename:lesson.file},patch,base.name);
    return {...lesson,curatedStep:true,
      // These are the same teaching substeps, with source refreshed from GitHub.
      code:source||lesson.code,
      feature:info.feature,visualImpact:true,demoIndex:[i,j],
      liveAvailable:!!source,
      explain:lesson.explain};
  });
  return {...base,steps:updated,needsFetch:false,liveFetched:true};
}
// Fetch one of the 10 known SHAs, but never navigate the user as a side effect.
async function selectLive(i,si=0){
  if(i<0||i>=DEMO.length||mode!=='live')return;
  selection={ci:i,si:Math.max(0,Math.min(si,DEMO[i].steps.length-1))};
  const item=commits[i];
  if(!item?.needsFetch){render();return}
  const epoch=modeEpoch;
  render();
  byId('status').textContent=`Refreshing selected commit ${i+1}/10 (${shortSha(DEMO[i].sha)})…`;
  try{
    const exact=await ensureExactCommit(i);
    if(!exact.raw)throw Error(exact.error||'GitHub source unavailable');
    const raw=exact.raw;
    if(raw.sha!==DEMO[i].sha)throw Error('GitHub returned a different SHA.');
    const refreshed=hydrateCuratedCommit(raw,i);
    liveCache.set(DEMO[i].sha,refreshed);
    if(mode!=='live'||epoch!==modeEpoch)return;
    commits[i]=refreshed;
    // If they moved to another commit while the request was pending, leave them there.
    if(selection.ci===i)render();
  }catch(e){
    if(mode!=='live'||epoch!==modeEpoch)return;
    commits[i]={...DEMO[i],needsFetch:false};
    if(selection.ci===i){render();byId('status').innerHTML=`<span class="error">GitHub unavailable (${H(e.message)}). Kept step ${H(stepIndex())}; the source editor reports the load failure.</span>`}
  }
}
byId('closeCompare').addEventListener('click',()=>{inspectorOpen=false;hideComparison();});
byId('sharedSourceDock').addEventListener('click',event=>{
  const button=event.target.closest('[data-shared-code-mode]');if(!button)return;
  const side=current().s.kind==='frontend'?'frontend':'backend',next=button.dataset.sharedCodeMode;
  if(next!=='compare'&&next!=='diff')return;
  codeMode[side]=next;inspectorOpen=true;renderSourcePanel(side);
});
byId('sharedFileSelect').addEventListener('change',event=>{
  selectedSharedFile=event.target.value||null;inspectorOpen=true;
  syncOriginalSourceLink();
  renderSourcePanel(current().s.kind==='frontend'?'frontend':'backend');
});
window.addEventListener('resize',displayMobile);

function updateStepper(){const left=byId('prevStep'),right=byId('nextStep');if(!left||!right)return;const total=commits.reduce((acc,c)=>acc+c.steps.length,0),pos=commits.slice(0,selection.ci).reduce((acc,c)=>acc+c.steps.length,0)+selection.si+1;left.disabled=pos<=1;right.disabled=pos>=total;byId('stepPosition').textContent=`${pos} / ${total}`;}
function navigateStep(dir){let ci=selection.ci,si=selection.si+dir;if(si<0){ci--;if(ci<0)return;si=commits[ci].steps.length-1}else if(si>=commits[ci].steps.length){ci++;if(ci>=commits.length)return;si=0}if(mode==='live'&&commits[ci]?.needsFetch){selectLive(ci,si);return}select(ci,si)}
byId('prevStep')?.addEventListener('click',()=>navigateStep(-1));
byId('nextStep')?.addEventListener('click',()=>navigateStep(1));
// Global keyboard navigation: arrows work unless the user is editing a form control.
window.addEventListener('keydown',event=>{
  if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey)return;
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
  const target=event.target;
  if(target instanceof Element && (target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"], [role="combobox"]') || target.isContentEditable))return;
  event.preventDefault();
  if(event.key==='ArrowLeft')navigateStep(-1);
  else if(event.key==='ArrowRight')navigateStep(1);
  else if(event.key==='ArrowUp')select(Math.max(0,selection.ci-1), Math.min(selection.si,commits[Math.max(0,selection.ci-1)].steps.length-1));
  else select(Math.min(commits.length-1,selection.ci+1), Math.min(selection.si,commits[Math.min(commits.length-1,selection.ci+1)].steps.length-1));
});
byId('frontendGraphic').addEventListener('click',e=>{const b=e.target.closest('[data-micro]');if(!b)return;const a=b.dataset.micro;if(a==='toggle'){previewMode=b.dataset.value;message=''}else if(a==='page'){message='✓ Page '+b.dataset.label+' · URL '+(previewMode==='after'?'/owners?page=':'/owners/?page=')+b.dataset.label}else if(a==='action'){message='✓ Clicked '+b.dataset.label+''}renderFrontend();});
byId('frontendGraphic').addEventListener('submit',e=>{if(!e.target.id.startsWith('micro'))return;e.preventDefault();e.stopImmediatePropagation();const form=e.target,id=form.id,fields=form.elements,after=previewMode!=='before',today=daysFromNow(0);let m='';if(id==='microBirthForm'){m=fields.birth.value>today&&after?'✕ Invalid birth date: cannot be in the future.':'✓ Date accepted in this illustrated state.'}
if(id==='microEditForm'){userData.name=fields.name.value;userData.type=fields.type.value;m='✓ Updated existing pet '+userData.name+'; no new pet inserted.'}
if(id==='microVisitForm'){m=fields.date.value<=today&&after?'✕ Visit date must be in the future.':'✓ Visit date accepted.'}
if(id==='microDuplicateForm'){m=/^buddy$/i.test(fields.name.value.trim())?'✕ A pet with that name already exists for this owner.':'✓ Name is available in this simulated example.'}
if(id==='microSearchForm'){m=fields.query.value.trim().toLowerCase()==='davis'&&(after||fields.query.value===fields.query.value.trim())?'✓ Betty Davis found (query sent: “'+(after?fields.query.value.trim():fields.query.value)+'”).':'✕ No match with the untrimmed query.'}
if(id==='microLengthForm'){m=fields.name.value.length>30?'✕ Pet name exceeds 30 characters.':'✓ Name length is valid.'}
if(id==='microOwnerForm'){m=fields.city.value.length>80||fields.address.value.length>255?'✕ Invalid input: city max 80, address max 255.':'✓ Values satisfy the column lengths.'}
message=m;persist();renderFrontend();},true);


byId('summary').addEventListener('click',e=>{
  const link=e.target.closest('#openOriginalSource');
  if(link)link.href=originalSourceUrl(); // Let the browser open GitHub in a new tab.
});
for(const side of ['backend','frontend']){
  byId(side+'SourceActions').addEventListener('click',event=>{
    const tab=event.target.closest('[data-code-mode]');
    if(tab){codeMode[side]=tab.dataset.codeMode;renderSourcePanel(side);return;}
  });
  byId(side+'FileSelect').addEventListener('change',event=>{
    chosenFile[side]=event.target.value;syncOriginalSourceLink();renderSourcePanel(side);
  });
  byId(side+'Code').addEventListener('click',event=>{
    if(event.target.closest('[data-exact-retry]'))ensureExactCommit(selection.ci,true);
    if(event.target.closest('[data-file-retry]')){
      const raw=exactCommitCache.get(current().c.sha)?.raw;
      const chosen=byId(side+'FileSelect').value;
      const file=raw?.files?.find(f=>f.filename===chosen);if(!file)return;
      const ref=file.status==='removed'?(raw.parents?.[0]?.sha||raw.sha):raw.sha;
      const path=file.status==='removed'?(file.previous_filename||file.filename):file.filename;
      fetchOriginal(ref,path,true).then(()=>renderSourcePanel(side));
    }
  });
}

render();
// Restore live mode from local storage without changing the selected lesson.
if(mode==='live')selectLive(selection.ci,selection.si);
requestAnimationFrame(restoreSavedReadingLevel);
})();

