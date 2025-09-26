const CACHE_NAME = "bp-cache-v3";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => {
    return cache.addAll(["./index.html?v=3","./manifest.json?v=3","./icon-192.png","./icon-512.png"]);
  }));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
});
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then((response) => response || fetch(e.request)));
});