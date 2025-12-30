self.addEventListener('install', (e) => {
  console.log('Salman AppOrbit Service Worker Installed');
});

self.addEventListener('fetch', (e) => {
  // Ye app ko offline chalne mein madad deta hai
  e.respondWith(fetch(e.request));
});