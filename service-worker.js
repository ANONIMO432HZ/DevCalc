const CACHE_NAME = 'devsuite-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dist/bundle.js',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.2.0',
  'https://aistudiocdn.com/react-dom@^19.2.0/',
  'https://aistudiocdn.com/react@^19.2.0/',
  'https://aistudiocdn.com/crypto-js@^4.2.0',
  'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js',
  'https://cdn.jsdelivr.net/npm/smol-toml@1.3.1/dist/smol-toml.umd.js'
];

// Instalación: Cachear recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cacheando archivos estáticos');
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

// Fetch: Estrategia Stale-While-Revalidate para contenido, Cache-First para librerías
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET o esquemas no soportados
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, devolverlo
      if (cachedResponse) {
        return cachedResponse;
      }

      // Si no, hacer la petición a red
      return fetch(event.request).then((networkResponse) => {
        // Verificar si la respuesta es válida antes de cachear
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // Clonar la respuesta para guardarla en caché y devolverla al navegador
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
         // Fallback offline (opcional, si tuviéramos una página offline.html)
         console.log('[Service Worker] Fallo de red y no está en caché:', event.request.url);
      });
    })
  );
});