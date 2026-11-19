const $=id=>document.getElementById(id);
let commits=[],steps=[],visuals={},index=0,sourceMode='view',side='after',panel='visual';
const nodes={rail:$('conveyor'),editor:$('editor')};
function basename(f){return f.split('/').at(-1)}
function setText(id,text){$(id).textContent=text||''}
function lineNode(type,oldNo,newNo,content){
 const el=document.createElement('div');el.className='line '+type;
 const n1=document.createElement('span');n1.className='num';n1.textContent=oldNo===null?'':String(oldNo??'');
 const n2=document.createElement('span');n2.className='num';n2.textContent=newNo===null?'':String(newNo??'');
 const code=document.createElement('code');code.textContent=content;
 el.append(n1,n2,code);return el;
}
function renderCode(step){
 const editor=nodes.editor;const oldScroll=editor.scrollTop;
 editor.replaceChildren();
 if(sourceMode==='diff'){
  let h=0,lines=step.patchLines;
  for(const row of lines)editor.append(lineNode(row.type,row.oldLine,row.newLine,(row.type==='add'?'+':row.type==='remove'?'-':' ')+row.text));
 }else{
  const raw=side==='before'?step.before:step.after;
  if(!raw){const empty=document.createElement('div');empty.className='none';empty.textContent='This file did not exist before this commit.';editor.append(empty)}
  else{
   const lines=raw.replace(/\n$/,'').split('\n');
   const changed=new Set(step.changedCoordinates.filter(x=>x.type===(side==='before'?'remove':'add')).map(x=>side==='before'?x.oldLine:x.newLine));
   lines.forEach((s,i)=>{const n=i+1;editor.append(lineNode(changed.has(n)?'changed':'normal',side==='before'?n:null,side==='after'?n:null,s))});
  }
 }
 editor.scrollTop=0;editor.scrollLeft=0;
 $('sourceView').classList.toggle('active',sourceMode==='view');
 $('changesView').classList.toggle('active',sourceMode==='diff');
 $('afterView').classList.toggle('active',side==='after');
 $('beforeView').classList.toggle('active',side==='before');
 $('afterView').parentElement.hidden=sourceMode==='diff';
 setText('coverage',step.added+' added · '+step.removed+' removed · '+step.shownCodeLines+' instructional lines');
}
function scrollSelectedButton(){
 const active=nodes.rail.querySelector('.rail-step.active');if(!active)return;
 const outer=nodes.rail.getBoundingClientRect(),inner=active.getBoundingClientRect();
 if(inner.top<outer.top+4)nodes.rail.scrollTop-=outer.top+4-inner.top;
 else if(inner.bottom>outer.bottom-4)nodes.rail.scrollTop+=inner.bottom-(outer.bottom-4);
}
function choose(i){
 index=Math.min(Math.max(0,i),steps.length-1);const s=steps[index],commit=commits.find(c=>c.number===s.commitOrdinal);
 setText('stepTitle',s.title);setText('stepLocation',s.file);
 setText('stepCount',(index+1)+' / '+steps.length);
 setText('diagramTitle',s.title);setText('visualFocus','This step changes only '+s.file);
 setText('mentorText',s.mentor);$('mentor').open=false;
 const asset=visuals[s.sha+':'+s.id]?.backend;
 $('diagram').src=asset||'';$('diagram').alt=s.title+': '+s.file+' (source-specific architecture diagram)';
 setText('visualType',s.file.endsWith('.md')?'DOCUMENTATION':s.file.endsWith('.toml')?'CONFIG':s.file.includes('test')?'TESTS':'BACKEND');
 setText('sourceSha',s.sha.slice(0,8));setText('filename',s.file);
 $('openFile').href=s.sourceUrl;$('openFile').title='Original file at '+s.sha;
 $('commitLink').href=s.commitUrl;$('commitLink').title=commit.title;
 sourceMode='view';side='after';renderCode(s);
 [...nodes.rail.querySelectorAll('.rail-step')].forEach(b=>{const on=b.dataset.step===s.id;b.classList.toggle('active',on);b.setAttribute('aria-current',on?'step':'false')});
 $('prev').disabled=index===0;$('next').disabled=index===steps.length-1;
 $('liveStatus').textContent='Step '+s.id+' '+s.title+', '+s.file;
 const url=new URL(location.href);url.hash='step-'+s.id;history.replaceState(null,'',url);
 scrollSelectedButton();
}
function rail(){
 nodes.rail.replaceChildren();
 for(const commit of commits){
  const group=document.createElement('div');group.className='commit-group';
  const head=document.createElement('div');head.className='commit-head';
  const sha=document.createElement('strong');sha.textContent=commit.sha.slice(0,8);
  const count=document.createElement('span');count.className='counter';count.textContent=commit.steps.length+' file'+(commit.steps.length===1?'':'s');
  head.append(sha,count);group.append(head);
  for(const st of commit.steps){
   const b=document.createElement('button');b.type='button';b.className='rail-step '+(commit.number<3?'fullstack':'backend');
   b.dataset.step=st.id;b.dataset.search=(st.title+' '+st.file+' '+commit.sha+' '+commit.title).toLowerCase();
   const a=document.createElement('span');a.className='step-id';a.textContent=st.id;
   const name=document.createElement('span');name.className='step-file';name.textContent=basename(st.file);
   b.append(a,name);b.title=commit.title+' — '+st.title;b.setAttribute('aria-label','Step '+st.id+', '+st.title+', '+commit.title);
   b.addEventListener('click',()=>choose(steps.findIndex(s=>s.id===st.id)));
   group.append(b);
  }
  nodes.rail.append(group);
 }
}
function setPanel(next){
 panel=next;$('visualLane').classList.toggle('mobile-hidden',next==='source');
 $('sourceLane').classList.toggle('mobile-hidden',next==='visual');
 document.querySelectorAll('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===next));
}
function init(){
 $('prev').addEventListener('click',()=>choose(index-1));$('next').addEventListener('click',()=>choose(index+1));
 $('sourceView').addEventListener('click',()=>{sourceMode='view';renderCode(steps[index])});
 $('changesView').addEventListener('click',()=>{sourceMode='diff';renderCode(steps[index])});
 $('afterView').addEventListener('click',()=>{side='after';renderCode(steps[index])});
 $('beforeView').addEventListener('click',()=>{side='before';renderCode(steps[index])});
 document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>setPanel(b.dataset.panel)));
 $('search').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  nodes.rail.querySelectorAll('.commit-group').forEach(group=>{let visible=0;group.querySelectorAll('.rail-step').forEach(b=>{b.hidden=!!q&&!b.dataset.search.includes(q);if(!b.hidden)visible++});group.hidden=visible===0});
 });
 $('search').addEventListener('keydown',e=>{if(e.key==='Enter'){const visible=nodes.rail.querySelector('.rail-step:not([hidden])');if(visible){visible.click();$('search').blur()}e.preventDefault()}});
 document.addEventListener('keydown',e=>{if(e.target.closest('input,textarea,select,[contenteditable=true]'))return;if(e.key==='ArrowRight'){e.preventDefault();choose(index+1)}else if(e.key==='ArrowLeft'){e.preventDefault();choose(index-1)}});
 const first=(location.hash.match(/^#step-(\d+\.\d+)$/)||[])[1];const found=steps.findIndex(x=>x.id===first);
 rail();setPanel('visual');choose(found>=0?found:0);
}
Promise.all(['commits.json','lessons.json','visuals.json'].map(async f=>{const r=await fetch(f);if(!r.ok)throw new Error(f+' HTTP '+r.status);return r.json()}))
.then(([commitData,lessonData,visualData])=>{commits=commitData.commits;steps=lessonData.steps;visuals=visualData.byCommitStep;init()})
.catch(e=>{setText('stepTitle','Unable to load project data');setText('visualFocus',e.message);$('liveStatus').textContent=e.message});
