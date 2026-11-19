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
check(audit.checkedCommits===5&&audit.checkedFiles===14&&audit.lineCoordinateCoverage,'Coverage tracker inconsistent');
console.log('Project-Rebuild QA: '+commits.length+' historical commits / '+steps.length+' file-scoped steps / 14 SVGs / 192 changed lines.');
if(errors.length){errors.forEach(e=>console.error('FAIL '+e));process.exitCode=1;}
else console.log('PASS: source coverage, transparent SVGs and structural ID parity with original prototype.');
