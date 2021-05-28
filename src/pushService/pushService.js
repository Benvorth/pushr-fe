// https://github.com/Spyna/push-notification-demo/blob/d566af94469d7b0e5324ad14bf5ad4114afb62b7/front-end-react/src/usePushNotifications.js#L17

import {useState, useEffect} from "react";
import http from "../util/http";

import {
    isPushNotificationSupported,
    askUserPermission,
    registerServiceWorker,
    sendNotification,
    createNotificationSubscription,
    getUserSubscription,
    getPushServerPublicKey,
    checkSubscription
} from "./pushServiceController";

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications({userSubscription, setUserSubscription}) {

    //to manage the user consent: Notification.permission is a JavaScript native function
    // that return the current state of the permission. We initialize the userConsent with that value
    const [userConsent, setSuserConsent] = useState(Notification.permission);
    const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [loading, setLoading] = useState(true); //to manage async actions

    //this effect runs only the first render
    useEffect(() => {
        if (pushNotificationSupported && !userSubscription) {

            setLoading(true);
            setError(false);
            registerServiceWorker().then(() => {

                // listen for data from push service Worker
                navigator.serviceWorker.addEventListener(
                    'message', event => setLastMessage(event.data.msg)
                );

                console.log('+Push Notification service worker registered');
                getPushServerPublicKey().then((success) => {
                    console.log('+Push Notification server public key fetched successful: ' + success);
                    onClickAskUserPermission().then((usersConsent) => {
                        console.log('+User Consent: ' + usersConsent);
                        if (usersConsent) {
                            checkSubscription().then((alreadySubscribed) => {
                                console.log('+Already subscribed: ' + alreadySubscribed);
                                if (alreadySubscribed) {
                                    setInfo({message: "Push Notification already subscribed"});
                                    const existingSubscription = getUserSubscription();
                                    setUserSubscription(existingSubscription);
                                    setLoading(false);
                                } else {
                                    setInfo({message: 'Push Notification  not subscribed yet'});
                                    onClickSubscribeToPushNotification().then((subscription) => {
                                        console.log('+Auto-subscribed to push notification successful: ' + success);
                                        onClickSendSubscriptionToPushServer(subscription).then((success) => {
                                            console.log('+Send subscription to PUSHr server successful: ' + success);
                                            setLoading(false);
                                        });
                                    });
                                }
                            });
                        }
                    });
                });
            });
        }
    }, []);


    /*
    // Retrieve if there is any push notification subscription for the registered
    // service worker
    // this effect runs only in the first render
    useEffect(() => {
        setLoading(true);
        setError(false);
        const getExixtingSubscription = async () => {
            const alreadySubscribed = await checkSubscription();
            if (alreadySubscribed) {
                console.log('Push Notification already subscribed');
                setInfo({message: "Push Notification already subscribed"});
                const existingSubscription = await getUserSubscription();
                setUserSubscription(existingSubscription);
            } else {
                console.log('Push Notification not subscribed yet');
                setInfo({message: 'Push Notification  not subscribed yet'});
            }
            setLoading(false);
        };
        getExixtingSubscription();
    }, []);
     */


    /**
     * define a click handler that asks the user permission,
     * it uses the setSuserConsent state, to set the consent of the user
     * If the user denies the consent, an error is created with the setError hook
     */
    const onClickAskUserPermission = async () => {
        setLoading(true);
        setError(false);
        const theConset = await askUserPermission().then(theConsent => {
            setSuserConsent(theConsent);
            if (theConsent !== 'granted') {
                console.log('Push NotificatgetPushServerPublicKeyion permission NOT grated');
                setInfo({message: 'Push NotificatgetPushServerPublicKeyion permission NOT grated'});
                setError({
                    name: 'Consent denied',
                    message: 'You denied the consent to receive notifications',
                    code: 0
                });
            } else {
                console.log('Push Notification permission granted');
                setInfo({message: 'Push Notification permission grated'});
            }
            return theConsent;
        });
        return theConset;
    };

    /**
     * define a click handler that creates a push notification subscription.
     * Once the subscription is created, it uses the setUserSubscription hook
     */
    const onClickSubscribeToPushNotification = async () => {
        setLoading(true);
        setError(false);
        const subscription = await createNotificationSubscription()
            .then(subscription => {
                console.info('notification subscription created. Endpoint: \'' + subscription.endpoint + '\'');
                setInfo('Subscribed to PushMsg Server');
                setUserSubscription(subscription);
                return subscription
            })
            .catch(err => {
                console.error('Couldn\'t create the notification subscription', err, 'name:', err.name, 'message:', err.message, 'code:', err.code);
                setError(err);
                return null;
            });
        return subscription;
    };

    /**
     * define a click handler that sends the push susbcribtion to the push server.
     * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
     */
    const onClickSendSubscriptionToPushServer = async (theSubscription) => {
        debugger;
        const result = await http
            // .post("/api/subscribe", userSubscription)
            .post("/api/subscribe", theSubscription)
            .then(response => {
                console.log('Subscribed successfully. ID: ' + response.subscriptionId);
                setInfo('Subscribed successfully. ID: ' + response.subscriptionId);
                setPushServerSubscriptionId(response.subscriptionId);
                return true;
            })
            .catch(err => {
                console.info('Could not send Subscription info to the server: ' + err);
                return false;
            });
        return result;
    };

    /**
     * define a click handler that request the push server to send a notification,
     * passing the id of the saved subscription
     */
    const onClickSendNotification = async () => {
        setLoading(true);
        setError(false);
        const existingSubscription = await getUserSubscription();

        await http.post(
            `/api/sendTextNotification?subscriptionEndpoint=${existingSubscription.endpoint}`,
            'Hy there! From Benni'
        ).catch(err => {
            setLoading(false);
            setError(err);
        });
        setLoading(false);
    };

    const onClickClaimToken = async () => {
        setLoading(true);
        setError(false);
        const existingSubscription = await getUserSubscription();

        await http.post(
            '/api/claimToken?token=' + encodeURIComponent('F0-34-AC-03') +
            '&subscriptionEndpoint=' + existingSubscription.endpoint
        ).then(response => {
            console.log('Token F0-34-AC-03 claimed successfully: ' + JSON.stringify(response));
            setInfo('Token F0-34-AC-03 claimed successfully.');
            setLoading(false);
        })
            .catch(err => {
                console.info('Could not claim token F0-34-AC-03');
                setLoading(false);
                setError(err);
            });
    }

    /**
     * returns all the stuff needed by a Component
     */
    return {
        onClickAskUserPermission,
        onClickSubscribeToPushNotification,
        onClickSendSubscriptionToPushServer,
        pushServerSubscriptionId,
        onClickSendNotification,
        userConsent,
        pushNotificationSupported,
        userSubscription,
        error,
        loading,
        info, setInfo,
        lastMessage, setLastMessage,
        onClickClaimToken
    };
}