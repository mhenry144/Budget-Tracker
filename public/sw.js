const CACHE_FILE = [
    "/",
    "/index.html",
    "index.js",
    "/db.js",
    "/style.css"
];

const CACHE_NAME = "static-cache-v2";

const DATA_CACHE_NAME = "data-cache-v1";

// install cache files
self.addEventListener("install", function (e) {
    
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log("Opened cache");
        return cache.addAll(CACHE_FILE);
      })
    );
  });

  self.addEventListener('fetch', function(e) {
    console.log(e.request.url);
   
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
   });