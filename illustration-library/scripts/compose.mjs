/**
 * Build a new SVG from arbitrary independent illustrations. No whitelist.
 * The caller may add brand-new SVG fragments, paths, and labels as well.
 */
const escapeXml=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const name=v=>String(v).trim().toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')||'custom-diagram';
const number=(v,fallback)=>Number.isFinite(Number(v))?Number(v):fallback;
export function composeSvg({id,title,description='',width=1100,height=550,elements=[]}={}){
 const diagramId=name(id||title||'custom-diagram');
 const w=Math.max(1,number(width,1100)),h=Math.max(1,number(height,550));
 const pieces=elements.map(e=>{
   if(e.type==='asset'){
     // Embedded SVGs remain full vector images and can use ANY source URL, not just catalog IDs.
     const x=number(e.x,0),y=number(e.y,0),iw=Math.max(1,number(e.width,300)),ih=Math.max(1,number(e.height,190));
     return '<image href="'+escapeXml(e.src||'')+'" x="'+x+'" y="'+y+'" width="'+iw+'" height="'+ih+'" preserveAspectRatio="xMidYMid meet"/>';
   }
   if(e.type==='label'){
     return '<text x="'+number(e.x,0)+'" y="'+number(e.y,0)+'" font-size="'+Math.max(10,number(e.size,16))+'" fill="'+escapeXml(e.color||'#263D55')+'" font-family="Arial,sans-serif">'+escapeXml(e.text||'')+'</text>';
   }
   if(e.type==='path'){
     return '<path d="'+escapeXml(e.d||'')+'" fill="'+escapeXml(e.fill||'none')+'" stroke="'+escapeXml(e.stroke||'#306BAF')+'" stroke-width="'+number(e.strokeWidth,3)+'" stroke-linejoin="round" stroke-linecap="round"/>';
   }
   // Additional types may be added without modifying a central approved-pattern list.
   return '';
 }).join('');
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="'+diagramId+'-title '+diagramId+'-desc" data-tl-diagram-id="'+diagramId+'" data-design-version="1">'
 +'<title id="'+diagramId+'-title">'+escapeXml(title||diagramId)+'</title><desc id="'+diagramId+'-desc">'+escapeXml(description||'Custom composition')+'</desc>'
 +pieces+'</svg>';
}
