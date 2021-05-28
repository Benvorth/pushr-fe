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
                setInfo({message: 'Push Notification service worker registered'});
                getPushServerPublicKey().then(() => {
                    setInfo({message: 'Push Notification server public key fetched'});

                    onClickAskUserPermission().then(async () => {
                        if (userConsent) {
                            const getExixtingSubscription = async () => {
                                const alreadySubscribed = await checkSubscription();
                                if (alreadySubscribed) {
                                    console.log('Push Notification already subscribed');
                                    setInfo({message: "Push Notification already subscribed"});
                                    const existingSubscription = await getUserSubscription();
                                    setUserSubscription(existingSubscription);
                                    setLoading(false);
                                } else {
                                    console.log('Push Notification not subscribed yet');
                                    setInfo({message: 'Push Notification  not subscribed yet'});
                                    await onClickSubscribeToPushNotification();
                                    setLoading(false);
                                }
                                setLoading(false);
                            };
                            await getExixtingSubscription();
                            setLoading(false);
                        }
                    });
                    // listen for data from push service Worker
                    navigator.serviceWorker.addEventListener(
                        'message', event => setLastMessage(event.data.msg)
                    );

                    setLoading(false);
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
        askUserPermission().then(consent => {
            setSuserConsent(consent);
            if (consent !== 'granted') {
                setInfo({message: 'Push Notification permission NOT grated'});
                setError({
                    name: 'Consent denied',
                    message: 'You denied the consent to receive notifications',
                    code: 0
                });
            } else {
                setInfo({message: 'Push Notification permission grated'});
            }
            setLoading(false);
        });
    };

    /**
     * define a click handler that creates a push notification subscription.
     * Once the subscription is created, it uses the setUserSubscription hook
     */
    const onClickSubscribeToPushNotification = async () => {
        setLoading(true);
        setError(false);
        createNotificationSubscription()
            .then(subscription => {
                console.info('notification subscription created. Endpoint: \'' + subscription.endpoint + '\'');
                setInfo('Subscribed to PushMsg Server');
                setUserSubscription(subscription);
                setLoading(false);
            })
            .catch(err => {
                console.error('Couldn\'t create the notification subscription', err, 'name:', err.name, 'message:', err.message, 'code:', err.code);
                setError(err);
                setLoading(false);
            });
    };

    /**
     * define a click handler that sends the push susbcribtion to the push server.
     * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
     */
    const onClickSendSubscriptionToPushServer = async () => {
        setLoading(true);
        setError(false);
        await http
            .post("/api/subscribe", userSubscription)
            .then(response => {
                console.log('Subscribed successfully. ID: ' + response.subscriptionId);
                setInfo('Subscribed successfully. ID: ' + response.subscriptionId);
                setPushServerSubscriptionId(response.subscriptionId);
                setLoading(false);
            })
            .catch(err => {
                console.info('Could not send Subscription info to the server');
                setLoading(false);
                setError(err);
            });
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
            console.log('Token F0-34-AC-03 claimed successfully.');
            setInfo('Token F0-34-AC-03 claimed successfully.');
            setPushServerSubscriptionId(response.result);
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