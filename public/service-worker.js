/* eslint-disable no-restricted-globals, no-undef */
/**
 * Service Worker
 * Handles caching and offline functionality
 * @version 2.0.0
 * 
 * Note: Service workers run in a different context where 'self' is the global object
 * ESLint warnings about 'self' and 'clients' are expected and can be ignored
 */

const CACHE_NAME = 'ppnm-v2.0.0';
const RUNTIME_CACHE = 'ppnm-runtime-v2.0.0';

// Assets to cache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/images/fuel-icon-192.svg',
  '/images/brands/Shell.svg',
  '/images/brands/BP.svg',
  '/images/brands/Caltex.svg',
  '/images/brands/Ampol.svg',
  '/images/brands/711.svg',
  '/images/brands/United.svg',
  '/images/brands/Liberty.svg',
  '/images/brands/default-logo.svg',
  '/images/melbourne-map-vector.jpg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          // Update cache in background for HTML/JSON
          if (request.headers.get('Accept')?.includes('text/html') ||
            request.headers.get('Accept')?.includes('application/json')) {
            event.waitUntil(updateCache(request));
          }
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone response (can only be consumed once)
            const responseToCache = response.clone();

            // Cache the response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                // Only cache GET requests
                if (request.method === 'GET') {
                  cache.put(request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // Network failed, return offline page if available
            if (request.headers.get('Accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

/**
 * Update cache with fresh content
 */
async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
  } catch (error) {
    console.log('[Service Worker] Update cache failed:', error);
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data === 'clearCache') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

/**
 * Sync data when back online
 */
async function syncData() {
  try {
    // Implement your sync logic here
    console.log('[Service Worker] Syncing data...');
    // Example: send queued requests, update cached data, etc.
  } catch (error) {
    console.log('[Service Worker] Sync failed:', error);
    throw error; // Retry on failure
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/images/fuel-icon-192.svg',
    badge: '/images/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('Petrol Prices Near Me', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle bfcache compatibility
self.addEventListener('freeze', () => {
  console.log('[Service Worker] Page frozen (bfcache)');
});

self.addEventListener('resume', () => {
  console.log('[Service Worker] Page resumed from bfcache');
});

// Suppress Chrome extension errors in service worker
self.addEventListener('error', (event) => {
  if (event.message && (
    event.message.includes('runtime.lastError') ||
    event.message.includes('extension port') ||
    event.message.includes('message channel')
  )) {
    event.preventDefault();
  }
});

console.log('[Service Worker] Loaded successfully');

