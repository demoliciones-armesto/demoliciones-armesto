const CACHE = 'armesto-site-v1';
const SHELL = [
  './', './index.html', './styles.css', './script.js', './pwa.js',
  './favicon.svg', './manifest.webmanifest', './icon-192.png',
  './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './assets/demolicion-urbana-armesto.webp',
  './assets/proyecto-demolicion-controlada.webp',
  './assets/proyecto-demolicion-total.webp',
  './assets/proyecto-desguace-interior.webp',
  './assets/supervisor-demolicion-armesto.webp'
];
const ASSETS = new Set(SHELL.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('armesto-site-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope) ||
      (request.mode !== 'navigate' && !ASSETS.has(url.href))) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok && !response.redirected) {
        await cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      const cached = await cache.match(request) ||
        (request.mode === 'navigate' ? await cache.match(new URL('./index.html', self.registration.scope)) : undefined);
      if (cached) return cached;
      throw error;
    }
  })());
});

