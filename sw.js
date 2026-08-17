const CACHE = 'newdawn-v5-20260817';
const CORE = [
  './', './index.html', './about.html', './academics.html',
  './school-life.html', './admissions.html', './contact.html',
  './privacy.html', './404.html', './offline.html', './styles.css?v=20260817-3', './site-config.js?v=20260817-3',
  './script.js?v=20260817-3', './site.webmanifest', './assets/images/logo-transparent.png'
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
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(event.request)) || caches.match('./offline.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    const update = fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => cached);
    return cached || update;
  }));
});
