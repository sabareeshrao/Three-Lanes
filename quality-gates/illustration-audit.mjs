#!/usr/bin/env node
// Enforce source-safe thin, modular SVGs without imposing a diagram whitelist.
import fs from 'node:fs';
import path from 'node:path';
const errs=[],root=process.cwd();
const check=(ok,msg)=>{if(!ok)errs.push(msg)};
const cat=JSON.parse(fs.readFileSync(path.join(root,'illustration-library/catalog.json'),'utf8'));
check(cat.openVocabulary===true,'Illustration catalog must permit new IDs');
check(cat.style.includes('Petclinic'),'Approved visual reference must be the original Petclinic template');
const seen=new Set(),entries=cat.assets||[];
for(const a of entries){
 const file=path.join(root,'illustration-library',a.source);
 check(!seen.has(a.id),'Duplicate ID '+a.id);seen.add(a.id);
 check(fs.existsSync(file),'Missing SVG '+a.id);if(!fs.existsSync(file))continue;
 const s=fs.readFileSync(file,'utf8'),first=s.match(/<svg\b[^>]*>/)?.[0]||'';
 check(first.includes('data-tl-illustration-id="'+a.id+'"'),'ID does not match source '+a.id);
 check(/viewBox="0 0 [1-9]\d* [1-9]\d*"/.test(first),'Missing viewBox '+a.id);
 check(first.includes('role="img"')&&first.includes('aria-labelledby='),'Missing SVG accessibility '+a.id);
 check(s.includes('<title id="'+a.id+'-title">')&&s.includes('<desc id="'+a.id+'-desc">'),'Missing title/desc '+a.id);
 check(s.includes('data-motif="illustration-main"'),'Missing central artwork '+a.id);
 check(!/<script\b|<foreignObject\b|javascript:|\bon(?:click|load|mouse\w+|key\w+)\s*=/.test(s),'Unsafe SVG markup '+a.id);
 const lines=[...s.matchAll(/<path\b[^>]*stroke-width="([\d.]+)"[^>]*\/>/g)].map(m=>Number(m[1]));
 check(lines.every(w=>w<=3.6),'Overly thick SVG path in '+a.id);
 if(a.kind==='connector')check(lines.every(w=>w<=2.3),'Bulky connector in '+a.id);
}
const files=fs.readdirSync(path.join(root,'illustration-library/assets')).filter(f=>f.endsWith('.svg'));
check(files.length===entries.length,'Gallery inventory differs from SVG source inventory');
for(const f of files)check(seen.has(f.slice(0,-4)),'Uncatalogued SVG '+f);
check(entries.length===200,'Expected exactly 200 lightweight SVG source assets and catalog entries');
check(new Set(entries.map(x=>x.category)).size>=12,'Expected organized technical categories');
console.log('Illustration audit: '+entries.length+' lightweight, open-ended primitives and connectors.');
if(errs.length){for(const e of errs)console.error('FAIL '+e);process.exitCode=1}
else console.log('PASS: SVG source, thin strokes, gallery inventory and open vocabulary.');
