/**
 * Service Worker for Office Web
 * Caches core assets for offline access and faster loading
 */

const CACHE_NAME = 'office-web-v2';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/excel/',
  '/word/',
  '/powerpoint/',
  '/kumir/',
  '/assets/css/styles.css',
  '/assets/js/topic-nav.js',
  '/assets/js/progress.js',
  '/assets/js/analytics.js',
  '/manifest.json'
];

// Install event: cache core assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(CORE_ASSETS);
    }).catch(function () {
      // Gracefully handle cache failures
    })
  );
  self.skipWaiting();
});

// Activate event: clean old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) {
          return key !== CACHE_NAME;
        }).map(function (key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: cache-first strategy for static assets, network-first for HTML
self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);

  // Skip non-GET requests and external URLs
  if (event.request.method !== 'GET') return;
  if (!url.pathname.startsWith('/')) return;

  // HTML pages: network-first
  if (event.request.headers.get('Accept') && event.request.headers.get('Accept').indexOf('text/html') !== -1) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        var cloned = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, cloned);
        });
        return response;
      }).catch(function () {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        var cloned = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, cloned);
        });
        return response;
      });
    })
  );
});