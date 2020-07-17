let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (e) {
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
// log errors
request.onerror = function (e) {
  console.log("Error: " + e.target.errorCode);
};
// store data to the database
function recordData(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}

// search through the database
function scanDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const fetchAll = store.fetchAll();
  // when item found, post the result as a string
  fetchAll.onsuccess = function () {
    if (fetchAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(fetchAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}

// add listener to see if server is online
window.addEventListener("online", scanDatabase);
