const CACHE_NAME = 'suivi-universitaire-v1';
const STATIC_CACHE = 'suivi-static-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE)
        .then(cache => {
          console.log('✅ Cache statique ouvert');
          return cache.addAll(urlsToCache);
        })
        .catch(err => console.log('❌ Erreur cache statique:', err))
    ])
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Supprimer tous les anciens caches
          console.log('🗑️ Suppression ancien cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache intelligente
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // JAMAIS cacher les requêtes Firebase/Firestore
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('firestore') ||
      url.hostname.includes('googleapis.com') ||
      url.pathname.includes('firebase') ||
      url.pathname.includes('firestore')) {
    console.log('🔄 Requête Firebase (pas de cache):', url.pathname);
    return; // Laisser passer sans interception
  }

  // Ne pas cacher les fichiers .ts, .tsx en développement
  if (url.pathname.endsWith('.ts') || url.pathname.endsWith('.tsx')) {
    console.log('🔄 Fichier TypeScript (pas de cache):', url.pathname);
    return;
  }

  // Cacher les ressources statiques
  if (url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.json') ||
      url.pathname.endsWith('.woff') ||
      url.pathname.endsWith('.woff2')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            console.log('📦 Cache hit:', url.pathname);
            return response;
          }

          return fetch(event.request)
            .then(response => {
              if (!response || response.status !== 200 || url.protocol !== 'http:' && url.protocol !== 'https:') {
                return response;
              }

              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache).catch(() => {
                    // Ignorer les erreurs de cache (chrome-extension, etc)
                  });
                });

              return response;
            })
            .catch(() => {
              return caches.match(event.request);
            });
        })
    );
    return;
  }

  // Pour les autres requêtes (HTML, etc), network first
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || url.protocol !== 'http:' && url.protocol !== 'https:') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache).catch(() => {
              // Ignorer les erreurs de cache
            });
          });

        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            return response || new Response('Offline - Page non disponible', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Gestion des messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
