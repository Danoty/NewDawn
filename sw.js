const CACHE = 'newdawn-v8-bright-20260915';
const CORE = [
  './polish.css?v=20260915-1', './', './index.html', './about.html', './academics.html',
  './school-life.html', './admissions.html', './contact.html',
  './french-competition.html', './competition.css?v=20260915-1', './competition.js?v=20260915-1', './privacy.html', './404.html', './offline.html', './styles.css?v=20260915-1', './site-config.js?v=20260915-1',
  './refresh.css?v=20260915-1', './script.js?v=20260915-1', './site.webmanifest', './assets/images/logo-transparent.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('newdawn-') && key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.headers.has('range') || /\.mp4$/i.test(new URL(event.request.url).pathname)) return;
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
