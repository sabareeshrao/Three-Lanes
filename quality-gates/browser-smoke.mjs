#!/usr/bin/env node
// Browser smoke + screenshot evidence. Visual judgment remains a separate human QA gate.
import { chromium } from 'playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const root=process.cwd(),out=path.join(root,'quality-gates/artifacts');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.mjs':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json;charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 if(pathname.endsWith('/'))pathname+='index.html';
 const p=path.resolve(root,'.'+pathname);
 if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);res.end('Missing');return;}
 res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');
 fs.createReadStream(p).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
// GitHub Actions Ubuntu 24.04 provides Chrome; use it to avoid a slow browser download.
const useSystemChrome=process.env.CI==='true'&&fs.existsSync('/usr/bin/google-chrome');
const browser=await chromium.launch({headless:true,channel:useSystemChrome?'chrome':undefined,args:['--no-sandbox']});
const errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const manifest=JSON.parse(fs.readFileSync('design-system/registry.json','utf8'));
try{
 for(const viewport of [{name:'desktop',width:1440,height:900},{name:'mobile',width:390,height:844}]){
  const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
  await page.goto(base+'/design-system/catalog/',{waitUntil:'networkidle'});
  await page.locator('.pattern-card').first().waitFor({timeout:12000});
  assert(await page.locator('.pattern-card').count()===manifest.patterns.length,'Catalog does not show all approved patterns at '+viewport.name);
  // Images below the viewport are lazy. Explicitly request all previews before auditing.
  await page.locator('.pattern-preview img').evaluateAll(imgs=>imgs.forEach(img=>{img.loading='eager';}));
  await page.waitForFunction(()=>[...document.querySelectorAll('.pattern-preview img')].length>0&&
    [...document.querySelectorAll('.pattern-preview img')].every(img=>img.complete&&img.naturalWidth>0&&img.naturalHeight>0),null,{timeout:20000});
  const images=await page.locator('.pattern-preview img').evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0&&img.naturalHeight>0));
  assert(images,'Diagram SVG specimens failed to load at '+viewport.name);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3),'Catalog horizontal overflow at '+viewport.name);
  await page.screenshot({path:path.join(out,'catalog-'+viewport.name+'.png'),fullPage:true,animations:'disabled'});
  // Screen captures for review: all catalog examples at both viewports.
  for(const pattern of manifest.patterns){
   const card=page.locator('.pattern-card').filter({has:page.locator('h3', {hasText:pattern.title})});
   await card.locator('img').screenshot({path:path.join(out,pattern.id+'-'+viewport.name+'.png'),animations:'disabled'});
  }
  if(viewport.name==='desktop'){
   await page.goto(base+'/index.html',{waitUntil:'domcontentloaded'});
   await page.locator('#railItems .commitBtn').first().waitFor({timeout:12000});
   const rail=await page.evaluate(()=>{
    const el=document.getElementById('railItems'),style=getComputedStyle(el);
    const top=scrollY,box=el.getBoundingClientRect();
    const probe=document.createElement('div');probe.style.height='2200px';probe.setAttribute('aria-hidden','true');el.append(probe);
    el.scrollTop=140;
    const result={overflow:style.overflowY,bar:style.scrollbarWidth,railMoved:el.scrollTop>=100,pageStable:scrollY===top,withinFrame:box.height<=701};
    probe.remove();return result;
   });
   assert(rail.overflow==='auto'&&rail.bar==='none','Prototype conveyor scrollbar is not invisible yet');
   assert(rail.railMoved&&rail.pageStable&&rail.withinFrame,'Prototype conveyor scroll changed page position or lane size');
   await page.screenshot({path:path.join(out,'prototype-desktop.png'),fullPage:false,animations:'disabled'});
  }
  await page.close();
 }
 // Verify every standalone reusable SVG actually parses and renders in Chromium.
 const catalog50=JSON.parse(fs.readFileSync('illustration-library/catalog.json','utf8'));
 const assetPage=await browser.newPage({viewport:{width:640,height:400}});
 for(const asset of catalog50.assets){
  const response=await assetPage.goto(base+'/illustration-library/'+asset.source,{waitUntil:'load'});
  assert(response?.ok(),asset.id+' browser HTTP failure');
  const validity=await assetPage.evaluate(()=>{
   const svg=document.querySelector('svg');
   if(!svg)return {ok:false,reason:document.body.textContent.slice(0,100)};
   const root=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;
   const all=[...svg.querySelectorAll('[data-motif="illustration-main"]')];
   const box=all[0]?.getBBox();
   return {ok:!!box&&box.width>50&&box.height>25,
     region:box?{x:box.x,y:box.y,w:box.width,h:box.height}:null,
     view:{width:vb.width,height:vb.height},loaded:root.width>0&&root.height>0};
  });
  assert(validity.ok&&validity.loaded,asset.id+' rendered no valid geometry: '+JSON.stringify(validity));
  if(validity.region){
   const {x,y,w,h}=validity.region;
   assert(x>=-5&&y>=-5&&x+w<=645&&y+h<=405,asset.id+' spills outside 640×400 viewBox: '+JSON.stringify(validity.region));
  }
  // Per-asset screenshots are human review evidence; the test cannot judge aesthetics.
  await assetPage.screenshot({path:path.join(out,'module-'+asset.id+'.png'),animations:'disabled'});
 }
 await assetPage.goto(base+'/illustration-library/',{waitUntil:'domcontentloaded'});
 await assetPage.locator('.card').first().waitFor({timeout:10000});
 assert(await assetPage.locator('.card').count()===catalog50.assets.length,'Modular illustration gallery missing assets');
 await assetPage.close();
 // Inspect SVG geometry in its own viewBox. The browser is the authority for text bounds.
 const page=await browser.newPage({viewport:{width:760,height:430}});
 for(const p of manifest.patterns){
  await page.goto(base+'/design-system/'+p.sample,{waitUntil:'load'});
  const bad=await page.evaluate(()=>{
   const svg=document.querySelector('svg');if(!svg)return ['missing SVG'];
   const vb=svg.viewBox.baseVal;
   return [...svg.querySelectorAll('text')].filter(t=>{
    const b=t.getBBox();
    return b.width>0&&(b.x < vb.x-3||b.y < vb.y-3||b.x+b.width > vb.x+vb.width+3||b.y+b.height > vb.y+vb.height+3);
   }).map(t=>t.textContent.trim());
  });
  assert(bad.length===0,p.id+' has text beyond viewBox: '+bad.join(', '));
 }
 await page.close();
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
if(errors.length){errors.forEach(e=>console.error('FAIL '+e));process.exitCode=1;}
else console.log('PASS: desktop/mobile catalog, readable SVG geometry, and invisible scroll interaction; screenshot artifacts saved.');
