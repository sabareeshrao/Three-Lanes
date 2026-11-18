"use strict";
const grid=document.getElementById("catalogGrid");
const filter=document.getElementById("patternFilter");
let patterns=[];
function node(tag,className,text){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;return e;}
function render(){
 const category=filter.value,items=patterns.filter(x=>category==="all"||x.category===category);
 grid.replaceChildren();
 if(!items.length){grid.append(node("p","empty","No approved patterns in this category yet. New patterns can be proposed and reviewed."));return;}
 for(const p of items){
  const card=node("article","pattern-card");
  const preview=node("div","pattern-preview");
  const image=document.createElement("img");
  image.src="../"+p.sample;image.alt=p.title+" — illustrated style specimen";image.loading="lazy";
  preview.append(image);
  const info=node("div","pattern-info"),tags=node("div","pattern-tags");
  tags.append(node("span","",p.category+" · "+p.id),node("span","approved",p.status.toUpperCase()));
  info.append(tags,node("h3","",p.title),node("p","",p.description||p.whenToUse||""));
  info.append(node("div","usage","WHEN TO USE · "+p.whenToUse));
  const link=node("a","","Open reference SVG ↗");link.href="../"+p.sample;link.target="_blank";link.rel="noopener noreferrer";
  info.append(link);card.append(preview,info);grid.append(card);
 }
}
filter.addEventListener("change",render);
fetch("../registry.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw Error("catalog HTTP "+r.status);return r.json()}).then(data=>{
 patterns=(data.patterns||[]).filter(p=>p.status==="approved");
 document.getElementById("patternCount").textContent=String(patterns.length);
 render();
}).catch(e=>{grid.replaceChildren(node("p","empty","Could not load diagram registry: "+e.message));});
