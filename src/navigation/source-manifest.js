/* SHA-pinned code-navigation references. Only exact, verified text matches become line links. */
(function(){
'use strict';
const J='src/main/java/org/springframework/samples/petclinic/owner/';
const T='src/test/java/org/springframework/samples/petclinic/owner/';
const D='src/main/resources/db/';
const R=(label,path,needle,role='related',svg=[])=>({label,path,needle,role,svg});
const steps={
  '1.1':{needle:'<artifactId>bootstrap</artifactId>', related:[
    R('Owners JSP view','src/main/webapp/WEB-INF/jsp/owners/list.jsp','<table','view',['Owners'])
  ]},
  '1.2':{needle:'table-striped',related:[
    R('Bootstrap dependency','pom.xml','<artifactId>bootstrap</artifactId>','dependency',['Bootstrap'])
  ]},
  '1.3':{needle:'.container',related:[
    R('Owners JSP view','src/main/webapp/WEB-INF/jsp/owners/list.jsp','class="container"','view')
  ]},
  '2.1':{needle:'th:replace',related:[
    R('Owners list template','src/main/resources/templates/owners/ownersList.html','<table','view')
  ]},
  '2.2':{needle:'Edit Owner',related:[
    R('Owner controller',J+'OwnerController.java','class OwnerController','controller')
  ]},
  '2.3':{needle:'/owners?page=',related:[
    R('Owner search controller',J+'OwnerController.java','processFindForm','controller')
  ]},
  '3.1':{needle:'LocalDate.now()',related:[
    R('Pet domain model',J+'Pet.java','class Pet','dependency',['Pet']),
    R('Pet controller tests',T+'PetControllerTests.java','class PetControllerTests','test')
  ],svg:['PetController','isAfter(currentDate)','rejectValue()']},
  '3.2':{needle:'isAfter(currentDate)',related:[
    R('Pet domain model',J+'Pet.java','class Pet','dependency'),
    R('Pet controller tests',T+'PetControllerTests.java','class PetControllerTests','test')
  ],svg:['PetController','birthDate.isAfter']},
  '4.1':{needle:'updatePetDetails(',related:[
    R('Owner aggregate',J+'Owner.java','class Owner','dependency',['Owner aggregate']),
    R('Pet domain model',J+'Pet.java','class Pet','dependency')
  ],svg:['getPet(42)','PetController','append(pet)']},
  '4.2':{needle:'existingPet.setName(',related:[
    R('Owner.getPet()',J+'Owner.java','getPet(','dependency',['Owner','Owner #1']),
    R('Pet domain model',J+'Pet.java','class Pet','dependency',['Pet #42'])
  ],svg:['save(owner)','getPet(42)','Pet #42','name']},
  '5.1':{needle:'#{addVisit}',related:[
    R('Localized message','src/main/resources/messages/messages.properties','addVisit','dependency',['Add Visit']),
    R('Visit controller',J+'VisitController.java','class VisitController','controller')
  ]},
  '6.1':{needle:'this.date = LocalDate.now().plusDays(1)',related:[
    R('Visit controller',J+'VisitController.java','class VisitController','controller',['VisitController'])
  ],svg:['new Visit()','date = D + 1']},
  '6.2':{needle:'result.rejectValue("date"',related:[
    R('Visit domain model',J+'Visit.java','class Visit','dependency',['Visit']),
    R('Date input template','src/main/resources/templates/fragments/inputField.html','th:min','view',['date picker']),
    R('Visit controller tests',T+'VisitControllerTests.java','class VisitControllerTests','test')
  ],svg:['VisitController','!isAfter(today)','min = tomorrow']},
  '6.3':{needle:'th:min',related:[
    R('VisitController.minVisitDate',J+'VisitController.java','public LocalDate minVisitDate()','controller',['minVisitDate']),
    R('Visit date rule',J+'VisitController.java','result.rejectValue("date"','controller')
  ]},
  '6.4':{needle:'processNewVisitFormHasErrorsWhenVisitDateIsNotInFuture',related:[
    R('VisitController.processNewVisitForm',J+'VisitController.java','public String processNewVisitForm','controller',['VisitController']),
    R('Visit model',J+'Visit.java','class Visit','dependency')
  ],svg:['JUnit / MockMvc','VisitController','BindingResult']},
  '7.1':{needle:'this.owners.saveAndFlush(owner)',related:[
    R('OwnerRepository interface',J+'OwnerRepository.java','interface OwnerRepository','dependency',['Repository / DB']),
    R('H2 uniqueness schema',D+'h2/schema.sql','unique_owner_pet_name','schema',['unique violation']),
    R('Concurrency test','src/test/java/org/springframework/samples/petclinic/PetClinicConcurrencyTests.java','class PetClinicConcurrencyTests','test')
  ],svg:['PetController','saveAndFlush()','rejectValue','Repository / DB']},
  '7.2':{needle:'unique_owner_pet_name',related:[
    R('PostgreSQL unique index',D+'postgres/schema.sql','CREATE UNIQUE INDEX unique_owner_pet_name','schema',['PostgreSQL']),
    R('PetController error handling',J+'PetController.java','isDuplicatePetNameViolation','controller')
  ],svg:['pets table','owner_id','VARCHAR_IGNORECASE','UNIQUE constraint']},
  '7.3':{needle:'CREATE UNIQUE INDEX unique_owner_pet_name',related:[
    R('H2 uniqueness constraint',D+'h2/schema.sql','unique_owner_pet_name','schema',['H2']),
    R('MySQL pet-name constraint',D+'mysql/schema.sql','UNIQUE','schema',['MySQL']),
    R('PetController exception handling',J+'PetController.java','isDuplicatePetNameViolation','controller')
  ],svg:['PostgreSQL','LOWER','UNIQUE','H2','MySQL']},
  '7.4':{needle:'CountDownLatch readyLatch',related:[
    R('PetController.saveAndFlush',J+'PetController.java','saveAndFlush(owner)','controller'),
    R('PostgreSQL uniqueness index',D+'postgres/schema.sql','CREATE UNIQUE INDEX unique_owner_pet_name','schema',['Unique index'])
  ],svg:['CountDownLatch','Unique index','INSERT A','INSERT B']},
  '8.1':{needle:'lastName.strip()',related:[
    R('OwnerRepository lookup',J+'OwnerRepository.java','findByLastNameStartingWith(','dependency',['OwnerRepository','query: Davis']),
    R('Owner controller regression tests',T+'OwnerControllerTests.java','processFindFormIgnoresSurroundingWhitespace','test')
  ],svg:['OwnerController','lastName.strip()','OwnerRepository']},
  '8.2':{needle:'processFindFormIgnoresSurroundingWhitespace',related:[
    R('OwnerController.processFindForm',J+'OwnerController.java','public String processFindForm','controller',['POST owners search']),
    R('OwnerRepository lookup',J+'OwnerRepository.java','findByLastNameStartingWith(','dependency')
  ],svg:['captured lookup','TEST CASE','POST owners search']},
  '9.1':{needle:'public void addPet',related:[
    R('Pet entity identity',J+'Pet.java','class Pet','dependency',['Pet #42']),
    R('Pet controller',J+'PetController.java','class PetController','controller')
  ],svg:['Owner #1','getPets().contains(pet)','equals(42)']},
  '9.2':{needle:'MAX_NAME_LENGTH',related:[
    R('Pet name storage',D+'h2/schema.sql','name VARCHAR','schema'),
    R('Pet domain model',J+'Pet.java','class Pet','dependency')
  ],svg:['MAX_NAME_LENGTH','31 characters','validation error']},
  '10.1':{needle:'@Size(max = 80)',related:[
    R('Owner controller',J+'OwnerController.java','class OwnerController','controller'),
    R('Owner controller tests',T+'OwnerControllerTests.java','class OwnerControllerTests','test')
  ],svg:['Owner entity','@Size(80)','@Size(255)']},
  '10.2':{needle:'"C".repeat(81)',related:[
    R('Owner field constraints',J+'Owner.java','@Size(max = 80)','dependency',['max city = 80']),
    R('OwnerController',J+'OwnerController.java','class OwnerController','controller')
  ],svg:['POST /owners/new','attributeHasFieldErrors','city']}
};
window.THREE_LANES_SOURCE_MANIFEST=Object.freeze({steps});
})();
