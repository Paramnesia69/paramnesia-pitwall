const CACHE_VERSION = 2;
const STATIC_CACHE = `pitwall-static-v${CACHE_VERSION}`;
const RUNTIME_CACHE = `pitwall-runtime-v${CACHE_VERSION}`;
const API_CACHE = `pitwall-api-v${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// ─── Install — precache app shell ─────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ─── Activate — clean old caches ──────────────────────────
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, RUNTIME_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !currentCaches.includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch — strategy per request type ────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, and _next/webpack HMR
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.pathname.includes('__webpack') || url.pathname.includes('_next/webpack')) return;

  // Strategy 1: API routes — stale-while-revalidate
  // Serve cached response immediately, update cache in background
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE, 300)); // 5 min max age
    return;
  }

  // Strategy 2: Static assets — cache-first
  // JS, CSS, fonts, images — immutable once deployed
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, RUNTIME_CACHE));
    return;
  }

  // Strategy 3: Navigation — network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Strategy 4: Everything else — network-first with cache fallback
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

// ─── Caching strategies ───────────────────────────────────

/** Serve from cache immediately; fetch + update cache in background */
async function staleWhileRevalidate(request, cacheName, maxAgeSeconds) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Check if cached response is still fresh enough
  const isFresh =
    cached &&
    cached.headers.get('sw-cached-at') &&
    Date.now() - parseInt(cached.headers.get('sw-cached-at'), 10) < maxAgeSeconds * 1000;

  // Always revalidate in background (unless very fresh)
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        // Clone and stamp with cache time
        const headers = new Headers(response.headers);
        headers.set('sw-cached-at', String(Date.now()));
        const stamped = new Response(response.clone().body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
        cache.put(request, stamped);
      }
      return response;
    })
    .catch(() => null);

  // Return cached if available, otherwise wait for network
  if (cached && isFresh) return cached;
  if (cached) {
    // Stale — return it but revalidate
    fetchPromise; // fire and forget
    return cached;
  }

  // No cache — must wait for network
  const networkResponse = await fetchPromise;
  return networkResponse || new Response('{"error":"offline"}', {
    status: 503,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Try cache first, fallback to network (for immutable static assets) */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}

/** Network first with offline.html fallback for navigations */
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match('/offline.html');
  }
}

/** Network first, cache fallback for misc resources */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response('', { status: 408 });
  }
}

/** Check if a URL path is a static asset worth caching */
function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/.test(pathname) ||
    pathname.startsWith('/_next/static/');
}

// ─── Push notifications — race reminders ──────────────────
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'PARAMNESIA PITWALL';
  const options = {
    body: data.body || 'Race starting soon!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'pitwall-notification',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Open Pitwall' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ─── Notification click — open the app ────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus existing tab if available
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) {
        existing.focus();
        return existing.navigate(url);
      }
      return self.clients.openWindow(url);
    })
  );
});

// ─── Background sync — queue failed API requests ─────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'pitwall-sync') {
    event.waitUntil(
      // Re-fetch API data when back online
      Promise.all([
        fetch('/api/events').catch(() => null),
        fetch('/api/weather?lat=0&lng=0').catch(() => null),
      ])
    );
  }
});
