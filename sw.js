const CACHE_NAME = 'rainero-kids-v4';
const ASSETS = [
  '/manifest.json',
  '/logo.png',
  '/logo_mvl.png',
  '/vicente.jpg',
  '/vicente_celu.jpg',
  '/vicente_solo.jpg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // No cachear Supabase ni el index.html
  if (e.request.url.includes('supabase') || e.request.url.includes('index.html') || e.request.mode === 'navigate') {
    return;
  }
  // Solo cachear assets estáticos (imágenes, etc)
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
