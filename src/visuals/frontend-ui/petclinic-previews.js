/* Each teaching step renders ONLY its changed component; no prebuilt whole-app shell. */
(function(){
const E=(s)=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const small=(text)=>`<p class="micro-note">${E(text)}</p>`;
function form(name,fields,button='Submit'){return `<form class="micro-form" id="${name}">${fields}<button type="submit" class="micro-primary">${button}</button></form>`}
const field=(label,input)=>`<label class="micro-label">${label}${input}</label>`;
function miniTable(striped){return `<div class="micro-tableclip"><div class="micro-overline">OWNERS / TABLE REGION</div><h3 class="micro-heading">Owners</h3><table class="micro-table ${striped?'striped':''}"><thead><tr><th>Name</th><th>City</th></tr></thead><tbody><tr><td>George Franklin</td><td>Madison</td></tr><tr><td>Betty Davis</td><td>Sun Prairie</td></tr><tr><td>Jeff Black</td><td>Denver</td></tr></tbody></table></div>`}

function preview(ctx){const {mode,ci,si,c,s,message,userData,daysFromNow,previewMode}=ctx;const after=previewMode!=='before',n=ci+1,k=si+1;
const theme='';let stage='',title='Component';const samplePaw='<span class="micro-paw">🐾</span>';
if(mode!=='demo'){
 const hint=s.feature||'internal';
 if(s.visualImpact&&Array.isArray(s.demoIndex)){
   // Reuse the small, focused reconstruction for a recognizable effect.
   // It is not a claim that the frontend file changed in this commit.
   const focused=preview({...ctx,mode:'demo',ci:s.demoIndex[0],si:s.demoIndex[1]});
   return focused.replace('ONE CHANGE AT A TIME','LIVE COMMIT · RECONSTRUCTED EFFECT')
     .replace(/<span class="micro-step">[^<]*<\/span>/,`<span class="micro-step">${E((c.sha||'').slice(0,8))}</span>`)
     .replace(/<div class="micro-progress">[\s\S]*?<\/div>\s*<\/div>$/, '</div>');
 }
 if(s.kind==='frontend'){
   const add=s.code.split('\n').filter(x=>x.startsWith('+')&&!x.startsWith('+++')).join('\n');
   const text=add||s.code;
   title=s.feature==='css'?'CSS rule · visual surface':s.feature==='script'?'Client behavior · interactive region':'Changed template region';
   let details='';
   const button=/<button\b[^>]*>([^<]{1,40})/i.exec(text);
   const heading=/<h[1-4]\b[^>]*>([^<]{1,55})/i.exec(text);
   const fieldInput=/<input\b/i.test(text);
   const nav=/nav|menu|header/i.test(s.file);
   const table=/\btable\b|<th\b|table-striped/i.test(text+' '+s.file);
   if(button)details=`<div class="micro-overline">CHANGED BUTTON</div><div class="micro-solo"><button class="micro-primary micro-large" type="button" data-micro="action" data-label="${E(button[1])}">${E(button[1])}</button></div>`;
   else if(table)details=`<div class="micro-overline">CHANGED TABLE REGION</div>${miniTable(/striped/i.test(text))}`;
   else if(heading)details=`<div class="micro-overline">CHANGED HEADING</div><h3 class="micro-heading">${E(heading[1])}</h3>`;
   else if(fieldInput)details=`<div class="micro-overline">CHANGED FORM CONTROL</div><div class="micro-form"><label class="micro-label">Input field <input placeholder="Field shown in the selected diff" /></label></div>`;
   else if(nav)details=`<div class="micro-overline">LAYOUT / NAVIGATION CHANGE</div><nav class="micro-singlemenu"><span class="micro-house">⌂</span><b>Petclinic menu</b></nav>`;
   else if(s.feature==='css')details=`<div class="micro-overline">CSS SOURCE CHANGE</div><div class="micro-tableclip"><div class="micro-spaced"><h3 class="micro-heading">Styled component</h3><div class="micro-bar"/><div class="micro-bar short"/></div></div>`;
   else details=`<div class="micro-overline">PRESENTATION SOURCE CHANGED</div><div class="micro-fileicon">&lt;/&gt;</div>`;
   stage=details;
 }else{
   title=s.feature==='test'?'Automated test · no UI modification':s.feature==='database'?'Database schema · no new UI':'Internal implementation · no UI change';
   stage=`<div class="micro-empty"><div class="micro-glyph">${s.feature==='database'?'◉':s.feature==='test'?'✓':'⌘'}</div><h3>${E(s.file.split('/').pop())}</h3><p>This specific file does not modify a frontend component. Its code and architectural consequences are shown on the left. If another file in this commit changes a template, select its substep.</p></div>`;
 }
}else if(n===1){
 if(k===1){title='Bootstrap becomes available';stage=`<div class="micro-dependency"><div class="micro-hexagon">B</div><div class="micro-arrow">→</div><div class="micro-fileicon">.css</div></div><h3 class="micro-center">A dependency was added</h3>${small('No new screen or button was built in this substep. Bootstrap is now available to the project.')}`}
 if(k===2){title='Owner table: visual styling';stage=miniTable(after)+small(after?'New table classes turn the existing rows into a striped table.':'Before: the same table without Bootstrap striped styling.')}
 if(k===3){title='Container spacing';stage=`<div class="micro-measure"><span>← 50px →</span><div class="micro-spaced" style="margin-left:${after?'50':'0'}px"><div class="micro-overline">OWNER PAGE SECTION</div><h3 class="micro-heading">Owners</h3><div class="micro-bar"/><div class="micro-bar short"/></div></div>${small(after?'The container moves right and gains top spacing.':'Before: content has no new container offset.')}`}
}else if(n===2){
 if(k===1){title='Navigation fragment';stage=`<div class="micro-overline">ONE MENU ITEM</div><nav class="micro-singlemenu"><span class="micro-house">⌂</span><b>Home</b></nav>${small('The Home item still looks the same. The commit changes its Thymeleaf fragment expression, not the UI layout.')}`}
 if(k===2){title='Owner action links';stage=`<div class="micro-overline">OWNER DETAILS / ACTION REGION</div><h3 class="micro-heading">Owner Information</h3><div class="micro-actions"><button class="micro-primary" type="button" data-micro="action" data-label="Edit Owner">Edit Owner</button><button class="micro-primary" type="button" data-micro="action" data-label="Add New Pet">Add New Pet</button></div>${small(after?'The buttons keep their appearance; their generated URLs now point to the intended owner routes.':'Before: the same buttons use older Thymeleaf URL expressions.')}`}
 if(k===3){title='Pagination links';stage=`<div class="micro-overline">OWNERS / PAGINATION ONLY</div><div class="micro-pagebar"><span>Pages:</span><button type="button" data-micro="page" data-label="1">1</button><button type="button" data-micro="page" data-label="2" class="picked">2</button><button type="button" data-micro="page" data-label="3">3</button></div><div class="micro-url">${after?'/owners?page=2':'/owners/?page=2'}</div>${small('Only the URL format changes; no unrelated page elements are drawn.')}`}
}else if(n===3){
 title='Pet birth date validation';stage=`<div class="micro-overline">PET FORM / BIRTHDATE FIELD ONLY</div>${form('microBirthForm',field('Birth date',`<input name="birth" type="date" value="${daysFromNow(3)}" />`),'Check date')}${small('Try a future date, then press Check date. The controller adds a field error.')}`
}else if(n===4){
 title='Persist an edited pet';stage=`<div class="micro-overline">EDIT EXISTING PET</div>${form('microEditForm',field('Pet name',`<input name="name" value="${E(userData.name)}"/>`)+field('Pet type',`<select name="type"><option>Dog</option><option>Cat</option></select>`),'Save changes')}${small('The patch updates the existing pet entity instead of adding another pet entry.')}`;
}else if(n===5){
 title='One button, one fix';stage=`<div class="micro-overline">VISIT FORM / SUBMIT BUTTON</div><div class="micro-solo"><button type="button" class="micro-primary micro-large" data-micro="action" data-label="Add Visit">${after?'Add Visit':' '}</button></div>${small(after?'After: localized “Add Visit” text is visible.':'Before: the button had no visible label because the expression was incorrect.')}`;
}else if(n===6){
 if(k===1){title='Default visit date';stage=`<div class="micro-overline">NEW VISIT / DEFAULT DATE</div><div class="micro-datehero"><div class="micro-calendar-icon">▦</div><div><span>New visit begins on</span><strong>${daysFromNow(after?1:0)}</strong><small>${after?'Tomorrow (new default)':'Today (previous default)'}</small></div></div>${small('This learning step changes the model default, not an entire visit screen.')}`}
 if(k===2){title='Reject today and past dates';stage=`<div class="micro-overline">VISIT DATE VALIDATION</div>${form('microVisitForm',field('Visit date',`<input type="date" name="date" value="${daysFromNow(0)}"/>`),'Validate visit')}${small('Try today. The server-side validation rejects it even if the HTML restriction is bypassed.')}`}
 if(k===3){title='Minimum selectable date';stage=`<div class="micro-overline">DATE INPUT ELEMENT</div>${form('microVisitForm',field('Visit date',`<input type="date" name="date" value="${daysFromNow(1)}" ${after?'min="'+daysFromNow(1)+'"':''}/>`),'Save visit')}${small(after?'After: the HTML input has a minimum date of tomorrow.':'Before: the input did not specify a minimum date.')}`}
 if(k===4){title='Regression test result';stage=`<div class="micro-test"><div class="micro-pass">✓</div><div><strong>VisitControllerTests</strong><p>Today’s date → field validation error</p><small>The test verifies backend behavior. No new UI component was added.</small></div></div>`}
}else if(n===7){
 if(k===1){title='Duplicate pet name error';stage=`<div class="micro-overline">NEW PET / NAME FIELD</div>${form('microDuplicateForm',field('Pet name',`<input name="name" value="buddy"/>`),'Add Pet')}${small('The sample owner already has “Buddy”. The database blocks a duplicate name for the same owner.')}`}
 if(k===2||k===3){title=k===2?'H2 uniqueness rule':'PostgreSQL uniqueness rule';stage=`<div class="micro-overline">DATABASE RULE / USER-FACING EFFECT</div><div class="micro-dupes"><span>${samplePaw} Buddy</span><span>${samplePaw} buddy</span><b>✕</b></div>${small(k===2?'Case-insensitive duplicates are blocked by the H2 constraint.':'PostgreSQL uses LOWER(name) in the unique index. The page itself gains no new widget.')}`}
 if(k===4){title='Two simultaneous writes';stage=`<div class="micro-overline">CONCURRENCY TEST</div><div class="micro-race"><span>Request A<br><b>Buddy</b></span><span class="micro-junction">⊗</span><span>Request B<br><b>buddy</b></span></div>${small('The concurrency test checks that duplicate pets cannot both be inserted.')}`}
}else if(n===8){
 title='Search trims spaces';stage=`<div class="micro-overline">OWNER SEARCH / INPUT ONLY</div>${form('microSearchForm',field('Last name',`<input name="query" value="   Davis   " />`),'Find Owner')}${small('The server now calls strip() before searching. The visible field does not need new markup.')}`;
}else if(n===9){
 if(k===1){title='One pet association';stage=`<div class="micro-overline">OWNER → PET RELATION</div><div class="micro-linkscene"><div class="micro-avatar">◉</div><div class="micro-linkline"></div><div class="micro-avatar">${samplePaw}</div></div>${small('Editing an existing pet no longer adds the same persisted pet twice to the owner’s collection.')}`}
 else if(k===2){title='Pet-name length';stage=`<div class="micro-overline">PET FORM / NAME FIELD ONLY</div>${form('microLengthForm',field('Pet name',`<input name="name" maxlength="100" value="${'A'.repeat(31)}"/>`),'Validate name')}${small('The backend rejects names longer than 30 characters; the example starts with 31.')}`}
 else{title='PetValidator test';stage=`<div class="micro-test"><div class="micro-pass">✓</div><div><strong>PetValidatorTests</strong><p>31-character name → field error</p><small>Tests add confidence, not a new page.</small></div></div>`}
}else if(n===10){
 title='Owner address and city limits';stage=`<div class="micro-overline">OWNER FORM / TWO FIELDS</div>${form('microOwnerForm',field('City (max 80)',`<input name="city" value="${'C'.repeat(81)}" />`)+field('Address (max 255)',`<input name="address" value="123 Main Street" />`),'Validate owner')}${small('The backend rejects values longer than their database columns before a server error occurs.')}`;
}
const beforeAfter=(mode==='demo'&&((n<=2&&!(n===1&&k===1))||n===5||n===6&&k===1||n===6&&k===3))?`<div class="micro-compare"><button type="button" data-micro="toggle" data-value="before" class="${!after?'chosen':''}">Before</button><button type="button" data-micro="toggle" data-value="after" class="${after?'chosen':''}">After</button></div>`:'';
return `<div class="micro-workbench"><div class="micro-header"><div><span class="micro-eyebrow">${mode==='demo'?'ONE CHANGE AT A TIME':'LIVE DIFF CONTEXT'}</span><h3>${E(title)}</h3></div><span class="micro-step">${mode==='demo'?`${n}.${k}`:'GitHub'}</span></div>${beforeAfter}<div class="micro-stage">${stage}${message?`<div class="micro-message ${message.startsWith('✓')?'ok':'err'}">${E(message)}</div>`:''}</div></div>`;
}
window.PETCLINIC_PREVIEWS={preview};
})();

