const CACHE = 'newdawn-v2';
const CORE = [
  './', './index.html', './about.html', './academics.html',
  './school-life.html', './admissions.html', './contact.html',
  './privacy.html', './404.html', './styles.css', './site-config.js',
  './script.js', './site.webmanifest', './assets/images/logo-transparent.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('./404.html')))
  );
});
