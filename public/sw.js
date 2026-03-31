self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
})

self.addEventListener('fetch', (event) => {
  // Simple fetch handler to satisfy PWA requirements
  event.respondWith(fetch(event.request))
})
