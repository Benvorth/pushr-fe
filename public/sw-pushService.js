
// --Cache


let cacheName = 'PUSHr-v11';
let filesToCache = [
    '/', /* so browser caches index.html even if user didn't directly type in that */
    '/index.html',
    // '/css/style.css',
    '/img/pushr-16.png',
    '/img/pushr-24.png',
    '/img/pushr-36.png',
    '/img/pushr-48.png',
    '/img/pushr-72.png',
    '/img/pushr-96.png',
    '/img/pushr-128.png',
    '/img/pushr-144.png',
    '/img/pushr-152.png',
    '/img/pushr-192.png',
    '/img/pushr-256.png',
    // '/img/pushr-512.png',
    '/img/pushr-dots.png',
    '/img/pushr-dots.svg',
    // '/js/main.js',
    // '/js/pushNotify_client.js'
];

/* Start the service worker and cache all of the app's content */
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install cache...')
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

/* Serve cached content when offline */
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});

/* Delete old cache versions */
/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keyList) => {
        Promise.all(keyList.map((key) => {
            if (key === cacheName) {
                return;
            }
            caches.delete(key);
        }))
    }));
});

// --------------------- Push Service

async function receivePushNotification(event) {
    console.log("[Service Worker - Push] Push Received.");

    const needToShow = await needToShowNotification();

    let msg = '';
    if (!event.data) {
        console.info('number fact received');

        if (needToShow) {
            await self.registration.showNotification('Numbers API', {
                body: 'A new fact has arrived',
                tag: 'numberfact',
                icon: 'img/pushr-256.png'
            });
        }

        const response = await fetch('http://localhost:8081/api/lastNumbersAPIFact');
        const fact = await response.text();
        // await dataCache.put('fact', new Response(fact));
        msg = fact;

    } else {

        const {title, body} = event.data.json();

        const options = {
            body: body,
            icon: 'img/pushr-72.png',
            vibrate: [200, 100, 200],
            // image: 'https://via.placeholder.com/128/ff0000',
            badge: 'img/pushr-16.png',
            actions: [{action: "Detail", title: "View", icon: 'img/pushr-72.png'}]
        };
        await self.registration.showNotification(title, options);

        msg = body;
    }

    const allClients = await clients.matchAll({includeUncontrolled: true});
    for (const client of allClients) {
        // can be received via
        // navigator.serviceWorker.addEventListener('message', (event) => {event.data.msg ...});
        // client.postMessage('data-updated');
        client.postMessage({msg: msg});
    }
}

function openPushNotification(event) {
    console.log('[Service Worker - Push] Notification click Received.', event.notification.data);

    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data));
}

async function needToShowNotification() {
    const allClients = await clients.matchAll({includeUncontrolled: true});
    for (const client of allClients) {
        if (client.visibilityState === 'visible') {
            return false;
        }
    }
    return true;
}

self.addEventListener('activate', event => {
    console.log('[Service Worker - push]: Acivate');
    event.waitUntil(clients.claim());
});

self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);

self.addEventListener('notificationclose', event => console.info('[Service Worker - Push] notificationclose event fired'));