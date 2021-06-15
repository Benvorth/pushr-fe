// https://itnext.io/react-push-notifications-with-hooks-d293d36f4836

import http from "../util/http";

let publicSigningKey = "";

async function getPushServerPublicKey(accessToken) {
    // http.get('/api/publicSigningKey')
    const result = await http.get('/api/publicSigningKey', accessToken, false )
        .then(response => response.arrayBuffer())
        .then(key => {
            publicSigningKey = key;
            console.info('received public signing key from server: \'' + btoa(publicSigningKey) + '\'');
            return true;
        })
        .finally(() => console.info('Public Key fetched from the server: \''+ btoa(publicSigningKey) + '\''));
    return result;
}

async function alreadySubscribed(accessToken) {

    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            /*
            const result = await http.post('/api/device/is_known',
                subscription.endpoint,
                accessToken
            );

            if (result.status === 'success') {
                debugger;
                return result.msg; // true or false
            }
            console.error("failed to check subscription");
             */
            console.log('Already subscribed: ' + subscription)
            return subscription;
        }
    } else {
        console.error('serviceWorkers not supported');
    }
    return null;
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

async function isTriggerAssociatedWithEvent(trigger, accessToken) {
    const result = await http
        // .post("/api/subscribe", userSubscription)
        .get("/api/event/is_trigger_associated_with_event" +
            "?trigger=" + encodeURIComponent(trigger),
            accessToken)
        .then(response => {
            console.log('Trigger ' + trigger + ' is claimed: ' + response.msg);
            return (response.msg === 'true');
        })
        .catch(err => {
            console.info('Could not send Subscription info to the server: ' + err);
            return true;
        });
    return result;
}

async function canIPullThisTrigger(trigger, accessToken) {
    const result = await http
        // .post("/api/subscribe", userSubscription)
        .get("/api/event/can_i_pull_this_trigger" +
            "?trigger=" + encodeURIComponent(trigger),
            accessToken)
        .then(response => {
            console.log('Trigger ' + trigger + ' is pullable: ' + response.msg);
            return (response.msg === 'true');
        })
        .catch(err => {
            console.error('Could check if this token is pullable: ' + err);
            return false;
        });
    return result;
}

async function canISubscribeToThisEvent(trigger, accessToken) {
    const result = await http
        // .post("/api/subscribe", userSubscription)
        .get("/api/event/can_i_subscribe_to_this_event" +
            "?trigger=" + encodeURIComponent(trigger),
            accessToken)
        .then(response => {
            console.log('Event connected with trigger ' + trigger + ' is subscribable by this user: ' + response.msg);
            return (response.msg === 'true');
        })
        .catch(err => {
            console.error('error can_i_subscribe_to_this_event: ' + err);
            return false;
        });
    return result;
}

async function getEventNameFromTrigger(trigger, accessToken) {
    const result = await http
        // .post("/api/subscribe", userSubscription)
        .get("/api/event/get_event_name_from_trigger" +
            "?trigger=" + encodeURIComponent(trigger),
            accessToken)
        .then(response => {
            console.log('Trigger ' + trigger + ' has event name ' + response.msg);
            return (response.msg);
        })
        .catch(err => {
            console.error('Could get event name from token ' + err);
            return false;
        });
    return result;
}

export {
    isPushNotificationSupported,
    askUserPermission,
    sendNotification,
    createNotificationSubscription,
    getUserSubscription,
    getPushServerPublicKey,
    alreadySubscribed,
    isTriggerAssociatedWithEvent,
    canIPullThisTrigger, canISubscribeToThisEvent,
    getEventNameFromTrigger,
};