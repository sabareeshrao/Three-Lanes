#!/usr/bin/env node
// Audits 50 independent reusable SVG modules without restricting future diagram types.
import fs from 'node:fs';
import path from 'node:path';
const errors=[];
const assert=(x,m)=>{if(!x)errors.push(m)};
const root=process.cwd();
const catalog=JSON.parse(fs.readFileSync(path.join(root,'illustration-library/catalog.json'),'utf8'));
assert(catalog.openVocabulary===true,'AI must be allowed to create arbitrary new diagram IDs');
const seen=new Set();
for(const entry of catalog.assets||[]){
 const file=path.join(root,'illustration-library',entry.source);
 assert(!seen.has(entry.id),'Duplicate illustration ID '+entry.id);seen.add(entry.id);
 assert(fs.existsSync(file),'Missing illustration '+entry.id);if(!fs.existsSync(file))continue;
 const s=fs.readFileSync(file,'utf8');
 const first=s.match(/<svg\b[^>]*>/s)?.[0]||'';
 assert(first.includes('data-tl-illustration-id="'+entry.id+'"'),entry.id+' ID mismatch');
 assert(/viewBox="0 0 640 400"/.test(first),entry.id+' missing viewBox');
 assert(first.includes('role="img"')&&first.includes('aria-labelledby='),entry.id+' missing accessible labeling');
 assert(s.includes('<title id="'+entry.id+'-title">')&&s.includes('<desc id="'+entry.id+'-desc">'),entry.id+' missing title or description');
 assert(!/<script\b|<foreignObject\b|javascript:|\bon(?:click|load|mouse\w+|key\w+)\s*=/.test(s),entry.id+' includes unsafe markup');
 const thick=[...s.matchAll(/<path\b[^>]*stroke-width="([\d.]+)"[^>]*\/>/g)].filter(m=>Number(m[1])>3.1);
 assert(!thick.length,entry.id+' oversized stroked paths: '+thick.length);
 if(entry.kind==='connector'){
  const cut=s.slice(s.indexOf('data-motif="illustration-main"'));
  const arrowHeads=[...cut.matchAll(/<path\b[^>]*d="([^"]+)"[^>]*>/g)];
  assert(arrowHeads.every(m=>Number((m[0].match(/stroke-width="([\d.]+)"/)||[])[1]||0)<=3.1),entry.id+' heavy arrow line');
  assert(!/stroke-width="(?:[5-9]|1\d)"/.test(cut),entry.id+' heavy connector arrow');
 }
}
assert(seen.size>=50,'Expected 50 unique reusable illustrations');
const dir=fs.readdirSync(path.join(root,'illustration-library/assets')).filter(f=>f.endsWith('.svg'));
assert(dir.length===seen.size,'Illustration gallery catalog and actual SVG files differ');
for(const filename of dir)assert(seen.has(filename.slice(0,-4)),'Missing metadata for '+filename);
console.log('Illustration audit: '+seen.size+' standalone SVG assets; open-vocabulary custom diagrams allowed.');
if(errors.length){errors.forEach(x=>console.error('FAIL '+x));process.exitCode=1;}
else console.log('PASS: all modular SVG IDs, code files, safety markers and connector thickness.');
