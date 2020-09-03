
self.addEventListener('install', function (event) {
  console.log('SW: install event received:', event)
  return self.skipWaiting()
})

self.addEventListener('activate', function (event) {
    console.log('SW: activate event received:', event)
    return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
    if (event.request.url.startsWith(self.location.origin + '/localhost:')) {
         event.respondWith(fetch(new Request('http://localhost:' + event.request.url.slice((self.location.origin + '/localhost:').length))))
    }
    // do we have a live ipfs connection on the page to ask for requests instead? if not, fall back to CDN
    console.log(event)
})
