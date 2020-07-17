const CACHE_FILE = [
    "/",
    "/index.html",
    "index.js",
    "/db.js",
    "/style.css"
];

const CACHE_NAME = "static-cache-v2";

const DATA_CACHE_NAME = "data-cache-v1";

// download and install cache files
self.addEventListener("install", function (e) {
    
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log("Opened cache");
        return cache.addAll(CACHE_FILE);
      })
    );
  });