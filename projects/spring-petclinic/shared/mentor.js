/* Mentor-style beginner explanation scoped to the independent Spring Petclinic project. */
(function(){
 'use strict';
 const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[x]));
 const pom={
 '001:1.1':["This first commit is the project's starting sign. There isn't a working clinic application yet—only the README.","Read the four README lines first. You'll see Java classes, dependencies, and pages arrive in the next commit."],
 '001:2.1':["Think of Maven as the builder of the clinic application. pom.xml names the artifact and lists the ingredients that Maven needs.","Here it packages a WAR, declares Spring 2.5.6 through a shared version property, and adds JSTL, Log4j, and URL rewriting dependencies. These are build rules—not runtime method calls."],
 '001:2.2':["This part of pom.xml moves from ingredients to the build process itself.","Read Java source/target 1.5 and the Maven dependency plugin bound to the install phase. Plugins tell Maven to perform jobs at particular lifecycle stages."],
 '001:4.1':["The application is gaining capabilities. Each new dependency family serves a different purpose.","The changed XML adds file-upload libraries (commons-fileupload and commons-io), embedded HSQLDB, Tiles layout components, and Spring JavaScript. Maven resolves libraries; it isn't calling them in sequence."],
 '001:8.1':["A shared Maven property can upgrade several Spring components with one edit.","This commit changes spring.version from 2.5.6 to 3.0.0.M3 and adds a milestone repository. Maven needs somewhere to look for versions not available from its default repositories."],
 '001:9.1':["This is about the artifact's identity, not what a Java method does.","The coordinate changes from org.springframework:samples to org.springframework.samples:org.springframework.samples.petclinic. Maven uses these fields to identify the module."],
 '001:10.1':["The app compiles against a newer Servlet API while the server is still expected to provide it.","The diff changes servlet-api 2.4 to 2.5 while retaining provided scope. That keeps the Servlet API outside the packaged WAR."]
 };
 const kinds={
 build:["Treat pom.xml as a build recipe, not Java logic.","Find the changed dependency, plugin, version, or repository entry. It controls which artifact Maven builds or resolves."],
 controller:["Imagine a browser request arriving at the clinic. Which method is responsible for receiving it?","Read the changed controller and mapping lines, then trace only relationships that are actually present in the historical source."],
 domain:["Domain objects describe the people and things a clinic manages.","The changed fields and class declarations are the building blocks that other features can refer to."],
 repository:["A repository defines how domain objects can be looked up or stored.","Distinguish an interface or test stub from an actual running database. Follow the declared methods and their implementation only when source confirms it."],
 'web-config':["Configuration tells the web server and Spring how application pieces fit together.","Read the edited XML element as a wiring instruction. The diagram isn't claiming an observed HTTP request."],
 view:["A JSP or Tiles template describes how part of a page is assembled.","This UI is a teaching reconstruction. Compare its structure with the actual edited markup; it is not a historical browser screenshot."],
 style:["CSS can change how a page looks without changing Java application behavior.","Find the stylesheet selectors affected by this commit. They control spacing, typography, and visual arrangement."],
 media:["These are historical binary image files, not editable text source.","The filenames and history are real; the symbolic preview is not a substitute for original asset bytes."],
 logging:["Logging configuration controls which application messages are collected and where they go.","The changed configuration is a rule, not proof that a specific log event happened."],
 tests:["Tests describe expected behavior or the environment used to check it.","Keep test setup distinct from production code. Inspect the actual test classes or test resources."],
 ide:["Workspace settings organize a project for developer tools.","Classpaths and IDE preferences do not automatically change the behavior of a running application."],
 support:["Helper types provide reusable pieces to application code.","Start with the changed type or method. Don't assume which other classes invoke it without source evidence."],
 other:["One historic change can contain several different responsibilities.","Follow the exact changed lines below and notice what this subcommit adds or removes."]
 };
 function render(s,batch){
  const special=s.mentor&&typeof s.mentor.idea==='string'?[s.mentor.idea,s.mentor.reason]:pom[batch+':'+s.id];
  const [a,b]=special||kinds[s.category]||kinds.other;
  const t=s.sourceTargets?.[0],file=s.parts?.[0]?.path?.split('/').pop()||'source';
  const link=t?'<a href="https://github.com/spring-projects/spring-petclinic/blob/'+encodeURIComponent(t.sha)+'/'+t.path.split('/').map(encodeURIComponent).join('/')+'#L'+t.line+'" rel="noopener noreferrer" target="_blank">'+esc(t.label||file)+' · L'+t.line+' ↗</a>':'<span>'+esc(file)+'</span>';
  return '<summary class="mentor-head"><span class="mentor-icon">✦</span> MENTOR EXPLANATION <span class="mentor-id">'+esc(s.id)+'</span></summary>'+
   '<div class="mentor-content"><div class="mentor-part"><b>Why does this matter?</b><p>'+esc(a)+'</p></div>'+
   '<div class="mentor-part"><b>Now connect it to the source</b><p>'+esc(b)+'</p></div>'+
   '<div class="mentor-follow"><span>READ THE REAL CODE</span>'+link+'</div></div>';
 }
 window.THREE_LANES_MENTOR=Object.freeze({render});
})();
