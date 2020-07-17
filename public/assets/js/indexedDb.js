
let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
  };

  request.onsuccess = function (e) {
    db = e.target.result;
  
    // scan database on successful server connection
    if (navigator.onLine) {
      scanDatabase();
    }
  };

  request.onerror = function (e) {
    console.log("Error: " + e.target.errorCode);
  };
  
  


