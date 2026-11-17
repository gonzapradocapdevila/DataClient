// Siempre trae la versión más nueva si hay internet; sin internet abre la última que vio. Nunca guarda datos de Microsoft ni de SharePoint.
const V = 'fichas-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(['./', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png']).catch(() => {}))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.endsWith('config.json')) return;
  e.respondWith(fetch(e.request).then(r => { if (r.ok && !u.search) { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./'))));
});
