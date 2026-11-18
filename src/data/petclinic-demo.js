// Ten verified, non-consecutive commits from spring-projects/spring-petclinic.
// Source: https://github.com/spring-projects/spring-petclinic/commits
// Visualizations are teaching illustrations, not historical screenshots or running Java apps.
window.PETCLINIC_DEMO = [
 {sha:'9a77b56427760d4b9d602a9846099c3deeeef32c', date:'2013-01-14', name:'Migrate styling to Bootstrap', kind:'frontend', scene:'owners', detail:'A wide JSP/CSS change split by concept. This was an older JSP-based version of Petclinic.',
  steps:[
   {name:'Load Bootstrap via WebJars', file:'pom.xml', kind:'frontend', scene:'owners', lang:'xml', code:`<!-- Webjars (static dependencies distributed as JAR files) -->
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>bootstrap</artifactId>
    <version>2.2.1</version>
</dependency>`, explain:'The project added Bootstrap as a static dependency. The browser can now display Bootstrap-styled elements.'},
   {name:'Style owner table', file:'src/main/webapp/WEB-INF/jsp/owners/list.jsp', kind:'frontend', scene:'owners', lang:'html', code:`<div class="container">
  <h2>Owners</h2>
  <table class="table table-striped">
    <thead><tr><th>Name</th></tr></thead>
  </table>
</div>`, explain:'A striped owner table makes the changed markup visually obvious.'},
   {name:'Add container styling', file:'src/main/webapp/resources/css/petclinic.css', kind:'frontend', scene:'owners', lang:'css', code:`.container {
    padding-top: 10px;
    margin-left: 50px;
}`, explain:'Small CSS rules position the existing application; they do not replace the owner table.'}
 ]},
 {sha:'9ecdc1111e3da388a750ace41a125287d9620534',date:'2022-10-25',name:'Polish Thymeleaf templates',kind:'frontend',scene:'owners',detail:'Real Thymeleaf template edits grouped by menu, link, and pagination behavior.', steps:[
  {name:'Use explicit fragment syntax',file:'src/main/resources/templates/fragments/layout.html',kind:'frontend',scene:'owners',lang:'html',code:`<li th:replace="~{::menuItem ('/','home','home page','home','Home')}">
  <span class="fa fa-home" aria-hidden="true"></span>
  <span>Home</span>
</li>`,explain:'The Home navigation item is rendered through the Thymeleaf fragment syntax.'},
  {name:'Make owner actions link correctly',file:'src/main/resources/templates/owners/ownerDetails.html',kind:'frontend',scene:'ownerDetail',lang:'html',code:`<a th:href="@{__\${owner.id}__/edit}" class="btn btn-primary">Edit Owner</a>
<a th:href="@{__\${owner.id}__/pets/new}" class="btn btn-primary">Add New Pet</a>`,explain:'Both action buttons stay visible; their underlying URL expressions change.'},
  {name:'Fix pagination URL formatting',file:'src/main/resources/templates/owners/ownersList.html',kind:'frontend',scene:'owners',lang:'html',code:`<a th:if="\${currentPage != i}"
   th:href="@{'/owners?page=' + \${i}}">[[\${i}]]</a>`,explain:'Pagination points to /owners?page=N without an unnecessary trailing slash.'}
 ]},
 {sha:'3be289517d320a47bb8f359acc1d1daf0829ed0b',date:'2023-07-10',name:'Reject future pet birth dates',kind:'backend',scene:'pet',detail:'PetController birth-date validation. The UI visualization explains the visible effect, not a frontend commit.', steps:[
  {name:'Compare date to today',file:'src/main/java/org/springframework/samples/petclinic/owner/PetController.java',kind:'backend',scene:'pet',lang:'java',code:`LocalDate currentDate = LocalDate.now();
if (pet.getBirthDate() != null && pet.getBirthDate().isAfter(currentDate)) {
    result.rejectValue("birthDate", "typeMismatch.birthDate");
}`,explain:'The controller rejects a pet birth date that is later than today.'},
  {name:'Apply validation to pet update',file:'src/main/java/org/springframework/samples/petclinic/owner/PetController.java',kind:'backend',scene:'pet',lang:'java',code:`if (pet.getBirthDate() != null && pet.getBirthDate().isAfter(currentDate)) {
    result.rejectValue("birthDate", "typeMismatch.birthDate");
}`,explain:'The same rule is needed when editing an existing pet.'}
 ]},
 {sha:'2aa53f929d32b0d41e0fe0391b8385eabe9a3432',date:'2025-03-01',name:'Persist pet edits properly',kind:'backend',scene:'pet',detail:'Instead of appending a new pet when editing, update the existing entity.',steps:[
  {name:'Call dedicated update method',file:'src/main/java/org/springframework/samples/petclinic/owner/PetController.java',kind:'backend',scene:'pet',lang:'java',code:`updatePetDetails(owner, pet);
redirectAttributes.addFlashAttribute("message", "Pet details has been edited");
return "redirect:/owners/{ownerId}";`,explain:'An edit now delegates to a method that finds and modifies the existing pet.'},
  {name:'Update fields and save',file:'src/main/java/org/springframework/samples/petclinic/owner/PetController.java',kind:'backend',scene:'pet',lang:'java',code:`Pet existingPet = owner.getPet(pet.getId());
if (existingPet != null) {
    existingPet.setName(pet.getName());
    existingPet.setBirthDate(pet.getBirthDate());
    existingPet.setType(pet.getType());
} else {
    owner.addPet(pet);
}
this.owners.save(owner);`,explain:'The existing pet receives the new name, birthdate and type, and the owner is saved.'}
 ]},
 {sha:'f9399b7a9fe3a244ba75e83bf2bc6f2cb32b3011',date:'2025-06-14',name:'Restore Add Visit button label',kind:'frontend',scene:'visit',detail:'A one-line Thymeleaf expression fix with an immediate visible result.',steps:[
  {name:'Render localized button text',file:'src/main/resources/templates/pets/createOrUpdateVisitForm.html',kind:'frontend',scene:'visit',lang:'html',code:`<button class="btn btn-primary" type="submit"
    th:text="#{addVisit}">Add Visit</button>`,explain:'The template now uses a message key (#{addVisit}) instead of a model variable (\${addVisit}), restoring the button label.'}
 ]},
 {sha:'753d35c2f84432d88c0f3b61c9302a16069b78dd',date:'2026-06-01',name:'Validate future visit dates',kind:'both',scene:'visit',detail:'This commit touches Java controllers, model defaults, shared HTML input, translated error messages and tests.',steps:[
  {name:'Default new visit to tomorrow',file:'src/main/java/org/springframework/samples/petclinic/owner/Visit.java',kind:'backend',scene:'visit',lang:'java',code:`public Visit() {
    this.date = LocalDate.now().plusDays(1);
}`,explain:'New Visit instances start with tomorrow rather than today.'},
  {name:'Reject a non-future date',file:'src/main/java/org/springframework/samples/petclinic/owner/VisitController.java',kind:'backend',scene:'visit',lang:'java',code:`@ModelAttribute("minVisitDate")
public LocalDate minVisitDate() {
    return LocalDate.now().plusDays(1);
}
if (visit.getDate() != null && !visit.getDate().isAfter(LocalDate.now())) {
    result.rejectValue("date", "typeMismatch.visitDate");
}`,explain:'The backend validation runs even when a client bypasses HTML form restrictions.'},
  {name:'Set HTML minimum date',file:'src/main/resources/templates/fragments/inputField.html',kind:'frontend',scene:'visit',lang:'html',code:`<input th:case="'date'" class="form-control"
  type="date" th:field="*{__\${name}__}"
  th:min="\${minVisitDate}" />`,explain:'The browser receives an earliest selectable date. The server still validates it separately.'},
  {name:'Test invalid visit dates',file:'src/test/java/org/springframework/samples/petclinic/owner/VisitControllerTests.java',kind:'backend',scene:'visit',lang:'java',code:`@Test
void processNewVisitFormHasErrorsWhenVisitDateIsNotInFuture() throws Exception {
    mockMvc.perform(post("/owners/{ownerId}/pets/{petId}/visits/new", TEST_OWNER_ID, TEST_PET_ID)
       .param("date", LocalDate.now().toString()))
       .andExpect(model().attributeHasFieldErrors("visit", "date"));
}`,explain:'The test asserts that an invalid date returns a field error instead of silently saving.'}
 ]},
 {sha:'e0db9b184e028d41bcb626f3cbf03a942f67e104',date:'2026-07-16',name:'Unique pet names within each owner',kind:'backend',scene:'pet',detail:'Multi-file commit with controller errors, H2/MySQL/Postgres constraints, and concurrency tests. Split into learning steps.',steps:[
  {name:'Catch database duplicates',file:'src/main/java/org/springframework/samples/petclinic/owner/PetController.java',kind:'backend',scene:'pet',lang:'java',code:`try {
    owner.addPet(pet);
    this.owners.saveAndFlush(owner);
} catch (DataIntegrityViolationException ex) {
    if (!isDuplicatePetNameViolation(ex)) {
        throw ex;
    }
    result.rejectValue("name", "duplicate", "already exists");
    return VIEWS_PETS_CREATE_OR_UPDATE_FORM;
}`,explain:'The controller converts a duplicate-name database error into a friendly form validation error.'},
  {name:'Enforce uniqueness in H2',file:'src/main/resources/db/h2/schema.sql',kind:'backend',scene:'pet',lang:'sql',code:`CREATE TABLE pets (
  id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR_IGNORECASE(30),
  birth_date DATE,
  type_id INTEGER NOT NULL,
  owner_id INTEGER
);
ALTER TABLE pets ADD CONSTRAINT unique_owner_pet_name UNIQUE (owner_id, name);`,explain:'The database disallows case-insensitive duplicate names belonging to the same owner.'},
  {name:'Match SQL across databases',file:'src/main/resources/db/postgres/schema.sql',kind:'backend',scene:'pet',lang:'sql',code:`CREATE UNIQUE INDEX unique_owner_pet_name
  ON pets (owner_id, LOWER(name));`,explain:'PostgreSQL enforces the same rule by owner ID and lowercase pet name. MySQL has its own UNIQUE constraint.'},
  {name:'Prove concurrent requests are blocked',file:'src/test/java/org/springframework/samples/petclinic/PetClinicConcurrencyTests.java',kind:'backend',scene:'pet',lang:'java',code:`int threadCount = 2;
ExecutorService executorService = Executors.newFixedThreadPool(threadCount);
CountDownLatch readyLatch = new CountDownLatch(threadCount);
CountDownLatch startLatch = new CountDownLatch(1);
CountDownLatch doneLatch = new CountDownLatch(threadCount);`,explain:'The new test coordinates simultaneous requests to check that a race cannot create duplicate pet names.'}
 ]},
 {sha:'bb37aad8c332264723817d855e8b3b96b7c392bc',date:'2026-07-30',name:'Trim owner search whitespace',kind:'backend',scene:'search',detail:'Controller strips surrounding spaces; a new regression test checks that behavior.',steps:[
  {name:'Normalize last-name input',file:'src/main/java/org/springframework/samples/petclinic/owner/OwnerController.java',kind:'backend',scene:'search',lang:'java',code:`if (lastName == null) {
    lastName = ""; // empty string signifies broadest possible search
} else {
    lastName = lastName.strip();
}
Page<Owner> ownersResults = findPaginatedForOwnersLastName(page, lastName);`,explain:'Searching for "  Davis  " now passes "Davis" to the repository.'},
  {name:'Add regression coverage',file:'src/test/java/org/springframework/samples/petclinic/owner/OwnerControllerTests.java',kind:'backend',scene:'search',lang:'java',code:`@Test
void processFindFormIgnoresWhitespace() throws Exception {
    // Test added in the commit for padded last-name searches.
}`,explain:'Illustrative condensed test outline; open the exact GitHub patch for its full code.',illustrative:true}
 ]},
 {sha:'676db04515ee5f289641cea6cb379dc02b40f67f',date:'2026-08-26',name:'Fix pet association and name length',kind:'backend',scene:'pet',detail:'Improve Owner.addPet behavior and reject a pet name over 30 characters.',steps:[
  {name:'Avoid duplicate pet association',file:'src/main/java/org/springframework/samples/petclinic/owner/Owner.java',kind:'backend',scene:'pet',lang:'java',code:`public void addPet(Pet pet) {
    if (pet == null) return;
    if (getPets().contains(pet)) return;
    for (Pet existingPet : getPets()) {
        if (!existingPet.isNew() && !pet.isNew()
            && Objects.equals(existingPet.getId(), pet.getId())) return;
    }
    getPets().add(pet);
}`,explain:'The owner keeps one instance of an existing pet rather than appending it repeatedly.',illustrative:true},
  {name:'Limit pet name to 30 characters',file:'src/main/java/org/springframework/samples/petclinic/owner/PetValidator.java',kind:'backend',scene:'pet',lang:'java',code:`private static final int MAX_NAME_LENGTH = 30;
if (!StringUtils.hasText(name)) {
    errors.rejectValue("name", REQUIRED, REQUIRED);
} else if (name.length() > MAX_NAME_LENGTH) {
    errors.rejectValue("name", "size", "Name must be no more than 30 characters");
}`,explain:'The validator rejects names that cannot fit the database column.'}
 ]},
 {sha:'3c7ab98ae7ebb433fad746ea891fd97f5103671b',date:'2026-09-29',name:'Validate owner address and city lengths',kind:'backend',scene:'ownerDetail',detail:'Bean Validation constraints match the lengths of database columns; tests cover too-long values.',steps:[
  {name:'Add @Size to Owner properties',file:'src/main/java/org/springframework/samples/petclinic/owner/Owner.java',kind:'backend',scene:'ownerDetail',lang:'java',code:`@Column
@NotBlank
@Size(max = 255)
private String address;

@Column
@NotBlank
@Size(max = 80)
private String city;`,explain:'The server catches invalid lengths before they become an HTTP 500 database error.'},
  {name:'Regression test for too-long city',file:'src/test/java/org/springframework/samples/petclinic/owner/OwnerControllerTests.java',kind:'backend',scene:'ownerDetail',lang:'java',code:`mockMvc.perform(post("/owners/new")
      .param("city", "C".repeat(81)))
    .andExpect(model().attributeHasErrors("owner"))
    .andExpect(model().attributeHasFieldErrors("owner", "city"));`,explain:'Condensed real test assertions: 81-character city input produces a field error.',illustrative:true}
 ]}
];

