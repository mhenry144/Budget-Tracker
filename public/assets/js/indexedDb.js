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

request.onerror = function (e) {
  console.log("Error: " + e.target.errorCode);
};

function recordData(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}

function scanDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const fetchAll = store.fetchAll();

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

window.addEventListener("online", scanDatabase);
