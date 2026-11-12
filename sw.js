/* Lab Notes service worker: a little helper the browser keeps around so the app works offline.
   - App files: try the internet first (so you always get the newest lessons when online),
     and fall back to the saved copy when you're offline.
   - Google Fonts: saved once, then reused forever.
   When you add a new file to the app (e.g. data/module-1.js), add it to PRECACHE and bump VERSION. */

const VERSION = 'v4';
const CACHE = 'labnotes-' + VERSION;
const FONT_CACHE = 'labnotes-fonts';
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;600;800&display=swap';
const PRECACHE = [
  './',
  'index.html',
  'css/style.css',
  'js/store.js',
  'js/sfx.js',
  'js/mascot.js',
  'js/breadboard.js',
  'js/widgets.js',
  'js/app.js',
  'data/course.js',
  'data/module-0.js',
  'data/module-1.js',
  'data/module-2.js',
  'data/module-3.js',
  'data/module-4.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })));
    try { await saveFonts(); } catch (e) { /* fonts are nice-to-have; the app falls back to system fonts */ }
    await self.skipWaiting();
  })());
});

// Download the font stylesheet and every font file it points to.
async function saveFonts() {
  const cache = await caches.open(FONT_CACHE);
  const res = await fetch(FONT_CSS, { mode: 'cors' });
  if (!res.ok) return;
  await cache.put(FONT_CSS, res.clone());
  const css = await res.text();
  const urls = Array.from(css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g), (m) => m[1]);
  await Promise.all(urls.map((u) =>
    fetch(u, { mode: 'cors' }).then((r) => (r.ok ? cache.put(u, r) : null)).catch(() => null)));
}

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((k) => k.startsWith('labnotes-') && k !== CACHE && k !== FONT_CACHE)
      .map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(req));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(req));
  }
  // everything else (YouTube thumbnails, Tinkercad...) just goes to the internet as normal
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  const network = fetch(req).then((res) => {
    if (res.status === 200) cache.put(req, res.clone());
    return res;
  });
  network.catch(() => {}); // avoid "unhandled error" noise when offline
  try {
    // wait up to 4 seconds for the internet before using the saved copy
    return await Promise.race([network, new Promise((_, reject) => setTimeout(() => reject(new Error('slow')), 4000))]);
  } catch (e) {
    const saved = await cache.match(req, { ignoreSearch: true }) ||
      (req.mode === 'navigate' ? await cache.match('index.html') : undefined);
    return saved || network; // nothing saved: keep waiting for the network
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(FONT_CACHE);
  const saved = await cache.match(req, { ignoreVary: true });
  if (saved) return saved;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return Response.error();
  }
}
