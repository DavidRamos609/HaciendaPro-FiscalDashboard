const CACHE_NAME = 'hacienda-pro-v1';
const ASSETS = [
    './',
    './index.html',
    './src/index.css',
    './src/components/Facturador.js',
    './src/components/InvoiceManager.js',
    './src/components/InvoicePreview.js',
    './src/utils/DigitalSigner.js',
    './src/utils/TaxCalculators.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
