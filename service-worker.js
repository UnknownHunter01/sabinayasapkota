self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('your-cache-name').then(function(cache) {
      return cache.addAll([
        '/',
          '/index.html',
          'css/styles.css',
          'js/script.js',
          'img/profile.png',
          'img/profile.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
