const CACHE_FILES = [
  "/",
  "/index.html",
  "/assets/js/index.js",
  "/assets/js/indexedDb.js",
  "/assets/css/styles.css",
  "/manifest.json",
  "/sw.js",
];

const CACHE_NAME = "static-cache-v2";

const DATA_CACHE_NAME = "data-cache-v1";

// install cache files
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(CACHE_FILES);
    })
  );

  self.skipWaiting();
});

// activate cache
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch data
self.addEventListener("fetch", (e) => {
  if (e.request.url.includes("/api/")) {
    console.log("[Service Worker] Fetch(data)", e.request.url);

    e.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(e.request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(e.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            return cache.match(e.request);
          });
      })
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((response) => {
        return response || fetch(e.request);
      });
    })
  );
});
