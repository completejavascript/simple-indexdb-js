//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
//IDBTransaction interface of the IndexedDB API provides a static, asynchronous transaction on a database using event handler attributes.
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

function SimpleIndexedDB(_dbName) {
  this.dbName = _dbName;
  this.dbVersionNumber = 1;

  this.setDBVersionNumber = function(_dbVersionNumber) {
    this.dbVersionNumber = _dbVersionNumber;
  }

  this.open = function(onsuccess, onerror, onupgradeneeded, objName, keyPath, objData) {
    this.objName = objName;
    this.request = window.indexedDB.open(this.dbName, this.dbVersionNumber);
    var self = this;

    this.request.onerror = function (event) {
      onerror();
    };
    
    this.request.onsuccess = function (event) {
      // here: this = request
      self.db = this.result;
      onsuccess();
    };
    
    this.request.onupgradeneeded = function (event) {
      var db = event.target.result;
      var objectStore = db.createObjectStore(objName, { keyPath: keyPath });
      if(objData != undefined) {
        for (var i in objData) {
          objectStore.add(objData[i]);
        }
      }
      onupgradeneeded();
    }
  }

  this.readAll = function (callback) {
    var objectStore = this.db.transaction(this.objName).objectStore(this.objName);
    objectStore.openCursor().onsuccess = function (event) {
      var cursor = event.target.result;
      if (cursor) {
        callback(cursor);
        cursor.continue();
      }
      else {
        console.log("No more entries!");
      }
    };
  }

  this.read = function(id) {
    var transaction = this.db.transaction([this.objName]);
    var objectStore = transaction.objectStore(this.objName);
    var keySearch = '' + id;

    return new Promise(function(resolve, reject){
      var request = objectStore.get(id);
      request.onerror = function (event) {
        reject(event);
      };
      request.onsuccess = function (event) {
        resolve(request.result);
      };
    });
  }

  this.add = function (objData) {
    var transaction = this.db.transaction([this.objName], 'readwrite');
    var objectStore = transaction.objectStore(this.objName);

    return new Promise(function(resolve, reject){
      var request = objectStore.add(objData);
      request.onsuccess = function (event) {
        resolve(event);
      };
  
      request.onerror = function (event) {
        reject(event);
      }
    });
  }

  this.remove = function(id) {
    var transaction = this.db.transaction([this.objName], 'readwrite');
    var objectStore = transaction.objectStore(this.objName);
    var keySearch = '' + id;

    return new Promise(function(resolve, reject){
      var request = objectStore.delete(id);
      request.onerror = function (event) {
        reject(event);
      };
      request.onsuccess = function (event) {
        resolve(event);
      };
    });
  }
};

