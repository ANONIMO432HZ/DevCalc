const CACHE_NAME = 'devsuite-v6';
// IMPORTANTE: Solo cacheamos archivos locales. 
// Las CDNs externas (Tailwind, React) provocan errores CORS que rompen la instalación de la PWA.
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dist/bundle.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Instalación: Cachear recursos estáticos locales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cacheando archivos locales v6');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Borrando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Estrategia Network First con fallback a Cache
// Usamos Network First para asegurar que las CDNs carguen si hay internet
self.addEventListener('fetch', (event) => {
  // Solo interceptamos peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          console.log('[Service Worker] Recurso no disponible offline:', event.request.url);
        });
      })
  );
});