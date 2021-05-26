
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
            icon: '/logo192.png',
            vibrate: [200, 100, 200],
            image: 'https://via.placeholder.com/128/ff0000',
            badge: "https://spyna.it/icons/favicon.ico",
            actions: [{action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000"}]
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