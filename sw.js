// Nama cache unik Anda
const CACHE_NAME = 'web-islam-cache-v1';

// Daftar file inti ("App Shell") yang HARUS di-cache saat install
// Ini adalah file-file dari screenshot Anda
const urlsToCacheOnInstall = [
  '/', // Halaman utama
  '/index.html',
  '/profil.html',
  '/script.js',
  '/style.css',
  '/manifest.json',
  '/img/islamiah192.png',
  '/img/islamiah512.png'
  // Anda bisa tambahkan logo atau gambar penting lain di folder 'img/'
  // contoh: '/img/logo.png' 
];

// 1. Event 'install' - Menyimpan "App Shell" ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka. Menambahkan App Shell ke cache...');
        return cache.addAll(urlsToCacheOnInstall);
      })
  );
});

// 2. Event 'fetch' - Mengambil dari cache atau dari internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(responseFromCache => {
        // Jika file ADA di cache, langsung kembalikan dari cache
        if (responseFromCache) {
          return responseFromCache;
        }

        // Jika file TIDAK ADA di cache, coba ambil dari internet (online)
        return fetch(event.request)
          .then(responseFromNetwork => {
            // Jika berhasil diambil dari internet, kita simpan salinannya ke cache
            // untuk penggunaan offline di masa depan
            
            // Kita perlu 'clone' responsenya.
            const responseToCache = responseFromNetwork.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Simpan respons baru ke cache
                cache.put(event.request, responseToCache);
              });
            
            // Kembalikan respons asli ke browser
            return responseFromNetwork;
          })
          .catch(error => {
            // Ini terjadi jika pengguna offline DAN file tidak ada di cache
            console.log('Gagal fetch: Pengguna offline dan file tidak ada di cache.');
            // Anda bisa mengarahkan ke halaman offline khusus, jika Anda membuatnya
            // return caches.match('/offline.html'); 
            return new Response("Anda sedang offline dan konten ini belum disimpan.", { headers: { 'Content-Type': 'text/html' } });
          });
      })
  );
});

// 3. Event 'activate' - Membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
