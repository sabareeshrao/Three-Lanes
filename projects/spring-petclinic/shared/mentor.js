/* Commit-specific mentor notes. Every statement is built from the original changed lines;
   category-wide canned text and duplicated historical "mentor" placeholders are ignored. */
(function () {
  'use strict';
  const H=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
  const word=v=>String(v||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ');
  const name=p=>String(p||'').split('/').pop()||'historical file';
  const clean=v=>String(v||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim();
  const identify=(t)=>{
    const tag=t.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
    if(tag)return clean(tag[1]);
    const cls=t.match(/\b(?:class|interface|enum)\s+([A-Za-z_$][\w$]*)/);
    if(cls)return cls[1];
    const method=t.match(/\b(?:public|protected|private)\s+(?:(?:static|final|synchronized|abstract)\s+)*(?:[\w<>,?\[\].]+\s+)?([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/);
    if(method)return method[1]+'('+method[2]+')';
    const route=t.match(/@RequestMapping\s*\(([^)]*)\)/);
    if(route)return 'RequestMapping '+route[1];
    const prop=t.match(/<property[^>]*name\s*=\s*["']([^"']+)/);
    if(prop)return prop[1];
    const key=t.match(/^\s*([\w.:-]+)\s*=/);
    if(key)return key[1];
    const xml=t.match(/<([\w:-]+)[^>]*\b(?:name|id|path)\s*=\s*["']([^"']+)/);
    if(xml)return xml[2];
    return '';
  };
  function weight(t,cat){
    const x=t.trim(); if(!x)return -100;
    if(/^(?:\/\/|\*|<!--|-->|<\/?br\b|<li\b|<\/?div\b|<\/?span\b|<\/?td\b|<\/?tr\b|<\/?ul\b|[{};]+$)/.test(x))return 0;
    if(/^\s*(?:package |import |<\/[\w:-]+>|<\?xml\b|xmlns[:=]|\* @(?:author|since)|<!DOCTYPE|<!--)/.test(x))return 0;
    let n=2;
    if(/@RequestMapping|@GetMapping|@PostMapping|@Transactional|@Test|@Controller|@Repository|@Autowired/.test(x))n+=15;
    if(/\b(?:public|protected|private)\s+(?:static\s+)?(?:class|interface|enum|[\w<>,?\[\].]+\s+\w+\s*\()/.test(x))n+=14;
    if(/\b(?:if|return|throw|assertEquals|assertTrue|assertFalse|fail)\b|\.save\(|\.find\(|\.load\(|\.merge\(|\.execute\(|\.redirect\(/i.test(x))n+=11;
    if(/<definition\b|<put-attribute\b|<bean\b|<property\b|<artifactId>|<version>|<scope>|<goal>|<phase>|<url-pattern>|<servlet-class>|<context:|<tx:|<form:|<jsp:|<h[1-4]\b|CREATE TABLE|INSERT INTO|ALTER TABLE|SELECT\b|WHERE\b|jdbc\./i.test(x))n+=12;
    if(/^(?:\w[\w.-]*\s*=|<h[1-4]\b)/.test(x))n+=9;
    if(/\.jar|FactoryBean|DataSource|SessionFactory|EntityManager/.test(x))n+=7;
    if(/^\s*(?:\d+\s+|#|\/\*)/.test(x))n-=3;
    if(x.length>280)n-=7;
    if(cat==='other'&&/<h[1-4]\b/.test(x))n+=20;
    if(cat==='docs'&&x.length>18&&x.length<130)n+=4;
    return n;
  }
  function insight(x,part,s){
    const t=x.text.trim(),n=name(part.path),id=identify(t),cat=s.category;
    const route=t.match(/@RequestMapping\s*\((.*)\)/);
    if(route){
      const path=route[1].match(/["'](\/[^"']*)["']/);
      const verb=route[1].match(/RequestMethod\.(GET|POST|PUT|DELETE)/);
      return 'Spring uses this mapping to select a controller handler'+(path?' for '+path[1]:'')+(verb?' when the HTTP method is '+verb[1]:'')+'. A different path or HTTP method can lead to a different handler.';
    }
    if(/@(?:Get|Post|Put|Delete)Mapping/.test(t))return 'This annotation maps the specified HTTP request to the following Java handler. The path and verb are part of the API contract.';
    if(/@Transactional/.test(t))return 'This controls how Spring wraps the operation in a transaction'+(/readOnly\s*=\s*true/.test(t)?'; read-only requests are declared explicitly here':'')+'. It is not a SQL statement.';
    if(/@Autowired/.test(t))return 'Spring supplies the dependency at this injection point instead of the class constructing it directly. Check the following constructor or field to see what is required.';
    if(/@Controller/.test(t))return 'This marks the Java class as an MVC controller so Spring can discover it; the request mapping determines which URL reaches a method.';
    if(/@Repository/.test(t))return 'This class belongs to the persistence boundary. The repository annotation identifies its role to Spring; the actual storage behavior comes from its methods.';
    if(/@Test\b/.test(t))return 'JUnit will treat the following method as a test. Its assertions describe the behavior being checked; the annotation alone does not prove a test passed.';
    if(/\bassert(?:Equals|True|False|Null|NotNull|That)\s*\(/.test(t))return 'This assertion turns an expectation into a testable condition. Compare the expected and actual arguments to understand precisely what must hold.';
    if(/\b(?:if|else if)\s*\(/.test(t))return 'This condition decides whether the following block runs. The values inside the parentheses are the important inputs or validation rule.';
    if(/\breturn\b/.test(t)&&/\.getCurrentSession\(\)\.(?:load|get|merge)/.test(t))return 'The method delegates to Hibernate’s current session. The class and identifier in this statement determine which persistent entity is requested.';
    if(/\breturn\b/.test(t))return 'This is the value returned to the caller. Follow the expression on the right to identify the repository lookup, model value or view name used by the caller.';
    if(/\b(?:public|protected|private)\s+.*\b(?:class|interface|enum)\s+/.test(t)){
      return 'This declares '+(/interface\b/.test(t)?'an interface':'a type')+' named '+id+' in '+n+'. Its fields and methods define what other code can depend on; the declaration itself does not execute a request.';
    }
    if(/\b(?:public|protected|private)\s+[\w<>,?\[\].\s]+\s+\w+\s*\(/.test(t))return 'The method '+id+' is the entry point for the behavior implemented in its body. Look next for the arguments it receives and the expression it returns or changes.';
    if(/\b(?:private|protected|public)\s+[\w<>,?\[\]]+\s+\w+\s*;/.test(t))return 'This field is part of the state carried by the class. Its name and type tell you what can be remembered, not which code fills it.';
    if(/<bean\b/.test(t))return 'Spring creates or locates a component using this XML bean declaration. Other beans may refer to it; the class attribute identifies the implementation.';
    if(/<property\b/.test(t))return 'This property passes a configured value or bean reference into its parent Spring component. Changing the property affects configuration rather than Java source.';
    if(/<definition\b/.test(t))return 'Tiles declares a named view definition here. The name selects the page composition, while the parent/template determines which shared layout it extends.';
    if(/<put-attribute\b/.test(t))return 'Tiles assigns a page fragment to a layout slot here. That is how the same layout can display different content without duplicating its header.';
    if(/<artifactId>/.test(t))return 'Maven identifies the library or build plugin by its artifact ID. Dependencies must be resolved before the project can compile or package correctly.';
    if(/<version>/.test(t)||/<spring\.version>/.test(t))return 'This value chooses a library or project version. A changed version can affect compatibility even when no application method changes.';
    if(/<scope>/.test(t))return 'Maven scope decides where a dependency is available: for example, test-only or provided by the deployment container.';
    if(/<phase>|<goal>/.test(t))return 'The build lifecycle runs goals in configured phases. This entry changes when Maven performs a specific build action.';
    if(/<url-pattern>|<servlet-class>|<listener-class>/.test(t))return 'The deployment descriptor uses this entry to connect web startup or URL dispatch to a servlet or listener.';
    if(/<(?:form:|jsp:|c:)/.test(t))return 'This JSP tag performs view-level binding, templating or conditional rendering. Check its attributes to see which field or model value is involved.';
    if(/<h[1-4]\b/.test(t))return cat==='other'?'This heading marks the subject introduced in the historical tutorial. It documents a concept; it does not execute application code.':'The JSP/HTML heading identifies content presented to the user, rather than changing a backend endpoint.';
    if(/<a\s|<c:url|href=/.test(t))return 'This markup defines a navigation link or target URL. Adding or removing it changes the available navigation, not the underlying controller implementation.';
    if(/^jdbc\.[\w.]+\s*=/.test(t))return 'This JDBC property tells the application where to find a database resource. A classpath path must match the actual packaged resource location.';
    if(/^[\w.-]+\s*=/.test(t)&&(/messages[^/]*\.properties/.test(n)))return 'This entry maps a message key to display text. Localized bundles let the application show the same message key in different languages.';
    if(/^[\w.-]+\s*=/.test(t))return 'The left-hand key identifies a configuration setting; the value on the right is what the framework or tool will read.';
    if(/CREATE\s+TABLE/i.test(t))return 'This SQL command defines a table. Column definitions and constraints in the following lines determine which records the database can store.';
    if(/INSERT\s+INTO/i.test(t))return 'This SQL statement seeds rows into the named table. Those are data changes, separate from Java repository method implementations.';
    if(/\.jar!|jar:\/\//.test(t))return 'This IDE module entry points to a dependency JAR. It affects what the editor resolves on the project classpath, not a new user-facing page.';
    if(/\bnew\s+\w+\s*\(/.test(t))return 'The new expression constructs an object. The constructor arguments show what information it needs at creation time.';
    if(/<%@\s*(?:include|taglib)/.test(t))return 'This JSP directive imports a shared fragment or tag library so the view can reuse tags and layout pieces.';
    if(/<\w/.test(t)&&/\.xml$/.test(n))return 'This XML element contributes to '+n+' configuration. Its attributes and nesting decide which component or resource is affected.';
    if(/\.jsp$/.test(n)||/\.html$/.test(n))return 'This line belongs to the presentation or tutorial document. Read the visible text or tag attributes to see precisely what the user or reader receives.';
    if(cat==='docs'||/\.txt$|\.md$/.test(n))return 'This is a documented statement in '+n+', not an executed method. Use it to understand the historical project setup or the feature being described.';
    if(/\.java$/.test(n))return 'This Java statement contributes to the implementation of '+n+'. The identifiers here show the specific state, method or dependency involved.';
    return 'This line belongs to '+n+'. Its value matters because the surrounding file is part of the build, application wiring, user interface or test setup shown here.';
  }
  const curated={
    '001:1.1':['The repository begins with a README, not a functioning clinic. The first four lines merely name the sample and its purpose.','The useful distinction is between a project description and executable code: there are no Java types, endpoints or persistence classes in this first snapshot.'],
    '001:2.1':['Maven now knows what to build: a WAR named samples, with Spring 2.5.6 and a declared set of library dependencies.','Follow <packaging>war</packaging> and the shared spring.version property. The dependencies resolve tools the app can use; these declarations are not a runtime execution sequence.'],
    '001:2.2':['The same pom.xml now defines the build procedure after the dependency list: Java 1.5 compilation and a Maven dependency-plugin goal.','Read the source/target compiler entries and the install-phase execution. Changing a plugin phase affects the build, whereas changing a controller mapping affects requests.'],
    '001:2.3':['Two controllers are introduced: the root home handler and the owner-detail handler.','Watch how @RequestMapping connects a URL and HTTP method to a Java method. OwnerController delegates the owner lookup to its injected repository.'],
    '001:2.4':['Owner collection and pet-detail routes arrive in separate controller classes.','Notice the difference between GET for reading an owner or pet and POST/PUT for storing it. The changed routes are different even when they reuse repository objects.'],
    '002:11.1':['The old InternalResourceViewResolver mapping to /WEB-INF/*.jsp is removed from MVC configuration.','A Tiles-oriented resolver is already present in the surrounding XML. Removing the older resolver reduces competing JSP-resolution paths; this diff does not demonstrate an actual browser request.'],
    '002:12.1':['Owner controllers move from the owner package to owners; the pet controller moves under owners.pets.','This is a Java namespace and source-path change, not a new endpoint by itself. Imports and code referring to those classes must use the new package.'],
    '002:13.1':['The navigation JSP loses its Register and Pets links while retaining Sign In.','The visible menu becomes smaller, but removing an anchor from page.jsp does not prove those backend URLs disappeared. Compare deleted and retained <li> entries.'],
    '002:16.3':['OwnerController now explicitly receives the owner path variable, populates a Spring Model, and returns a view name.','Instead of implicitly returning an Owner object, the handler uses model.addAttribute(...) and returns "owner". That separates fetching the domain object from choosing the view.'],
    '002:17.3':['AppointmentForm introduces the fields used to collect a requested visit, including doctor, owner, pet, date, time and notes.','This is a form-backing object. It gathers input in memory; a field declaration does not schedule an appointment or write a database row.'],
    '002:19.43':['OwnerValidator checks owner fields such as firstName, lastName and address for missing text.','Validation is a separate decision from persistence. The Errors object collects which user inputs must be corrected before a successful save.'],
    '002:19.46':['The Hibernate implementation adds pet loading and owner persistence methods.','The code uses the current Session and calls merge(owner). Notice that Hibernate merge can return a managed copy; it does not simply attach the original argument.'],
    '002:20.2':['Database setup scripts are renamed into the hsqldb resource folder without text edits in this historical diff.','A rename-only step has no added SQL statements to teach. Check the old and new resource paths, then match them to jdbc.properties in the next subcommit.'],
    '002:20.3':['jdbc.properties changes the classpath locations used to load the HSQLDB schema, seed data and drop-table scripts.','This change matters because a database initializer must find those files inside the packaged resources. The paths and renamed files must agree.']
  };
  function pick(s){
    const parts=Array.isArray(s.parts)?s.parts:[];
    const choices=[];
    for(const p of parts)for(const row of p.rows||[]){
      if(row.type!=='add'&&row.type!=='del')continue;
      const text=String(row.text||'').trim();
      if(!text)continue;
      choices.push({part:p,row,text,score:weight(text,s.category)+(row.type==='add'?1:0)});
    }
    choices.sort((a,b)=>b.score-a.score || (a.row.new||a.row.old||0)-(b.row.new||b.row.old||0));
    const chosen=[],used=new Set();
    function add(c){
      const key=c.part.path+'|'+c.row.type+'|'+c.text;
      if(used.has(key))return;
      chosen.push(c);used.add(key);
    }
    if(choices.length)add(choices[0]);
    if(choices.some(x=>x.row.type==='del')&&choices.some(x=>x.row.type==='add')){
      const other=choices.find(x=>x.row.type!==chosen[0].row.type);
      if(other)add(other);
    }
    const diverse=choices.find(x=>!used.has(x.part.path+'|'+x.row.type+'|'+x.text)&&!chosen.some(y=>y.part.path===x.part.path)&&x.score>2);
    if(diverse)add(diverse);
    for(const c of choices)if(chosen.length<3&&c.score>0)add(c);
    return chosen.slice(0,3);
  }
  function render(s,batch){
    const parts=Array.isArray(s.parts)?s.parts:[];
    const sourceReady=!s.partsUrl||!!s.partsLoaded;
    const id=batch+':'+s.id;
    let content;
    if(!sourceReady){
      content='<div class="mentor-part"><b>Inspecting this historical subcommit</b><p>The explanation opens after its exact changed-source slice is loaded.</p></div>';
    } else {
      const anchors=pick(s);
      const totalAdds=parts.flatMap(p=>p.rows||[]).filter(r=>r.type==='add').length;
      const totalDels=parts.flatMap(p=>p.rows||[]).filter(r=>r.type==='del').length;
      const files=[...new Set(parts.map(p=>name(p.path)))];
      const renamed=parts.filter(p=>p.renameOnly||(!p.rows?.length&&p.oldPath&&p.oldPath!==p.path));
      const main=anchors[0];
      const special=curated[id];
      const fileIntro=files.length===1?files[0]:files.length>1?files.slice(0,3).join(', ')+(files.length>3?' and '+(files.length-3)+' more':''):'the selected files';
      let change;
      if(special)change=special[0];
      else if(renamed.length&&!anchors.length)change=renamed.map(p=>name(p.oldPath||p.path)+' → '+name(p.path)).join('; ')+'. This slice records file moves, not changed SQL or Java text.';
      else if(main){
        const idn=identify(main.text),kind=main.row.type==='del'?'removes':'adds';
        change='In '+fileIntro+', this slice '+kind+(idn?' '+idn:' a concrete source statement')+'. The historical diff contains '+totalAdds+' added and '+totalDels+' removed text lines.';
      }else change='This historical slice changes '+fileIntro+' without a text source line to quote. Inspect the original file or asset names rather than assuming behavior.';
      const why=special?special[1]:main?insight(main.text?{text:main.text}:main.row,main.part,s):renamed.length?'The important effect is the new resource path. The application configuration or build references must resolve the moved file under that name.':'No executable line was introduced in this slice; the related original commit shows the actual non-text change.';
      content='<div class="mentor-part"><b>What actually changed</b><p>'+H(change)+'</p></div>'+
        '<div class="mentor-part"><b>Why this matters</b><p>'+H(why)+'</p></div>';
      if(anchors.length){
        content+='<div class="mentor-part"><b>Check the actual changed lines</b><div class="mentor-evidence">'+anchors.map(({part,row,text})=>{
          const after=row.type==='add';
          const sha=after?s.sha:s.parentSha;
          const path=after?part.path:(part.oldPath||part.path);
          const line=after?row.new:row.old;
          const href=sha&&path&&Number.isInteger(line)?'https://github.com/spring-projects/spring-petclinic/blob/'+encodeURIComponent(sha)+'/'+path.split('/').map(encodeURIComponent).join('/')+'#L'+line:null;
          const pfx=after?'+':'−';
          return '<div class="mentor-code-line"><span class="mentor-change-marker '+(after?'added':'removed')+'">'+pfx+'</span><div><small>'+H(name(path))+(line?' · L'+line:'')+'</small><code>'+H(text)+'</code></div>'+(href?'<a target="_blank" rel="noopener noreferrer" href="'+H(href)+'" aria-label="Open this exact source line on GitHub">↗</a>':'')+'</div>';
        }).join('')+'</div></div>';
      }else if(renamed.length){
        content+='<div class="mentor-part"><b>Renamed paths</b><p>'+renamed.map(p=>H(p.oldPath)+' → '+H(p.path)).join(' · ')+'</p></div>';
      }
      if(s.sourceTargets?.length){
        const t=s.sourceTargets[0],href='https://github.com/spring-projects/spring-petclinic/blob/'+encodeURIComponent(t.sha)+'/'+t.path.split('/').map(encodeURIComponent).join('/')+'#L'+t.line;
        content+='<div class="mentor-follow"><span>EXPLORE THE FULL SOURCE</span><a href="'+H(href)+'" target="_blank" rel="noopener noreferrer">'+H(t.label||name(t.path))+' · L'+H(t.line)+' ↗</a></div>';
      }
    }
    return '<summary class="mentor-head"><span class="mentor-icon">✦</span><span>Mentor · '+H(s.title)+'</span><span class="mentor-id">'+H(s.id)+'</span></summary><div class="mentor-content">'+content+'</div>';
  }
  window.THREE_LANES_MENTOR=Object.freeze({render});
})();