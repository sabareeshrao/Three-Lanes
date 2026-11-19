(function projectApp(){
 "use strict";
 const $=id=>document.getElementById(id);
 const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
 let commits=[],steps=[],visuals={};
 let selection={ci:0,si:0},inspectorOpen=true,inspectorMode="compare",mobileView="both";
 function current(){
  const c=commits[selection.ci],s=steps.find(x=>x.commitOrdinal===c.number&&x.id===c.steps[selection.si].id);
  return {c,s};
 }
 function seekStep(id){const step=steps.find(x=>x.id===id);if(!step)return;const ci=commits.findIndex(c=>c.number===step.commitOrdinal);const si=commits[ci].steps.findIndex(x=>x.id===id);choose(ci,si);}
 function basename(path){return String(path).split("/").at(-1);}
 function sourceUrl(step,side="after",line=null){
   const sha=side==="before"?step.parentSha:step.sha;
   if(!sha)return step.commitUrl;
   return "https://github.com/sabareeshrao/Project-Rebuild/blob/"+sha+"/"+step.file.split("/").map(encodeURIComponent).join("/")+(Number.isInteger(line)?"#L"+line:"");
 }
 function fileLink(step,old,line){return '<a href="'+esc(sourceUrl(step,old?"before":"after",line))+'" target="_blank" rel="noopener noreferrer" aria-label="Open original line '+line+'">'+line+"</a>";}
 function renderSourceCodeRow(step,row){
  const a=row.oldLine!=null?fileLink(step,true,row.oldLine):"·",b=row.newLine!=null?fileLink(step,false,row.newLine):"·";
  const type=row.type==="add"?"added":row.type==="remove"?"removed":"context";
  const mark=row.type==="add"?"+":row.type==="remove"?"-":" ";
  return '<div class="source-row '+type+'"><span class="sourceno">'+a+'</span><span class="sourceno">'+b+'</span><span class="source-mark">'+mark+'</span><span class="source-text">'+esc(row.text)+'</span></div>';
 }
 function renderFullDiff(step){
  let out="",oldLine=0,newLine=0;
  for(const line of step.patch.split("\n")){
   if(line.startsWith("@@")){const m=line.match(/^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);if(m){oldLine=+m[1];newLine=+m[2];}out+='<div class="source-hunk">'+esc(line)+'</div>';continue;}
   if(line.startsWith("\\ No newline")){out+='<div class="source-meta">'+esc(line)+'</div>';continue;}
   if(![" ","+","-"].includes(line[0]))continue;
   const mark=line[0],row={type:mark==="+"?"add":mark==="-"?"remove":"context",oldLine:mark==="+"?null:oldLine,newLine:mark==="-"?null:newLine,text:line.slice(1)};
   if(mark!=="+")oldLine++;if(mark!=="-")newLine++;
   out+=renderSourceCodeRow(step,row);
  }
  return out;
 }
 function paneHTML(step,oldVersion){
  const raw=oldVersion?step.before:step.after;
  if(!raw)return '<div class="source-state">This file did not exist before the selected commit.</div>';
  const changed=new Set(step.changedCoordinates.filter(x=>x.type===(oldVersion?"remove":"add")).map(x=>oldVersion?x.oldLine:x.newLine));
  return raw.replace(/\n$/,"").split("\n").map((line,i)=>{
   const num=i+1,affected=changed.has(num);
   return '<div class="compare-row '+(affected?(oldVersion?"removed":"added"):"")+'"><a class="compare-ln" href="'+esc(sourceUrl(step,oldVersion?"before":"after",num))+'" target="_blank" rel="noopener noreferrer">'+num+'</a><span class="compare-text">'+esc(line)+'</span></div>';
  }).join("");
 }
 function renderInspector(){
  const {c,s}=current(),mode=inspectorMode;
  $("sharedViewTab").classList.toggle("chosen",mode==="compare");
  $("sharedDiffTab").classList.toggle("chosen",mode==="diff");
  $("sharedViewTab").setAttribute("aria-pressed",String(mode==="compare"&&inspectorOpen));
  $("sharedDiffTab").setAttribute("aria-pressed",String(mode==="diff"&&inspectorOpen));
  const dock=$("wideCompare");dock.hidden=!inspectorOpen;
  if(!inspectorOpen)return;
  $("compareTitle").textContent=mode==="diff"?"Complete GitHub file changes":"Before / After";
  $("comparePath").textContent=s.file+"  ·  "+s.sha.slice(0,8);
  $("compareColumns").hidden=mode==="diff";$("compareDiff").hidden=mode!=="diff";
  if(mode==="diff")$("compareDiff").innerHTML=renderFullDiff(s);
  else{$("compareBefore").innerHTML=paneHTML(s,true);$("compareAfter").innerHTML=paneHTML(s,false);}
  $("sharedFileLink").href=sourceUrl(s);
  // The original prototype puts its inspector below the fixed lanes.
  // No programmatic scroll jump: the reading position remains stable.
 }
 function toggleSource(mode){
  if(inspectorOpen&&inspectorMode===mode)inspectorOpen=false;
  else {inspectorOpen=true;inspectorMode=mode;}
  renderInspector();
 }
 function setOutput(step){
  const title=step.title;
  const shell=(kicker,heading,inside,footer)=>{
    $("frontendGraphic").innerHTML='<section class="micro-workbench prot-runtime" aria-label="Source-grounded Python behavior"><header><span class="runtime-kicker">'+esc(kicker)+'</span><h3>'+esc(heading)+'</h3></header><main>'+inside+'<div class="runtime-foot">'+esc(footer)+'</div></main></section>';
  };
  const card=(title,body)=>'<div class="terminal-view"><div class="terminal-title"><span>'+esc(title)+'</span><span class="lights"><i></i><i></i><i></i></span></div><pre>'+esc(body)+'</pre></div>';
  const chips=(list)=>'<div class="learning-chips">'+list.map(item=>'<b class="'+(item.good?"good":item.bad?"bad":"")+'">'+esc(item.value)+'</b>').join("")+'</div>';
  switch(step.visualKind){
   case "roadmap":
    shell("DOCUMENTATION ONLY","Learning milestones",chips([{value:"Token IDs"},{value:"B × T"},{value:"Next token"},{value:"Attention"}]),"At this commit, the repository contains a roadmap, not runnable GPT code.");break;
   case "ignore":
    shell("GIT WORKTREE","Excluded generated files",card(".gitignore",".venv/\n__pycache__/\n*.pyc\n.pytest_cache/\nout/\nwandb/"),"Only real source and lessons belong in version control.");break;
   case "setup":
    shell("LOCAL ENVIRONMENT","Install instructions",card("README.md · commands","python -m venv .venv\nsource .venv/bin/activate\npython -m pip install -e \".[dev]\""),"These are source-documented commands, not results of a run.");break;
   case "package":
    shell("PROJECT MANIFEST","Package requirements",card("pyproject.toml","Python >= 3.10\nsetuptools >= 68\ntorch >= 2.2\npytest >= 8 (dev)"),"Build, runtime and test dependencies declared in source.");break;
   case "module":
    shell("PACKAGE NAMESPACE","Import location",card("src/rebuild_gpt/__init__.py","\"\"\"A learning-first reimplementation\nof nanoGPT.\"\"\""),"This initializer contains no model implementation.");break;
   case "batch-example":
    shell("EXPECTED EXAMPLE OUTPUT","Two token sequences",card("examples/01_token_batches.py","tokens:\n tensor([[10, 20, 30, 40],\n         [50, 60, 70, 80]])\nshape: (2, 4)\ndtype: torch.int64"),"Derived from the Python source; no execution is claimed.");break;
   case "axes":
    shell("DATA SHAPE","Batch and time axes",
      '<div class="runtime-axis"><em>B / T</em><em>1</em><em>2</em><em>3</em><em>4</em><em>A</em><span>10</span><span>20</span><span>30</span><span>40</span><em>B</em><span class="green">50</span><span class="green">60</span><span class="green">70</span><span class="green">80</span><small>2 sequences × 4 positions</small></div>',
      "Token IDs are integer indices—not one-hot strings.");break;
   case "tensor-fn":
    shell("FUNCTION CONTRACT","token_batch(rows)",card("src/rebuild_gpt/tensors.py","batch = torch.tensor(rows,\n    dtype=torch.long)\nif batch.ndim != 2 or batch.numel() == 0:\n    raise ValueError(...)"),"Checks two axes and a nonempty tensor.");break;
   case "batch-tests":
    shell("TEST ASSERTIONS","What the tests verify",chips([{value:"shape == (2,3)",good:true},{value:"torch.long",good:true},{value:"[] → ValueError",bad:true},{value:"flat list → ValueError",bad:true}]),"Assertions present in source; not a claim of a test run.");break;
   case "run-commands":
    shell("DOCUMENTED COMMANDS","First runnable lessons",card("README.md","python examples/01_token_batches.py\npython examples/02_next_token_pairs.py\npython -m pytest"),"The README documents how to run each checkpoint.");break;
   case "pairs-example":
    shell("EXPECTED EXAMPLE OUTPUT","Next-token pairs",card("examples/02_next_token_pairs.py","inputs:  [[10, 20, 30]]\ntargets: [[20, 30, 40]]"),"Training labels are shifted exactly one token to the right.");break;
   case "shift":
    shell("CAUSAL TARGET WINDOW","Shifted by one position",chips([{value:"x: 10 20 30"},{value:"y: 20 30 40",good:true}]),"The two windows have shape (B, T−1).");break;
   case "slice-fn":
    shell("RETURNED TENSOR VIEWS","No copy of the batch",card("src/rebuild_gpt/tensors.py","inputs  = batch[:, :-1]\ntargets = batch[:, 1:]"),"Both slices refer to the original tensor storage.");break;
   case "shift-tests":
    shell("TEST ASSERTIONS","Prediction alignment",chips([{value:"x → [10,20,30]",good:true},{value:"y → [20,30,40]",good:true},{value:"T < 2 → ValueError",bad:true}]),"Exact assertions in the test source; no invented test result.");break;
   default:
    shell("SOURCE BEHAVIOR",title,'<div class="note-quiet"><strong>Source-grounded explanation</strong>Use the selected code and its original file-specific diff.</div>',"No frontend code changed in this step.");
  }
 }
 function displayMobile(){
  const mobile=window.matchMedia("(max-width:820px)").matches;
  const workspace=document.querySelector(".workspace");
  workspace.classList.toggle("mobile-both",mobile&&mobileView==="both");
  $("backendLane").classList.toggle("mobilehide",mobile&&mobileView==="frontend");
  $("frontendLane").classList.toggle("mobilehide",mobile&&mobileView==="backend");
  document.querySelectorAll("[data-mview]").forEach(btn=>btn.classList.toggle("active",btn.dataset.mview===mobileView));
 }
 function renderTimeline(){
  const rail=$("railItems"),previous=rail.scrollTop;
  rail.innerHTML=commits.map((c,i)=>{
   const selected=i===selection.ci,sha=c.sha.slice(0,7),activeStep=selection.si;
   const chip='<button class="commitBtn backend '+(selected?"selected":"")+'" type="button" data-c="'+i+'" data-s="0" aria-current="'+selected+'" aria-label="Commit '+sha+': '+esc(c.title)+'" data-commit-title="'+esc(c.title)+'"><span class="no">'+c.number+'</span></button>';
   // Keep every commit group the same height regardless of selection.
   // Reserve no "expanded only" area: all file substeps have a stable rail position.
   const sub='<div class="substeps">'+c.steps.map((s,j)=>'<button type="button" class="subbtn '+(selected&&activeStep===j?"selected":"")+'" data-c="'+i+'" data-s="'+j+'" aria-current="'+(selected&&activeStep===j?"step":"false")+'" title="'+esc(s.title)+'" aria-label="'+esc("Step "+s.id+": "+s.title)+'">'+esc(s.id)+'</button>').join("")+'</div>';
   return '<div class="railitem backend">'+chip+sub+'</div>';
  }).join("");
  rail.scrollTop=previous;
  const active=rail.querySelector(".subbtn.selected")||rail.querySelector(".commitBtn.selected");
  if(active){
   const out=rail.getBoundingClientRect(),inside=active.getBoundingClientRect();
   if(inside.top<out.top+6)rail.scrollTop-=out.top+6-inside.top;
   else if(inside.bottom>out.bottom-6)rail.scrollTop+=inside.bottom-(out.bottom-6);
  }
 }
 function hideHover(){const tip=$("commitHoverLabel");tip.hidden=true;tip.textContent="";}
 function showHover(btn){
  if(!btn)return;const tip=$("commitHoverLabel");
  tip.textContent=btn.dataset.commitTitle||"";tip.hidden=false;
  const r=btn.getBoundingClientRect(),size=tip.getBoundingClientRect(),windowW=window.innerWidth;
  tip.style.left=Math.min(Math.max(8,r.right+8),Math.max(8,windowW-size.width-8))+"px";
  tip.style.top=Math.max(8,Math.min(r.top,window.innerHeight-size.height-8))+"px";
 }
 function render(){
  if(!commits.length)return;
  const {c,s}=current();
  $("summary").innerHTML='<div class="summary-main"><span class="chip summary-kind backend">BACKEND</span><h2>'+esc(c.title)+'</h2><p><b>'+esc(s.title)+'</b> · '+esc(s.file)+'</p></div><div class="rightsummary"><span class="commit-position-label" aria-label="Commit ID">Commit ID · '+c.sha.slice(0,8)+'</span><a class="source" href="'+esc(c.url)+'" target="_blank" rel="noopener noreferrer">GitHub commit ↗</a></div>';
  $("stepPosition").textContent=s.id+"  ·  "+(steps.indexOf(s)+1)+"/"+steps.length;
  $("prevStep").disabled=steps.indexOf(s)===0;$("nextStep").disabled=steps.indexOf(s)===steps.length-1;
  $("backendName").textContent=s.title;$("backendInfo").textContent="CHANGED IN THIS STEP";
  $("backendGraphic").replaceChildren();
  const img=document.createElement("img");img.className="stored-svg-visual";img.alt=s.title+" — technical diagram for "+s.file;
  img.src=visuals[s.sha+":"+s.id]?.backend||"";img.loading="eager";img.decoding="async";$("backendGraphic").append(img);
  $("mentorText").textContent=s.mentor;$("mentorDropdown").open=false;
  $("frontendName").textContent="Observable Python behavior · "+basename(s.file);
  $("frontendInfo").textContent="NO FRONTEND SOURCE";
  setOutput(s);
  $("sharedFileSelect").replaceChildren(...c.steps.map(st=>{const opt=document.createElement("option");opt.value=st.id;opt.textContent=st.file;opt.selected=st.id===s.id;return opt;}));
  $("sharedFileLink").href=sourceUrl(s);
  $("sharedFileLink").textContent="Open file ↗";
  renderTimeline();renderInspector();displayMobile();
  $("status").textContent="Commit "+c.sha.slice(0,8)+" · "+s.id+" · "+s.file;
  const url=new URL(window.location.href);url.hash="step-"+s.id;history.replaceState(null,"",url.toString());
 }
 function choose(ci,si){
  if(ci<0||ci>=commits.length)return;
  if(si<0||si>=commits[ci].steps.length)return;
  selection={ci,si};
  // Keep the original-source inspector and its mode visible while switching files/commits.
  // The code is shown on first load and remains open until the reader explicitly closes it.
  render();
 }
 function shift(delta){
  const index=steps.findIndex(s=>s.id===current().s.id),next=steps[Math.min(Math.max(0,index+delta),steps.length-1)];
  if(next)seekStep(next.id);
 }
 function find(q){
  const needle=q.trim().toLowerCase();if(!needle)return;
  const step=steps.find(s=>[s.id,s.sha,s.sha.slice(0,8),s.title,s.file,commits[s.commitOrdinal-1].title].some(x=>String(x).toLowerCase().includes(needle)));
  if(step)seekStep(step.id);else $("status").textContent="No matching commit, file or lesson";
 }
 function init(){
  $("searchFormMain").addEventListener("submit",event=>{event.preventDefault();find($("search").value);});
  $("prevStep").addEventListener("click",()=>shift(-1));
  $("nextStep").addEventListener("click",()=>shift(1));
  $("railItems").addEventListener("click",event=>{
    const btn=event.target.closest("button[data-c]");if(btn)choose(+btn.dataset.c,+btn.dataset.s);
  });
  $("railItems").addEventListener("mouseover",event=>showHover(event.target.closest(".commitBtn[data-commit-title]")));
  $("railItems").addEventListener("mouseout",event=>{
   const from=event.target.closest(".commitBtn[data-commit-title]");
   if(from&&!from.contains(event.relatedTarget))hideHover();
  });
  $("railItems").addEventListener("focusin",event=>showHover(event.target.closest(".commitBtn[data-commit-title]")));
  $("railItems").addEventListener("focusout",hideHover);
  document.addEventListener("scroll",hideHover,true);
  window.addEventListener("resize",()=>{hideHover();displayMobile();});
  // Hand the wheel to the page until the inspector itself reaches the
  // viewport top; then let each source pane scroll its own file normally.
  // This prevents a partially visible code pane from trapping scroll input.
  $("wideCompare").addEventListener("wheel",event=>{
   if(!inspectorOpen||event.ctrlKey||event.metaKey||event.deltaY<=0)return;
   const inspector=$("wideCompare");
   const top=inspector.getBoundingClientRect().top;
   const targetTop=12;
   if(top<=targetTop+1)return;
   const scrollRoom=document.documentElement.scrollHeight-window.innerHeight-window.scrollY;
   if(scrollRoom<=0)return;
   event.preventDefault();
   const factor=event.deltaMode===1?16:event.deltaMode===2?window.innerHeight:1;
   const amount=Math.min(event.deltaY*factor,Math.max(0,top-targetTop),scrollRoom);
   window.scrollBy(0,amount);
  },{passive:false});
  $("sharedViewTab").addEventListener("click",()=>toggleSource("compare"));
  $("sharedDiffTab").addEventListener("click",()=>toggleSource("diff"));
  $("closeCompare").addEventListener("click",()=>{inspectorOpen=false;renderInspector();});
  $("sharedFileSelect").addEventListener("change",event=>seekStep(event.target.value));
  $("mobileTabs").addEventListener("click",event=>{const btn=event.target.closest("[data-mview]");if(!btn)return;mobileView=btn.dataset.mview;displayMobile();});
  document.addEventListener("keydown",event=>{
    if(event.target.closest("input,textarea,select,[contenteditable=true]")||event.altKey||event.metaKey||event.ctrlKey)return;
    if(event.key==="ArrowRight"){event.preventDefault();shift(1);}
    if(event.key==="ArrowLeft"){event.preventDefault();shift(-1);}
  });
  const incoming=window.location.hash.match(/^#step-(\d+\.\d+)$/),found=steps.find(x=>x.id===incoming?.[1]);
  if(found){const ci=commits.findIndex(c=>c.number===found.commitOrdinal),si=commits[ci].steps.findIndex(s=>s.id===found.id);selection={ci,si};}
  render();
 }
 Promise.all(["commits.json","lessons.json","visuals.json"].map(async p=>{const r=await fetch(p,{cache:"no-cache"});if(!r.ok)throw Error(p+": HTTP "+r.status);return r.json();}))
 .then(([c,s,v])=>{commits=c.commits;steps=s.steps;visuals=v.byCommitStep;init();})
 .catch(error=>{$("status").textContent="Cannot load verified nanoGPT lessons: "+error.message;$("summary").textContent="Project data unavailable: "+error.message;});
})();
