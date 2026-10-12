// Offline cache for the journal app. Entries live in localStorage, not here.
const CACHE = 'bt-journal-app-v2';
const SHELL = ['app.html', 'manifest.webmanifest', 'app-icon-192.png', 'app-icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const shell = url.origin === location.origin && SHELL.some((p) => url.pathname.endsWith('/' + p));
  const font = url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com');
  if (!shell && !font) return;
  // network first for the app page so updates land, cache as fallback offline
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});
