#!/usr/bin/env node
// Run from repository root: node projects/project-rebuild/tests/validate.mjs
// Historical source coverage and modular illustration QA, no network dependency.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name),'utf8'));
const commits=read('commits.json').commits;
const steps=read('lessons.json').steps;
const visuals=read('visuals.json').byCommitStep;
const source=read('source-links.json').byCommitStep;
const audit=read('coverage-audit.json');
const errors=[];
function check(ok,message){if(!ok)errors.push(message);}
check(commits.length===5,'Exactly five historical commits required for first batch');
check(steps.length===14,'Exactly fourteen single-file steps required');
check(new Set(commits.map(c=>c.sha)).size===5,'Duplicate historical SHAs');
check(commits.every(c=>/^[a-f0-9]{40}$/.test(c.sha)),'Invalid historical SHA');
check(steps.every(s=>s.shownCodeLines<=100),'Learning step exceeds 100 source/diff lines');
check(steps.reduce((a,s)=>a+s.added+s.removed,0)===192,'Added and removed line coverage changed');
for(const commit of commits){
 const fileSteps=steps.filter(s=>s.sha===commit.sha);
 check(fileSteps.length===commit.steps.length,'File count mismatch for '+commit.sha);
 check(fileSteps.every((s,i)=>s.id===commit.number+'.'+(i+1)),'Wrong step numbering for '+commit.sha);
 check(new Set(fileSteps.map(s=>s.file)).size===fileSteps.length,'Two steps unexpectedly own the same file in '+commit.sha);
}
for(const s of steps){
 const key=s.sha+':'+s.id;
 const lines=s.patchLines||[];
 check(lines.length===s.shownCodeLines,'Diff line count mismatch '+s.id);
 check(lines.filter(r=>r.type==='add').length===s.added,'Missing added lines '+s.id);
 check(lines.filter(r=>r.type==='remove').length===s.removed,'Missing removed lines '+s.id);
 check(s.changedCoordinates.length===s.added+s.removed,'Missing changed coordinates '+s.id);
 check(lines.every(r=>['add','remove','context'].includes(r.type)),'Unknown diff row '+s.id);
 check(s.file&&s.sourceUrl.includes('/blob/'+s.sha+'/'+s.file),'Source not pinned to immutable SHA '+s.id);
 check(s.commitUrl.includes(s.sha),'Commit source link mismatched '+s.id);
 check(source[key]?.[0]?.file===s.file,'Source-link file mismatch '+s.id);
 const visual=visuals[key]?.backend;
 check(!!visual,'Missing source-scoped SVG mapping '+s.id);
 if(visual){
  const file=path.join(root,visual);
  check(fs.existsSync(file),'SVG missing '+file);
  if(fs.existsSync(file)){
   const xml=fs.readFileSync(file,'utf8');
   check(xml.includes('<svg ')&&xml.includes('</svg>'),'Malformed SVG wrapper '+s.id);
   check(xml.includes('role="img"')&&xml.includes('<title ')&&xml.includes('<desc '),'Inaccessible SVG '+s.id);
   check(xml.includes('viewBox="0 0 760 430"'),'Wrong SVG geometry '+s.id);
   check(!/<script\b|<foreignObject\b|javascript:/i.test(xml),'Unsafe SVG '+s.id);
   check(!/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/i.test(xml),'Unescaped XML entity '+s.id);
   check(!xml.includes('id="dots"')&&!xml.includes('PROJECT-REBUILD · SOURCE-GROUNDED'),'Diagrams must use continuous parent grid without branded footer: '+s.id);
   const strokes=[...xml.matchAll(/stroke-width="([\d.]+)"/g)].map(x=>Number(x[1]));
   check(strokes.every(v=>v<=3.5),'Bulky SVG strokes '+s.id);
  }
 }
}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
check(html.includes('../../design-system/tokens.css'),'Viewer must import shared Three-Lanes tokens');
check(html.includes('./app.js'),'Missing nested project viewer');
const original=fs.readFileSync(path.resolve(root,'../../index.html'),'utf8');
const originalIds=new Set([...original.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
const currentIds=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]));
for(const id of originalIds)check(currentIds.has(id),'Original prototype element missing: '+id);
check(html.includes('../../styles/app.css'),'Viewer must use original prototype CSS, not a replacement skin');
check(html.includes('id="railItems"')&&html.includes('class="rail"'),'Original SHA conveyor missing');
check(html.includes('id="backendLane"')&&html.includes('id="frontendLane"'),'Original two visual lanes missing');
check(html.includes('id="mentorDropdown"')&&html.includes('id="mentorText"'),'Collapsible mentor explanation missing');
check(html.includes('id="sharedSourceDock"')&&html.includes('id="sharedViewTab"')&&html.includes('id="sharedDiffTab"'),'Original shared code bar missing');
check(html.includes('id="wideCompare"')&&html.includes('id="compareBefore"')&&html.includes('id="compareAfter"'),'Original full-width Before/After inspector missing');
const appJs=fs.readFileSync(path.join(root,'app.js'),'utf8');
check(appJs.includes('projectApp')&&appJs.includes('renderTimeline')&&appJs.includes('renderInspector'),'Project behavior must be wired to prototype controls');
const customCSS=fs.readFileSync(path.join(root,'styles.css'),'utf8');
check(!customCSS.includes('grid-template-columns:minmax(0,1fr) 180px minmax(0,1fr)'),'Must not recreate independent viewer grid');
check(!customCSS.includes('.conveyor{'),'Must not recreate alternate conveyor system');

// Keep the real source visible on first load and while navigating to any file or commit.
check(appJs.includes('inspectorOpen=true,inspectorMode="compare"'),'Original source must be expanded by default');
const chooseBlock=(appJs.match(/function choose\(ci,si\)\{[\s\S]*?\n \}/)||[])[0]||'';
check(chooseBlock.includes('selection={ci,si};')&&!chooseBlock.includes('inspectorOpen=false'),'Step navigation must not close source inspector');
check(chooseBlock.indexOf('inspectorMode="compare"')===-1,'Step navigation must retain selected source mode');
check(appJs.includes('class="no"')&&appJs.includes("'+c.number+'"),'Commit carousel must display ordinal numbers rather than SHA hashes');
check(appJs.includes('const sub=') && !appJs.includes("const sub=selected?"),'All commit substep groups must remain in fixed positions');
check(appJs.includes('selected&&activeStep===j'),'Only currently selected substep should be highlighted');
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
check(css.includes('--rebuild-lane-height:700px'),'Lane height must be a fixed 700px');
check(css.includes('--rebuild-inspector-height:max(430px, calc(100svh - 24px))'),'Inspector height must be viewport-filling and independent of code length');
check(css.includes('overscroll-behavior-y:auto!important'),'Code panes must release wheel scroll at boundaries');
check(css.includes('.workspace:has(> .wide-compare[hidden])'),'Closing code should not reserve an empty inspector row');
check(appJs.includes('window.scrollBy(0,amount)')&&appJs.includes('event.preventDefault()'),'Wheel must shift document until inspector is fully in view');
check(appJs.includes('event.deltaY<=0'),'Upward scrolling must be allowed to return naturally to visual lanes');
check(css.includes('grid-template-rows:var(--rebuild-lane-height) var(--rebuild-sourcebar-height) var(--rebuild-inspector-height)'),'Source dock and viewer require stable grid rows');
check(css.includes('#compareBefore,#compareAfter')&&css.includes('overflow:auto!important'),'Code panes must scroll inside inspector');
check(css.includes('.workspace.mobile-both')&&css.includes('--rebuild-sourcebar-height:88px'),'Mobile geometry must be pinned per breakpoint');
check(css.includes('height:var(--rebuild-summary-height)!important'),'Summary row must not resize when commit title changes');

check(!html.includes('id="wideCompare" hidden'),'Source inspector should not start hidden in HTML');
check(html.includes('app.js?v=scroll-handoff-4'),'Viewer JS should bypass the prior cached implementation');
check(audit.checkedCommits===5&&audit.checkedFiles===14&&audit.lineCoordinateCoverage,'Coverage tracker inconsistent');
console.log('Project-Rebuild QA: '+commits.length+' historical commits / '+steps.length+' file-scoped steps / 14 SVGs / 192 changed lines.');
if(errors.length){errors.forEach(e=>console.error('FAIL '+e));process.exitCode=1;}
else console.log('PASS: source coverage, transparent SVGs and structural ID parity with original prototype.');
