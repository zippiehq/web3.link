
self.addEventListener('install', function (event) {
  console.log('SW: install event received:', event)
  return self.skipWaiting()
})

self.addEventListener('activate', function (event) {
    console.log('SW: activate event received:', event)
    return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
    
    // do we have a live ipfs connection on the page to ask for requests instead? if not, fall back to CDN
    console.log(event)
})
