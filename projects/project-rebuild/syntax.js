window.ThreeLanesSyntax=(function syntaxEngine(){
 const E=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");
 const S=(kind,v)=>'<span class="gh-token gh-'+kind+'">'+E(v)+'</span>';
 const KEY=new Set("and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case".split(" "));
 const BUILT=new Set("print len range int str float bool tuple list dict set type sum min max enumerate zip isinstance super object property ValueError RuntimeError TypeError Sequence Tensor".split(" "));
 const CONSTANT=new Set(["True","False","None","NotImplemented","Ellipsis","true","false"]);
 const OP=new Set("=+-*/%<>!&|^~:");
 function py(line){
  let out="",i=0,prev="";
  while(i<line.length){
   const rem=line.slice(i),ch=line[i];
   if(ch==="#"){out+=S("comment",rem);break}
   if(ch==="'"||ch==='"'){
    const delim=rem.startsWith(ch.repeat(3))?ch.repeat(3):ch;let j=delim.length,escaped=false;
    while(j<rem.length){if(delim.length===1&&rem[j]==="\\"&&!escaped){escaped=true;j++;continue}if(rem.startsWith(delim,j)&&!escaped){j+=delim.length;break}escaped=false;j++}
    out+=S("string",rem.slice(0,j));i+=j;prev="string";continue;
   }
   const decorator=rem.match(/^@[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*/);
   if(decorator){out+=S("decorator",decorator[0]);i+=decorator[0].length;prev="decorator";continue}
   const number=rem.match(/^(?:0x[0-9a-f]+|0b[01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)(?!\w)/i);
   if(number){out+=S("number",number[0]);i+=number[0].length;prev="number";continue}
   const name=rem.match(/^[A-Za-z_]\w*/);
   if(name){
    const word=name[0],next=rem.slice(word.length);let k="";
    if(KEY.has(word))k="keyword";
    else if(CONSTANT.has(word))k="constant";
    else if(prev==="def"||prev==="class")k=prev==="class"?"type":"function";
    else if(/^[A-Z]/.test(word))k="type";
    else if(BUILT.has(word))k="builtin";
    else if(/^\s*\(/.test(next))k="function";
    out+=k?S(k,word):E(word);i+=word.length;prev=word;continue
   }
   if(OP.has(ch)){let j=1;while(OP.has(line[i+j])&&j<3)j++;out+=S("operator",line.slice(i,i+j));i+=j;continue}
   out+=E(ch);i++;if(!/\s/.test(ch)&&ch!==".")prev=ch;
  }
  return out;
 }
 function md(line){
  if(/^\s*#{1,6}\s/.test(line))return S("heading",line);
  if(/^\s*```/.test(line))return S("fence",line);
  if(/^\s*>/.test(line))return S("quote",line);
  let out="",i=0,lead=line.match(/^(\s*(?:[-*+]|\d+\.)\s+)/);
  if(lead){out+=S("list",lead[0]);i=lead[0].length}
  while(i<line.length){
   let x=line.slice(i),m=x.match(/^(`+)([\s\S]*?)\1/)||x.match(/^\[[^\]]+\]\([^)]+\)/)||x.match(/^\*\*[^*]+\*\*/)||x.match(/^https?:\/\/[^\s)]+/);
   if(m){const v=m[0],k=v[0]==="`"?"inline-code":v[0]==="["||v.startsWith("http")?"link":"strong";out+=S(k,v);i+=v.length;continue}
   out+=E(line[i++]);
  }
  return out;
 }
 function toml(line){
  const section=line.match(/^(\s*)(\[[^\]]+\])(\s*(?:#.*)?)$/);
  if(section)return E(section[1])+S("section",section[2])+(section[3].trim().startsWith("#")?S("comment",section[3]):E(section[3]));
  const key=line.match(/^(\s*)([A-Za-z0-9_.-]+)(\s*=\s*)(.*)$/);
  return key?E(key[1])+S("key",key[2])+S("operator",key[3])+py(key[4]):py(line);
 }
 function ignore(line){if(line.startsWith("#"))return S("comment",line);return [...line].map(c=>c==="*"||c==="?"?S("operator",c):c==="/"?S("path",c):E(c)).join("")}
 function sh(line){const m=line.match(/^(\s*)(python|pip|source|pytest|npm|git)(?=\s|$)/);return m?E(m[1])+S("builtin",m[2])+py(line.slice(m[0].length)):py(line)}
 function highlightLine(line,lang){line=String(line??"");switch(String(lang||"").toLowerCase()){case"python":case"py":return py(line);case"markdown":case"md":return md(line);case"toml":return toml(line);case"shell":case"bash":return sh(line);case"gitignore":case"text":return ignore(line);default:return E(line)}}
 function highlightBlock(text,lang){return String(text??"").split("\n").map(line=>highlightLine(line,lang)).join("\n")}
 return Object.freeze({highlightLine,highlightBlock,escape:E});
})();
