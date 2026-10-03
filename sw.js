const CACHE_NAME = 'pulsepal-driver-v5'

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/logo.png',
  '/assets/icon/icon-192.png',
  '/assets/icon/icon-512.png',

  '/css/main.css',
  '/css/components.css',
  '/css/pages.css',
  '/css/animations.css',

  '/js/app.js',
  '/js/router.js',
  '/js/dummy-data.js',
  '/js/components.js',
  '/js/map.js',

  '/pages/splash.frag',
  '/pages/onboarding-device.frag',
  '/pages/onboarding-verify.frag',
  '/pages/onboarding-password.frag',
  '/pages/subscribe.frag',
  '/pages/login.frag',
  '/pages/home.frag',
  '/pages/faults.frag',
  '/pages/fault-detail.frag',
  '/pages/map.frag',
  '/pages/fuel-navigator.frag',
  '/pages/trips.frag',
  '/pages/trip-detail.frag',
  '/pages/trip-coaching.frag',
  '/pages/mechanics.frag',
  '/pages/mechanic-detail.frag',
  '/pages/pulse-ai.frag',
  '/pages/speed-alerts.frag',
  '/pages/vehicle-sharing.frag',
  '/pages/my-vehicles.frag',
  '/pages/add-vehicle.frag',
  '/pages/profile.frag',
  '/pages/subscription.frag',
  '/pages/settings.frag',
  '/pages/device-status.frag',
  '/pages/security.frag',
  '/pages/notification-preferences.frag',
  '/pages/about.frag',
  '/pages/help-faq.frag',
  '/pages/deactivate-account.frag'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache each file individually rather than cache.addAll(),
      // which fails (and aborts the ENTIRE install) if even one
      // URL 404s. One missing/renamed asset should never again be
      // able to silently break the update mechanism.
      return Promise.allSettled(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn(`[sw.js] Failed to cache "${url}":`, err.message)
            return null
          })
        )
      )
    })
  )
  // Do NOT call skipWaiting() here — a new service worker should sit
  // "waiting" until the user is told an update is ready and taps to
  // apply it (see the message listener below). Auto-skipping would
  // swap files out from under someone mid-use.
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response =>
        response || fetch(event.request)
      )
  )
})

// app.js posts this message when the user taps "Update" on the
// in-app update banner — only then does the new worker activate
// and take over.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})