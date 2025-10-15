/**
 * Service Worker
 * Handles caching and offline functionality
 * @version 2.0.0
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
  // Safely handle messages to prevent conflicts with browser extensions
  try {
    if (!event.data || typeof event.data !== 'string') {
      return;
    }

    if (event.data === 'skipWaiting') {
      self.skipWaiting();
    }

    if (event.data === 'clearCache') {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        }).catch((error) => {
          console.warn('[Service Worker] Error clearing cache:', error);
        })
      );
    }

    // Handle back/forward cache messages
    if (event.data === 'page-entering-bfcache') {
      // Cleanup resources when page enters back/forward cache
      cleanupResourcesForBFCache();
    }

    if (event.data === 'page-restored-from-bfcache') {
      // Reinitialize when page is restored from back/forward cache
      reinitializeAfterBFCache();
    }
  } catch (error) {
    console.warn('[Service Worker] Error handling message:', error);
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

/**
 * Cleanup resources when page enters back/forward cache
 */
function cleanupResourcesForBFCache() {
  try {
    // Close any open IndexedDB connections
    // Cancel pending fetch requests
    // Clear any timers or intervals
    console.log('[Service Worker] Cleaned up resources for back/forward cache');
  } catch (error) {
    console.warn('[Service Worker] Error during BFCache cleanup:', error);
  }
}

/**
 * Reinitialize after page is restored from back/forward cache
 */
function reinitializeAfterBFCache() {
  try {
    // Reinitialize any necessary connections or resources
    console.log('[Service Worker] Reinitialized after back/forward cache restore');
  } catch (error) {
    console.warn('[Service Worker] Error during BFCache reinitialize:', error);
  }
}

/**
 * Enhanced error handling for service worker operations
 */
function handleServiceWorkerError(error, context) {
  console.warn(`[Service Worker] Error in ${context}:`, error);
  
  // Don't let service worker errors affect the main thread or extensions
  // Just log and continue
  return Promise.resolve();
}

console.log('[Service Worker] Loaded successfully');

