// Файл: C:\Users\zspir\lol-draft\public\service-worker.js
const CACHE_NAME = 'lol-draft-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/roles/top.png',
  '/roles/jungle.png',
  '/roles/middle.png',
  '/roles/bottom.png',
  '/roles/support.png'
];

// Устанавливаем кеш при установке Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кеш установлен');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Активируем новый Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Удаляем старый кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехватываем запросы и отдаем из кеша если есть
self.addEventListener('fetch', event => {
  // Кешируем только изображения
  if (event.request.url.includes('.png') || 
      event.request.url.includes('.jpg') ||
      event.request.url.includes('ddragon.leagueoflegends.com/cdn/')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Если есть в кеше - возвращаем
          if (response) {
            return response;
          }
          
          // Иначе загружаем с сети
          return fetch(event.request)
            .then(response => {
              // Проверяем валидность ответа
              if (!response || response.status !== 200) {
                return response;
              }
              
              // Клонируем ответ
              const responseToCache = response.clone();
              
              // Открываем кеш и сохраняем
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Если нет сети и нет в кеше - показываем заглушку для иконок чемпионов
              if (event.request.url.includes('ddragon.leagueoflegends.com')) {
                return caches.match('/roles/top.png');
              }
            });
        })
    );
  }
});