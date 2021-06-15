// https://github.com/Spyna/push-notification-demo/blob/d566af94469d7b0e5324ad14bf5ad4114afb62b7/front-end-react/src/usePushNotifications.js#L17

import {useState, useEffect} from "react";
import http from "../util/http";

import {
    isPushNotificationSupported,
    askUserPermission,
    sendNotification,
    createNotificationSubscription,
    getUserSubscription,
    getPushServerPublicKey,
    alreadySubscribed
} from "./pushServiceController";

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications({userSubscription, setUserSubscription, userContext}) {

    //to manage the user consent: Notification.permission is a JavaScript native function
    // that return the current state of the permission. We initialize the userConsent with that value
    const [userConsent, setSuserConsent] = useState(Notification.permission);
    const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    const [loading, setLoading] = useState(true); //to manage async actions

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        if (pushNotificationSupported && !userSubscription) {

            setLoading(true);
            setError(false);
            navigator.serviceWorker.register('/sw-pushService.js').then((reg) => {
                console.log('+Push Notification service worker registered', reg);

                // listen for data from push service Worker
                navigator.serviceWorker.addEventListener(
                    'message', event => setLastMessage(event.data.msg)
                );

                getPushServerPublicKey(userContext.accessToken)
                    .then((success) => {
                    console.log('+Push Notification server public key fetched successfully: ' + success);
                    onClickAskUserPermission().then((usersConsent) => {
                        console.log('+User Consent: ' + usersConsent);
                        if (usersConsent) {
                            alreadySubscribed(userContext.accessToken)
                                .then((existingSubscription) => {
                                console.log('+Already subscribed: ' + (existingSubscription === null));
                                if (existingSubscription !== null) {
                                    setInfo({message: "Push Notification already subscribed"});
                                    // const existingSubscription = getUserSubscription();
                                    setUserSubscription(existingSubscription);
                                    onClickSendSubscriptionToPushServer(existingSubscription).then((success) => {
                                        console.log('+Send subscription to PUSHr server successful: ' + success);
                                        setLoading(false);
                                    });
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
        const result = await http
            // .post("/api/subscribe", userSubscription)
            .post("/api/device/register" +
                "?device_name=" + encodeURIComponent('My Smart Phone') +
                "&device_type=" + encodeURIComponent('smartphone') ,
                theSubscription,
                userContext.accessToken)
            .then(response => {
                console.log('Device registered successfully. ID: ' + response.subscriptionId);
                setInfo('Device registered successfully. ID: ' + response.subscriptionId);
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
            'Hy there! From Benni',
            userContext.accessToken
        ).catch(err => {
            setLoading(false);
            setError(err);
        });
        setLoading(false);
    };

    const onClickTriggerEvent = async (trigger) => {
        setLoading(true);
        setError(false);
        const existingSubscription = await getUserSubscription();

        await http.get(
            '/api/push' +
            '?trigger=' + encodeURIComponent(trigger),
            userContext.accessToken
        ).then(response => {
            console.log('Token claimed successfully: ' + JSON.stringify(response));
            setInfo('Trigger ' + trigger + ' pushed successfully.');
            setLoading(false);
        })
            .catch(err => {
                console.info('Could not push trigger ' + trigger);
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
        onClickTriggerEvent,
    };
}