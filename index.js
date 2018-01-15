const INDEXED_DB_NAME = 'employee_db';

var firstname, email, id;
var simpleIndexedDb;
var objData = [
  { id: "1", name: "lam", email: "lam@whatever.com" },
  { id: "2", name: "phong", email: "phong@whatever.com" }
];
var objName = 'employee';
var keyPath = 'id';

window.onload = function() {
  init();
}

function init() {
  firstname = document.querySelector('[name="firstname"]');
  email = document.querySelector('[name="email"]');
  id = document.querySelector('[name="id"]');

  simpleIndexedDb = new SimpleIndexedDB(INDEXED_DB_NAME);
  simpleIndexedDb.open(openDBSuccess, openDBError, openDBUpgradeNeeded, objName, keyPath, objData);
}

function openDBSuccess() {
  console.log('open db success');
}

function openDBError() {
  console.log('open db error');
}

function openDBUpgradeNeeded() {
  console.log('open db upgradedneeded');
}

function getName() {
  return firstname.value;
}

function getEmail() {
  return email.value;
}

function getId() {
  return id.value;
}

function save() {
  var data = {
    id: getId(),
    name: getName(),
    email: getEmail()
  };
  console.log('save', data);

  simpleIndexedDb.add(data).then(
    event => console.log('add success', event),
    error => console.log('add error', error)
  );
}

function showAll(){
  simpleIndexedDb.readAll(function(cursor){
    console.log(cursor.key, cursor.value.name, cursor.value.email);
  });
}

function read() {
  simpleIndexedDb.read(getId()).then(
    result => console.log('read success', result),
    event => console.log('read error', event)
  );
}

function remove() {
  simpleIndexedDb.remove(getId()).then(
    event => console.log('remove success', event),
    event => console.log('remove error', event)
  );
}

