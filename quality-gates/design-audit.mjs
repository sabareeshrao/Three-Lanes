#!/usr/bin/env node
// Three-Lanes static design gate. Node core APIs only; safe to run on every push.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root=process.cwd(),errors=[],warnings=[];
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const fail=s=>errors.push(s);
const check=(ok,s)=>{if(!ok)fail(s)};
const registry=JSON.parse(read('design-system/registry.json'));
const tokenCss=read('design-system/tokens.css');
const ids=new Set(),samples=new Set();
check(registry.schemaVersion===1,'Unsupported catalog schema');
check(registry.patterns?.length>=6,'Need at least six distinct approved diagram pattern examples');
for(const key of ['--tl-font-ui','--tl-font-code','--tl-bg','--tl-backend','--tl-frontend','--tl-fullstack','--tl-canvas','--tl-canvas-grid','--tl-lane-height']){
 check(tokenCss.includes(key+':'),"Missing canonical design token "+key);
}
check(tokenCss.includes('--tl-fullstack:#EA580C'),'Full-stack chip must be orange, never yellow');
check(tokenCss.includes('--tl-lane-height:700px'),'Approved fixed lane height must be 700px');
function inspectSvg(file,patternId){
 const s=read(file),first=s.match(/<svg\b[^>]*>/s)?.[0]||'';
 check(first.length>0,file+' missing SVG root');
 check(/viewBox="0 0 \d+ \d+"/.test(first),file+' needs a positive fixed viewBox');
 check(first.includes('data-tl-diagram-type="'+patternId+'"'),file+' diagram type metadata mismatch');
 check(first.includes('data-design-version="1"'),file+' design version metadata missing');
 check(first.includes('role="img"')&&first.includes('aria-labelledby='),file+' accessible image semantics missing');
 check(/<title\b[^>]*>[^<]+<\/title>/.test(s),file+' meaningful <title> required');
 check(/<desc\b[^>]*>[^<]+<\/desc>/.test(s),file+' meaningful <desc> required');
 check(!/<script\b|<foreignObject\b|\bon(?:click|load|mouse\w+|key\w+)\s*=|javascript:/i.test(s),file+' has executable or nonportable SVG content');
 check(!/<image\b[^>]*(?:https?:|data:)/i.test(s),file+' references an embedded external/base64 image');
 check(!/font-size="(?:[1-9])"/.test(s),file+' includes text below 10px');
 check(!/markerWidth="(?:1[2-9]|[2-9]\d)"/.test(s),file+' oversized arrowhead marker');
 check(/preserveAspectRatio="xMidYMid meet"/.test(first),file+' must scale and center without stretching');
 return s;
}
for(const p of registry.patterns){
 check(p.id&&!ids.has(p.id),'Duplicate or missing catalog ID '+p.id);ids.add(p.id);
 check(['approved','candidate'].includes(p.status),'Invalid approval status for '+p.id);
 check(['Architecture','Behavior','Data','UI'].includes(p.category),'Invalid category for '+p.id);
 check(typeof p.whenToUse==='string'&&p.whenToUse.length>25,'Missing usage guidance for '+p.id);
 check(typeof p.quality==='string'&&p.quality.length>25,'Missing quality standard for '+p.id);
 check(p.sample==='diagram-catalog/'+p.id+'.svg','Sample naming must match stable pattern ID: '+p.id);
 const file='design-system/'+p.sample;
 check(exists(file),'Missing sample SVG '+file);
 if(exists(file)){inspectSvg(file,p.id);samples.add(path.normalize(file));}
}
const diskSamples=fs.readdirSync(path.join(root,'design-system/diagram-catalog')).filter(f=>f.endsWith('.svg'));
for(const f of diskSamples)check(samples.has(path.normalize('design-system/diagram-catalog/'+f)),'Unregistered new catalog pattern '+f);
const pages=['index.html','projects/spring-petclinic/batches/001/index.html','projects/spring-petclinic/batches/002/index.html','design-system/catalog/index.html'];
for(const file of pages)check(read(file).includes('design-system/tokens.css')||read(file).includes('href="../tokens.css"'),file+' must import shared tokens directly');
check(read('design-system/catalog/catalog.js').includes('fetch("../registry.json"'),'Catalog must be data-driven and expandable');
for(const file of ['AGENTS.md','projects/_template/AGENTS.md','projects/spring-petclinic/AGENTS.md']){
 const s=read(file);
 check(s.includes('design-system/README.md'),file+' must tell coding agents to load the design system first');
 check(s.includes('one changed file')||s.includes('ONE step = exactly ONE changed file'),file+' lost one-file-per-step rule');
}
for(const file of ['styles/app.css','projects/spring-petclinic/shared/viewer.css']){
 const s=read(file);
 check(s.includes('scrollbar-width:none'),'Hidden-but-scrollable commit belt missing: '+file);
 check(s.includes('::-webkit-scrollbar'),'WebKit scrollbar hiding missing: '+file);
 check(s.includes('overflow-y:auto'),'Commit belt must keep vertical scroll: '+file);
 check(s.includes('--tl-font-ui'),'Viewer must use canonical UI font: '+file);
}
check(read('design-system/README.md').includes('illustration-library/catalog.json'),'AI instructions must mention 50 independent illustrations');
function changedFiles(){
 let base=process.env.DESIGN_DIFF_BASE||'';
 if(!/^[0-9a-f]{40}$/.test(base)||/^0{40}$/.test(base)){
  try{base=execFileSync('git',['rev-parse','HEAD^'],{encoding:'utf8'}).trim();}catch{return [];}
 }
 try{
  return execFileSync('git',['diff','--name-only',base,'HEAD'],{encoding:'utf8',maxBuffer:4*1024*1024}).trim().split('\n').filter(Boolean);
 }catch(e){warnings.push('Could not inspect changed files: '+e.message);return [];}
}
const changed=changedFiles();
for(const file of changed){
 if(!exists(file))continue;
 if(/^projects\/[^/]+\/.*\/svg\/[^/]+\.svg$/.test(file)||/^projects\/[^/]+\/svg\/[^/]+\.svg$/.test(file)){
  const s=read(file);
  const first=s.match(/<svg\b[^>]*>/s)?.[0]||'';
  const id=first.match(/data-tl-diagram-id="([^"]+)"/)?.[1]||first.match(/data-tl-diagram-type="([^"]+)"/)?.[1];
  check(!!id,file+' needs a unique diagram ID (no approved-pattern whitelist)');
  check(/viewBox="0 0 \d+ \d+"/.test(first),file+' must declare a positive viewBox');
  check(first.includes('data-design-version="1"'),file+' needs design version');
  check(first.includes('role="img"')&&first.includes('aria-labelledby='),file+' needs accessible image labeling');
  check(/<title\b[^>]*>[^<]+<\/title>/.test(s)&&/<desc\b[^>]*>[^<]+<\/desc>/.test(s),file+' requires nonempty title and description');
  check(!/<script\b|<foreignObject\b|\bon(?:click|load|mouse\w+|key\w+)\s*=|javascript:/i.test(s),file+' must not contain executable SVG');
  check(!/<image\b[^>]*(?:https?:|data:)/i.test(s),file+' must not embed remote or data images');
  // Open vocabulary: inventing a new diagram type or composition is always allowed.
 }
 if(/^projects\/[^/]+\/.*frontend-ui\/[^/]+\.html$/.test(file)){
  check(read(file).includes('data-tl-design-version="1"'),file+' must identify design-system version (legacy files are exempt until changed)');
 }
}
console.log('Three-Lanes design audit: '+registry.patterns.length+' optional reference compositions, '+changed.length+' changed files checked. Diagram IDs are open-ended.');
warnings.forEach(w=>console.warn('WARN '+w));
if(errors.length){for(const e of errors)console.error('FAIL '+e);console.error(errors.length+' design gate failure(s)');process.exitCode=1;}
else console.log('PASS: tokens, catalog, agent instructions, scroll contract and changed visual assets.');
