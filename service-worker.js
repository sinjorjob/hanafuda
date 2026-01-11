// すいちゃんの花札 - Service Worker
const CACHE_NAME = 'hanafuda-v1';

// キャッシュするファイル一覧
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Google Fonts
  'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;500;700;900&family=Kiwi+Maru:wght@400;500&display=swap',
];

// 花札カード画像のURL一覧
const CARD_IMAGE_BASE = 'https://raw.githubusercontent.com/teradaian/hanafuda/main/assets/tiles/';
const CARD_IMAGES = [
  'Pine0.jpeg', 'Pine1.jpeg', 'Pine2.jpeg', 'Pine3.jpeg',
  'Plum0.jpeg', 'Plum1.jpeg', 'Plum2.jpeg', 'Plum3.jpeg',
  'Cherry0.jpeg', 'Cherry1.jpeg', 'Cherry2.jpeg', 'Cherry3.jpeg',
  'Wisteria0.jpeg', 'Wisteria1.jpeg', 'Wisteria2.jpeg', 'Wisteria3.jpeg',
  'Iris0.jpeg', 'Iris1.jpeg', 'Iris2.jpeg', 'Iris3.jpeg',
  'Peony0.jpeg', 'Peony1.jpeg', 'Peony2.jpeg', 'Peony3.jpeg',
  'Clover0.jpeg', 'Clover1.jpeg', 'Clover2.jpeg', 'Clover3.jpeg',
  'Grass0.jpeg', 'Grass1.jpeg', 'Grass2.jpeg', 'Grass3.jpeg',
  'Chrysanthemum0.jpeg', 'Chrysanthemum1.jpeg', 'Chrysanthemum2.jpeg', 'Chrysanthemum3.jpeg',
  'Maple0.jpeg', 'Maple1.jpeg', 'Maple2.jpeg', 'Maple3.jpeg',
  'Willow0.jpeg', 'Willow1.jpeg', 'Willow2.jpeg', 'Willow3.jpeg',
  'Paulownia0.jpeg', 'Paulownia1.jpeg', 'Paulownia2.jpeg', 'Paulownia3.jpeg',
  'back.jpeg'
];

// アイコンとローカル画像
const LOCAL_IMAGES = [
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
  console.log('[SW] インストール中...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] ファイルをキャッシュ中...');

      // 静的アセットをキャッシュ
      const staticPromise = cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] 静的アセットのキャッシュに失敗:', err);
      });

      // ローカル画像をキャッシュ
      const localImagesPromise = cache.addAll(LOCAL_IMAGES).catch(err => {
        console.warn('[SW] ローカル画像のキャッシュに失敗:', err);
      });

      // カード画像を個別にキャッシュ（エラーがあっても続行）
      const cardPromises = CARD_IMAGES.map(img => {
        const url = CARD_IMAGE_BASE + img;
        return fetch(url, { mode: 'cors' })
          .then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          })
          .catch(err => {
            console.warn(`[SW] カード画像のキャッシュに失敗: ${img}`, err);
          });
      });

      return Promise.all([staticPromise, localImagesPromise, ...cardPromises]);
    }).then(() => {
      console.log('[SW] キャッシュ完了！');
      return self.skipWaiting();
    })
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  console.log('[SW] アクティベート中...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] 古いキャッシュを削除:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] 準備完了！オフラインで使えます');
      return self.clients.claim();
    })
  );
});

// リクエスト時にキャッシュから返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // キャッシュにあればそれを返す
      if (cachedResponse) {
        return cachedResponse;
      }

      // なければネットワークから取得してキャッシュ
      return fetch(event.request).then((response) => {
        // 有効なレスポンスのみキャッシュ
        if (!response || response.status !== 200) {
          return response;
        }

        // レスポンスをクローンしてキャッシュ
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // オフラインでキャッシュもない場合
        console.log('[SW] オフライン - キャッシュなし:', event.request.url);
      });
    })
  );
});
