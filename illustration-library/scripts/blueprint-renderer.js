(function blueprintEngine(){
 const P={blue:"#5675C9",green:"#41917F",red:"#C9546D",ink:"#283A5E",edge:"#839EC7",muted:"#A8BDD9",pale:"#E7F0FC"};
 const r=(x,y,w,h,rad=6,fill="#fff",stroke=P.edge,s=1.7)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${s}"/>`;
 const l=(d,col=P.edge,s=1.8,extra="")=>`<path d="${d}" fill="none" stroke="${col}" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
 const c=(x,y,rad,fill="#fff",stroke=P.edge,s=1.6)=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${s}"/>`;
 const e=x=>String(x).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
 const t=(x,y,v,size=12,col=P.ink)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="650" fill="${col}">${e(v)}</text>`;
 const g=(x,y,s,body)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
 const arrow=(d,col=P.blue)=>l(d,col,2)+l("M-7 -5L0 0L-7 5",col,2);
 const M={
 browser:()=>g(24,18,.95,r(0,0,163,118,10)+l("M0 30H163","#C2D2E6",1.5)+[0,1,2].map((i)=>c(13+i*15,15,3.8,["#D48E92","#E1C76C","#8DBFA9"][i],"none",0)).join("")+r(60,7,88,16,5,"#F1F5FB","#D8E5F3",1)+r(17,46,127,10,2,"#E0E9F7","none",0)+r(17,67,105,9,2,"#E7EEF8","none",0)+r(17,89,55,16,4,"#DFEAF9","none",0)),
 server:()=>g(67,15,.99,r(0,0,86,115,9)+[0,1,2].map(i=>r(12,13+i*32,62,25,4,"#EFF4FC","#B1C7E0",1.3)+[0,1,2].map(j=>l(`M23 ${21+i*32+j*5}H45`,"#9BB4D5",1.3)).join("")+c(65,26+i*32,3,i===1?P.green:P.blue,"none",0)).join("")),
 controller:()=>g(72,14,1,r(0,0,76,118,8)+r(17,14,43,90,5,"#FAFCFF","#BCD0E8",1.2)+[0,1,2].map(i=>r(24,24+i*25,29,17,3,"#EDF4FC","#CCDBEC",1)+c(30,32+i*25,2.5,i===1?P.green:P.blue,"none",0)+l(`M36 ${32+i*25}H48`,"#A5BAD8",1.5)).join("")),
 db:()=>g(63,19,1,`<path d="M1 25C1 4 93 4 93 25V96C93 119 1 119 1 96Z" fill="#E7F1FC" stroke="${P.edge}" stroke-width="1.9"/><ellipse cx="47" cy="25" rx="46" ry="17" fill="#DEEAF9" stroke="${P.edge}" stroke-width="1.9"/>`+[56,88].map(y=>l(`M1 ${y}C1 ${y+20} 93 ${y+20} 93 ${y}`,P.edge,1.6)).join("")),
 chip:()=>g(72,18,1,r(0,0,77,105,6,"#E8F1FC")+r(15,16,47,74,4,"#D7E8F9","#B0CAE4",1)+[0,1,2,3,4].map(i=>l(`M${14+i*12} -8V0M${14+i*12} 105V113M-9 ${16+i*18}H0M77 ${16+i*18}H86`,P.edge,1.7)).join("")+t(38,59,"CPU",12)),
 ram:()=>g(33,42,1,`<path d="M0 24H149V82H91L82 75H67L58 82H0Z" fill="#E6F4EF" stroke="${P.green}" stroke-width="1.8"/>`+[0,1,2,3,4].map(i=>r(13+i*26,37,20,32,3,"#E7F0FA","#90AAC9",1.1)).join("")+[0,1,2,3,4,5,6,7,8,9,10].map(i=>r(10+i*12,79,5,8,1,"#CEB477","none",0)).join("")),
 disk:()=>g(65,20,1,r(0,0,91,106,10,"#F5F9FD")+c(46,48,35,"#E4EFF9","#91B0D0",1.7)+c(46,48,11,"#fff","#84A6C7",1.4)+l("M47 48L80 79L67 84","#789BC0",2)),
 table:()=>g(47,18,1,r(0,0,126,110)+r(0,0,126,26,3,"#E2ECFA")+[1,2,3].map(i=>l(`M0 ${26+20*i}H126`,"#B8CAE1",1.3)).join("")+l("M42 26V110M84 26V110","#B8CAE1",1.4)),
 code:()=>g(65,12,1,`<path d="M0 0H64L91 27V124H0Z" fill="#fff" stroke="${P.edge}" stroke-width="1.7"/><path d="M64 0V27H91" fill="#EDF3FC" stroke="${P.edge}" stroke-width="1.5"/>`+t(45,78,"</>",19,P.blue)+l("M15 93H74M15 108H63","#B2C6DE",2)),
 file:()=>g(65,11,1,`<path d="M0 0H65L91 27V124H0Z" fill="#fff" stroke="${P.edge}" stroke-width="1.7"/><path d="M65 0V27H91" fill="#EDF3FC" stroke="${P.edge}" stroke-width="1.4"/>`+[0,1,2,3].map(i=>l(`M16 ${46+i*18}H${i===3?51:73}`,"#ADC3DC",2.1)).join("")),
 folder:()=>`<path d="M35 44H92L104 33H180V125H35Z" fill="#EAF2FC" stroke="${P.edge}" stroke-width="1.8"/><path d="M35 45H180V63H35Z" fill="#DCE9F9" stroke="${P.edge}" stroke-width="1.2"/>`,
 cloud:()=>`<path d="M59 121C35 121 29 100 44 84C54 77 66 75 78 78C81 54 94 39 115 39C137 39 151 53 155 74C176 70 190 86 186 104C184 117 170 121 157 121Z" fill="#E8F2FD" stroke="${P.edge}" stroke-width="1.8"/>`,
 queue:()=>g(36,39,1,r(0,0,148,79,7,"#F9FBFF")+[0,1,2].map(i=>r(12+i*44,19,36,40,4,i===2?"#E9F6EF":"#E5F0FC",i===2?P.green:"#9EBDDB",1.3)).join("")+l("M15 65H133","#AAC2DF",1.5)),
 network:()=>c(109,74,25,"#E9F1FC",P.blue,1.5)+[0,1,2,3].map(i=>{const p=[[56,43],[161,42],[56,119],[164,119]][i];return c(p[0],p[1],13,"#F5FAFE",P.edge,1.5)+l(`M${p[0]<110?p[0]+14:p[0]-14} ${p[1]}L${p[0]<110?90:128} ${p[1]<74?67:84}`,P.edge,1.6)}).join(""),
 phone:()=>g(80,9,1,r(0,0,60,125,11,"#29466D","#7695BB",1.9)+r(6,8,48,109,8,"#F8FBFE","#D4E3F2",1)+r(19,12,22,5,2,"#29466D","none",0)+r(13,33,34,18,3,"#DDEBF9","none",0)+[0,1,2].map(i=>r(13,59+i*17,34,11,3,"#E7F0FA","none",0)).join("")),
 user:()=>c(110,52,21,"#E8F1FC",P.edge,1.7)+`<path d="M59 126C62 91 85 80 110 80S158 91 161 126Z" fill="#E8F1FC" stroke="${P.edge}" stroke-width="1.8"/>`,
 shield:()=>`<path d="M110 18L156 38V87Q151 119 110 141Q69 119 64 87V38Z" fill="#F0F9F5" stroke="${P.green}" stroke-width="1.9"/>`+l("M87 82L103 98L133 66",P.green,3),
 lock:()=>g(73,17,1,`<path d="M19 57V34Q19 2 41 2Q63 2 63 34V57" fill="none" stroke="${P.edge}" stroke-width="2.8"/>`+r(0,55,82,76,8,"#EAF2FC")+c(41,89,6,"#fff",P.edge,1.5)+l("M41 95V110",P.edge,2)),
 key:()=>c(79,64,21,"#F8FCFF",P.edge,2)+c(79,64,5,"none",P.edge,1.4)+l("M100 64H156V86H143V76H129V86H116",P.edge,2.4),
 globe:()=>c(110,77,54,"#EBF4FD",P.edge,1.9)+`<ellipse cx="110" cy="77" rx="24" ry="54" fill="none" stroke="#91B1D3" stroke-width="1.6"/>`+l("M56 77H164M69 48Q110 63 151 48M69 107Q110 90 151 107","#98B7D6",1.5),
 chart:()=>l("M52 23V123H175","#AABFDB",1.8)+[0,1,2,3].map(i=>r(63+i*28,99-[24,52,35,69][i],18,[24,52,35,69][i],3,["#CADFF4","#A6C6E9","#D9E7F6","#8FB5DD"][i],"none",0)).join(""),
 linechart:()=>l("M50 24V122H174","#B5C8E0",1.7)+l("M56 109L86 90L110 100L140 55L169 71",P.blue,2.2)+[[56,109],[86,90],[110,100],[140,55],[169,71]].map(v=>c(v[0],v[1],3.4,"#fff",P.blue,1.5)).join(""),
 pie:()=>c(110,75,50,"#EDF4FC",P.edge,1.6)+`<path d="M110 75L110 25A50 50 0 0 1 158 90Z" fill="#94B7E0" stroke="#fff" stroke-width="1.2"/><path d="M110 75L158 90A50 50 0 0 1 83 118Z" fill="#BCD9E9" stroke="#fff" stroke-width="1.2"/>`,
 matrix:()=>[0,1,2,3].map(i=>[0,1,2,3].map(j=>r(67+j*24,26+i*24,18,18,3,(i+j)%3===0?"#9DBFE3":"#E1EDFA","none",0)).join("")).join(""),
 neural:()=>[0,1,2].map(i=>[0,1,2].slice(0,[3,3,2][i]).map((_,j)=>c(53+i*54,38+j*(i===2?65:36),9,i===2?"#E7F5EE":"#E8F2FC",i===2?P.green:P.blue,1.4)).join("")).join("")+[0,1].map(i=>[0,1,2].map(j=>[0,1,2].slice(0,[3,2][i]).map((_,k)=>l(`M${63+i*54} ${38+j*36}L${98+i*54} ${38+k*(i===1?65:36)}`,"#B9CEE4",1.1)).join("")).join("")).join(""),
 gear:()=>c(110,76,42,"#E8F1FB",P.edge,1.8)+c(110,76,15,"#fff",P.edge,1.8)+[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return l(`M${110+40*Math.cos(a)} ${76+40*Math.sin(a)}L${110+54*Math.cos(a)} ${76+54*Math.sin(a)}`,P.edge,3.2)}).join(""),
 flask:()=>`<path d="M96 18H125M102 18V60L77 111Q72 128 91 133H132Q150 126 144 111L118 60V18" fill="#EAF7F1" stroke="${P.green}" stroke-width="1.9"/>`+l("M86 109H136",P.green,1.2)+c(109,118,4,"#9DD4BE","none",0),
 bug:()=>`<ellipse cx="110" cy="75" rx="29" ry="35" fill="#EBF3FC" stroke="${P.edge}" stroke-width="1.8"/>`+c(110,37,14,"#ECF3FC",P.edge,1.5)+l("M95 31L87 18M125 31L133 18M81 55L63 42M81 75H60M81 95L63 110M139 55L157 42M139 75H160M139 95L157 110",P.edge,1.7)+l("M110 45V107",P.edge,1.5),
 clock:()=>c(110,74,51,"#fff",P.edge,2.2)+l("M110 39V76L130 90",P.ink,2.5)+c(110,76,3.4,P.blue,"none",0),
 calendar:()=>g(62,19,1,r(0,10,96,104,8)+r(0,31,96,18,0,P.blue,"none",0)+l("M21 3V32M73 3V32",P.ink,2.8)+[0,1,2].map(i=>[0,1,2].map(j=>r(15+j*27,58+i*17,18,11,2,(i===1&&j===2)?"#C5A05B":"#DEE9F8","none",0)).join("")).join("")),
 bell:()=>`<path d="M76 101H144L135 90V60Q133 36 110 35Q87 36 85 60V90Z" fill="#E9F2FC" stroke="${P.edge}" stroke-width="1.7"/>`+c(110,110,7,"#E9F2FC",P.edge,1.3),
 search:()=>c(94,64,35,"none",P.edge,2.6)+l("M120 90L153 125",P.edge,3),
 filter:()=>`<path d="M47 29H173L130 78V111L90 135V78Z" fill="#E9F2FC" stroke="${P.edge}" stroke-width="1.9"/>`,
 tag:()=>`<path d="M57 39H132L168 76L132 114H57Z" fill="#E8F1FC" stroke="${P.edge}" stroke-width="1.8"/>`+c(77,76,7,"#fff",P.edge,1.5),
 sliders:()=>[0,1,2].map(i=>l(`M53 ${36+i*37}H167`,P.edge,1.8)+c([80,129,100][i],36+i*37,8,"#fff",P.blue,1.8)).join(""),
 list:()=>[0,1,2,3].map(i=>c(65,35+i*26,5,"#D5E6F8",P.blue,1.2)+l(`M80 ${35+i*26}H162`,"#A8BEDA",2.4)).join(""),
 flow:()=>r(36,48,55,52,7,"#E9F2FC")+r(128,48,55,52,7,"#E9F6EF",P.green)+l("M94 73H123",P.blue,1.9)+l("M116 67L123 73L116 79",P.blue,1.8),
 route:()=>l("M52 34C60 102 109 42 118 93C126 124 155 117 173 110",P.blue,2.1,'stroke-dasharray="5 5"')+c(52,34,10,"#fff",P.blue,1.6)+c(173,110,10,"#fff",P.green,1.6),
 git:()=>c(72,31,9,"#E7F0FC",P.blue,1.7)+c(72,82,9,"#E7F0FC",P.blue,1.7)+c(148,84,9,"#E9F6EE",P.green,1.7)+c(148,121,9,"#E9F6EE",P.green,1.7)+l("M72 40V73M81 82H138M148 93V112",P.edge,1.9),
 heartbeat:()=>l("M33 76H68L84 52L100 102L122 44L140 76H185",P.red,2.4),
 status:()=>c(110,75,46,"#F0F9F4",P.green,1.8)+l("M81 77L99 96L138 59",P.green,2.9),
 warn:()=>`<path d="M110 27L171 125H49Z" fill="#FFF9F0" stroke="#C58A49" stroke-width="1.8"/>`+l("M110 64V96","#C58A49",2.7)+c(110,108,3.3,"#C58A49","none",0),
 layer:()=>[0,1,2].map(i=>`<path d="M110 ${24+i*30}L165 ${53+i*30}L110 ${81+i*30}L55 ${53+i*30}Z" fill="${["#EAF3FC","#DFEDFA","#D6E7F8"][i]}" stroke="${P.edge}" stroke-width="1.5"/>`).join(""),
 grid:()=>[0,1,2].map(i=>[0,1,2].map(j=>r(65+j*31,24+i*31,24,24,3,(i+j)%2?"#E7F0FA":"#D9E9F9","#9DB9D8",1)).join("")).join(""),
 wave:()=>l("M28 76Q50 26 72 76T116 76T160 76T204 76",P.blue,2.3)+l("M28 95Q50 45 72 95T116 95T160 95T204 95","#B1CAE8",1.7),
 eye:()=>`<path d="M38 76Q110 13 182 76Q110 137 38 76Z" fill="#F6FAFF" stroke="${P.edge}" stroke-width="1.8"/>`+c(110,76,27,"#E0EEFC",P.edge,1.6)+c(110,76,12,P.blue,"none",0),
 container:()=>r(44,24,132,103,8,"#E8F2FC")+[0,1,2,3,4].map(i=>l(`M${64+i*22} 35V116`,"#AEC5DD",1.8)).join(""),
 bucket:()=>`<path d="M62 47H157L147 119Q110 141 73 119Z" fill="#E7F2FC" stroke="${P.edge}" stroke-width="1.8"/><ellipse cx="109" cy="46" rx="47" ry="16" fill="#DCEBF9" stroke="${P.edge}" stroke-width="1.6"/>`+l("M76 82Q109 97 144 82",P.edge,1.5),
 wrench:()=>`<path d="M131 30A29 29 0 0 0 95 70L59 107Q45 124 57 136Q73 146 84 126L118 86A29 29 0 0 0 163 54L144 72L124 60Z" fill="#E7F0FA" stroke="${P.edge}" stroke-width="1.8"/>`,
 rocket:()=>`<path d="M104 28Q135 42 149 79L126 102L88 65Q88 44 104 28Z" fill="#EAF2FC" stroke="${P.edge}" stroke-width="1.8"/>`+c(119,64,12,"#fff",P.blue,1.5)+l("M90 81L71 104M100 109L87 130",P.orange,2),
 spark:()=>[0,1,2,3].map(i=>{const [x,y,q]=[[111,52,19],[154,77,12],[88,109,14],[59,67,9]][i];return `<path d="M${x} ${y-q}L${x+q/3} ${y-q/3}L${x+q} ${y}L${x+q/3} ${y+q/3}L${x} ${y+q}L${x-q/3} ${y+q/3}L${x-q} ${y}L${x-q/3} ${y-q/3}Z" fill="#E0EDFC" stroke="${P.blue}" stroke-width="1.5"/>`}).join("")
 };
 const miniArt=(symbol)=>{const colors={check:P.green,error:P.red,add:P.blue,arrow:P.blue};const clr=colors[symbol]||P.blue;
  if(symbol==="check")return c(166,31,13,"#EDF8F0",P.green,1.2)+l("M160 31L165 36L173 25",P.green,1.9);
  if(symbol==="error")return c(166,31,13,"#FFF1F3",P.red,1.2)+l("M161 26L171 36M171 26L161 36",P.red,1.9);
  if(symbol==="add")return c(166,31,13,"#EDF4FD",P.blue,1.2)+l("M159 31H173M166 24V38",P.blue,1.7);
  if(symbol==="arrow")return l("M150 31H178",P.blue,1.9)+l("M171 25L178 31L171 37",P.blue,1.8);
  const sub=M[symbol]||M.file;return g(127,5,.33,sub());
 };
 const art=(item)=>{const base=M[item.motif]();const mini=miniArt(item.mini);const label=(item.label||"").slice(0,9);
 const color=item.mini==="error"?P.red:item.mini==="check"?P.green:P.blue;
 // Tag at bottom is a secondary annotation, not a text box pretending to be the diagram.
 const badge=label?r(110-Math.max(21,label.length*4.1+8),133,Math.max(42,label.length*8.2+16),20,5,"#fff","#D5E2F1",1)+t(110,147,label,10.5,color):"";
 return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="160" viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet" role="img" aria-labelledby="${item.id}-title ${item.id}-desc" data-tl-illustration-id="${item.id}" data-design-version="1"><title id="${item.id}-title">${e(item.title)}</title><desc id="${item.id}-desc">${e(item.title)} illustrated as a minimal Petclinic-style reusable vector for ${item.category}.</desc><g data-motif="illustration-main" font-family="-apple-system,BlinkMacSystemFont,Inter,Arial,sans-serif">${base}${mini}${badge}</g></svg>`};
 return {art,motifs:Object.keys(M)};
})()