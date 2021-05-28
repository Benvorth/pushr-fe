// https://itnext.io/react-push-notifications-with-hooks-d293d36f4836

import http from "../util/http";

let publicSigningKey = "";

async function getPushServerPublicKey() {
    // http.get('/api/publicSigningKey')
    const result = await http.get('/api/publicSigningKey', false)
        .then(response => response.arrayBuffer())
        .then(key => {
            publicSigningKey = key;
            console.info('received public signing key from server: \'' + btoa(publicSigningKey) + '\'');
            return true;
        })
        .finally(() => console.info('Public Key fetched from the server: \''+ btoa(publicSigningKey) + '\''));
    return result;
}

async function checkSubscription() {

    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            const subscribed = await http.post('/api/isSubscribed',
                {endpoint: subscription.endpoint}
            );
            /*const response = await fetch("/api/isSubscribed", {
                method: 'POST',
                body: JSON.stringify({endpoint: subscription.endpoint}),
                headers: {
                    "content-type": "application/json"
                }
            });
            const subscribed = await response.json();*/
            return subscribed;
        }
    } else {
        console.error('serviceWorkers not supported');
    }
    return false;
}

/**
 * checks if Push notification and service workers are supported by your browser
 */

function isPushNotificationSupported() {
    // return "serviceWorker" in navigator; //  && "PushManager" in window;
    // let notificationIsSupported = !!(window.Notification /* W3C Specification */ || window.webkitNotifications /* old WebKit Browsers */ || navigator.mozNotification /* Firefox for Android and Firefox OS */)
    return ('serviceWorker' in navigator) && ('Notification' in window);
}


/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
async function askUserPermission() {
    return await Notification.requestPermission();
}

/**
 * shows a notification
 */
function sendNotification() {
    const img = "/logo512.png";
    const text = "Take a look at this brand new t-shirt!";
    const title = "New Product Available";
    const options = {
        body: text,
        icon: "/logo192.png",
        vibrate: [200, 100, 200],
        tag: "new-product",
        image: img,
        badge: "/logo192.png",
        actions: [{action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000"}]
    };
    navigator.serviceWorker.ready.then(function (serviceWorker) {
        serviceWorker.showNotification(title, options);
    });
}

/**
 *
 */
async function registerServiceWorker() {
    return await navigator.serviceWorker.register("/sw-pushService.js");
}

/**
 *
 * using the registered service worker creates a push notification subscription and returns it
 *
 */
async function createNotificationSubscription() {
    //wait for service worker installation to be ready
    const serviceWorker = await navigator.serviceWorker.ready;
    // subscribe and return the subscription
    // console.log('publicSigningKey ' + btoa(publicSigningKey));
    return await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicSigningKey
    });
}

/**
 * returns the subscription if present or nothing
 */
function getUserSubscription() {
    //wait for service worker installation to be ready, and then
    return navigator.serviceWorker.ready
        .then((serviceWorker) => {
            return serviceWorker.pushManager.getSubscription();
        })
        .then((pushSubscription) => {
            return pushSubscription;
        });
}

export {
    isPushNotificationSupported,
    askUserPermission,
    registerServiceWorker,
    sendNotification,
    createNotificationSubscription,
    getUserSubscription,
    getPushServerPublicKey,
    checkSubscription
};