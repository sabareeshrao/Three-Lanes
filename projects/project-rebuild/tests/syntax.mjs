#!/usr/bin/env node
// Tests syntax safety, exact source-text preservation and color-only CSS.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=path.resolve(import.meta.dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const w={};vm.runInNewContext(read('syntax.js'),{window:w},{timeout:2000});
const syntax=w.ThreeLanesSyntax;
assert.equal(typeof syntax?.highlightLine,'function');
const unescape=v=>v.replace(/&(?:amp|lt|gt|quot|#39);/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"})[m]);
const uncolor=v=>unescape(v.replace(/<span\b[^>]*>|<\/span>/g,''));
const examples=[
 ['python','def next_token_pairs(batch: torch.Tensor) -> tuple[int, int]: # comment',['gh-keyword','gh-function','gh-comment','gh-number']],
 ['python','@pytest.mark.parametrize("rows", [[], [1, 2, 3]])',['gh-decorator','gh-string','gh-number']],
 ['toml','requires-python = ">=3.10"',['gh-key','gh-string','gh-operator']],
 ['toml','[tool.pytest.ini_options]',['gh-section']],
 ['markdown','# Heading',['gh-heading']],
 ['markdown','- **Strong** and inline code and [a link](https://github.com)',['gh-list','gh-strong','gh-link']],
 ['text','data/**/*.bin',['gh-path','gh-operator']],
 ['python','print("<img src=x onerror=alert(1)> & done")',['&lt;img','&amp;']]
];
for(const [lang,source,tokens] of examples){
 const html=syntax.highlightLine(source,lang);
 assert.equal(uncolor(html),source,'Syntax rendering changed source');
 for(const kind of tokens)assert.ok(html.includes(kind),'Missing '+kind+' from '+lang);
 assert.ok(!/<img\b|<script\b/i.test(html),'Source HTML tags must remain escaped, not executable');
}
const steps=JSON.parse(read('lessons.json')).steps;let count=0;
for(const step of steps){
 for(const source of [step.before||'',step.after||''])for(const line of source.split('\n')){
  assert.equal(uncolor(syntax.highlightLine(line,step.language)),line,'Source changed '+step.id);
  count++;
 }
 for(const row of step.patchLines){
  assert.equal(uncolor(syntax.highlightLine(row.text,step.language)),row.text,'Diff changed '+step.id);
  count++;
 }
}
const app=read('app.js'),html=read('index.html'),css=read('github-theme.css');
assert.ok(app.includes('colorize(line,step)'),'Before and After not colored');
assert.ok(app.includes('colorize(row.text,step)'),'Commit changes not colored');
assert.ok(app.includes('ThreeLanesSyntax.highlightBlock'),'Runtime code not colored');
assert.ok(html.includes('class="github-dark"'),'Scoped theme absent');
assert.ok(html.indexOf('syntax.js?v=github-dark-1')<html.indexOf('app.js?v=github-dark-1'),'Wrong script order');
assert.ok(html.includes('github-theme.css?v=github-dark-1'),'Palette not loaded');
for(const c of ['#0d1117','#161b22','#30363d','#c9d1d9','#ff7b72','#a5d6ff','#d2a8ff','#79c0ff','#8b949e'])assert.ok(css.includes(c),'Missing '+c);
const declarations=[...css.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/(?:\{|;)\s*([\w-]+)\s*:/g)].map(x=>x[1]);
const allowed=new Set(['background','background-color','color','border-color','box-shadow','outline-color']);
const invalid=declarations.filter(name=>!allowed.has(name)&&!name.startsWith('--gh-'));
assert.deepEqual(invalid,[],'Palette may not change geometry: '+invalid.join(','));
console.log('PASS: GitHub Dark palette, exact source text, all 3 code modes and '+count+' source/diff lines.');
