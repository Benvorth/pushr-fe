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
import {useSnackbar} from 'notistack';

const pushNotificationSupported = isPushNotificationSupported();

export default function usePushNotifications({userSubscription, setUserSubscription, userContext}) {

    //to manage the user consent: Notification.permission is a JavaScript native function
    // that return the current state of the permission. We initialize the userConsent with that value
    const [userConsent, setSuserConsent] = useState(Notification.permission);
    const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState();
    const [lastMessage, setLastMessage] = useState(null);
    const [loading, setLoading] = useState(true); //to manage async actions


    const { enqueueSnackbar } = useSnackbar();

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        if (pushNotificationSupported && !userSubscription) {

            setLoading(true);
            navigator.serviceWorker.register('/sw-pushService.js').then((reg) => {
                console.log('+Push Notification service worker registered', reg);
                enqueueSnackbar('Service worker registered', {variant: 'success',});

                // listen for data from push service Worker
                navigator.serviceWorker.addEventListener(
                    'message', event => setLastMessage(event.data.msg)
                );

                getPushServerPublicKey(userContext.accessToken)
                    .then((success) => {
                    enqueueSnackbar('Push Notification server public key fetched successfully', {variant: 'success',});
                    console.log('+Push Notification server public key fetched successfully: ' + success);
                    onClickAskUserPermission().then((usersConsent) => {
                        console.log('+User Consent: ' + usersConsent);
                        if (usersConsent) {
                            enqueueSnackbar('User consent granted for Push Messages', {variant: 'success',});
                            alreadySubscribed(userContext.accessToken)
                                .then((existingSubscription) => {
                                console.log('+Already subscribed: ' + (existingSubscription !== null));
                                if (existingSubscription !== null) {
                                    enqueueSnackbar('Already subscribed to Push Message backend', {variant: 'success',});
                                    // const existingSubscription = getUserSubscription();
                                    setUserSubscription(existingSubscription);
                                    onClickSendSubscriptionToPushServer(existingSubscription).then((success) => {
                                        console.log('+Send subscription to PUSHr server successful: ' + success);
                                        enqueueSnackbar('Successfully send subscription to PUSHr server', {variant: 'success',});
                                        setLoading(false);
                                    });
                                } else {
                                    onClickSubscribeToPushNotification().then((subscription) => {
                                        enqueueSnackbar('Successfully subscribed to Push Message backend', {variant: 'success',});
                                        console.log('+Auto-subscribed to push notification successful: ' + success);
                                        onClickSendSubscriptionToPushServer(subscription).then((success) => {
                                            enqueueSnackbar('Successfully send subscription to PUSHr server', {variant: 'success',});
                                            console.log('+Send subscription to PUSHr server successful: ' + success);
                                            setLoading(false);
                                        });
                                    });
                                }
                            });
                        } else {
                            enqueueSnackbar('User consent denied for Push Messages', {variant: 'error',});
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
     * define a click handler that asks the user permission
     */
    const onClickAskUserPermission = async () => {
        setLoading(true);
        const theConset = await askUserPermission().then(theConsent => {
            setSuserConsent(theConsent);
            if (theConsent !== 'granted') {
                console.log('Push NotificatgetPushServerPublicKeyion permission NOT grated');
            } else {
                console.log('Push Notification permission granted');
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
        const subscription = await createNotificationSubscription()
            .then(subscription => {
                console.info('notification subscription created. Endpoint: \'' + subscription.endpoint + '\'');
                setUserSubscription(subscription);
                return subscription
            })
            .catch(err => {
                enqueueSnackbar('Couldn\'t create the notification subscription', {variant: 'error'});
                console.error('Couldn\'t create the notification subscription', err, 'name:', err.name, 'message:', err.message, 'code:', err.code);
                return null;
            });
        return subscription;
    };

    /**
     * define a click handler that sends the push susbcribtion to the push server.
     * Once the subscription ics created on the server, it saves the id using the hook setPushServerSubscriptionId
     */
    const onClickSendSubscriptionToPushServer = async (theSubscription) => {

        // https://stackoverflow.com/questions/27247806/generate-unique-id-for-each-device
        const navigator_info = window.navigator;
        const screen_info = window.screen;
        let uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';
        console.log('Device-ID: ' + uid);
        console.log('Device-ID: ' + dec2hex(uid).toUpperCase());

        const result = await http
            // .post("/api/subscribe", userSubscription)
            .post("/api/device/register" +
                "?device_name=" + encodeURIComponent('Default') +
                "&uuid=" + encodeURIComponent(dec2hex(uid).toUpperCase()) +
                "&device_type=" + encodeURIComponent('smartphone') ,
                theSubscription,
                userContext.accessToken)
            .then(response => {
                console.log('Device registered successfully. ID: ' + response.subscriptionId);
                setPushServerSubscriptionId(response.subscriptionId);
                return true;
            })
            .catch(err => {
                console.info('Could not send Subscription info to the server: ' + err);
                return false;
            });
        return result;
    };

    // https://stackoverflow.com/questions/18626844/convert-a-large-integer-to-a-hex-string-in-javascript
    function dec2hex(str){ // .toString(16) only works up to 2^53
        var dec = str.toString().split(''), sum = [], hex = [], i, s
        while(dec.length){
            s = 1 * dec.shift()
            for(i = 0; s || i < sum.length; i++){
                s += (sum[i] || 0) * 10
                sum[i] = s % 16
                s = (s - sum[i]) / 16
            }
        }
        while(sum.length){
            hex.push(sum.pop().toString(16))
        }
        return hex.join('')
    }

    /**
     * define a click handler that request the push server to send a notification,
     * passing the id of the saved subscription
     */
    const onClickSendNotification = async () => {
        setLoading(true);
        const existingSubscription = await getUserSubscription();

        await http.post(
            `/api/sendTextNotification?subscriptionEndpoint=${existingSubscription.endpoint}`,
            'Hy there! From Benni',
            userContext.accessToken
        ).catch(err => {
            setLoading(false);
            enqueueSnackbar('Couldn\'t send text notification', {variant: 'error'});
        });
        setLoading(false);
    };



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
        loading,
        lastMessage, setLastMessage,
    };
}