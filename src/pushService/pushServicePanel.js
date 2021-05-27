import React from 'react';
import {useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import pushService from "./pushService";
import PushrNavigation from '../pages/PushrNavigation';
import Recipients from '../pages/Recipients';


const Loading = ({ loading }) => (loading ? <div className="app-loader">Please wait, we are loading something...</div> : null);

const Error = ({error}) =>
    error ? (
        <Snackbar open={true} autoHideDuration={3000}>
            <Alert severity="error">
                {error.name}: {error.message} ({error.code})
            </Alert>
        </Snackbar>
    ) : null;

// destructuring: https://medium.com/@lcriswell/destructuring-props-in-react-b1c295005ce0
const Info = ({info, onClose}) => {
    return info ? (
        <Snackbar open={!!info} autoHideDuration={3000} onClose={onClose} onClick={onClose}>
            <Alert severity="success" onClose={onClose}>
                {info.message}
            </Alert>

        </Snackbar>
    ) : null;
}

const PushMsg = ({lastMessage, onClose}) =>
    lastMessage ? (
        <Snackbar open={true} autoHideDuration={6000} onClose={onClose} onClick={onClose}>
            <Alert severity="info" onClose={onClose}>
                {lastMessage}
            </Alert>
        </Snackbar>
    ) : null;

export default function PushServicePanel({userContext, title, selectedIndex, setSelectedIndex}) {


    const handleInfoClose = () => {
        setInfo(false);
    };
    const handlePushMsgClose = () => {
        setLastMessage(false);
    };

    const {
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
    } = pushService();

    const isConsentGranted = userConsent === "granted";


    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
            <div>
                <Loading loading={loading}/>

                <p>Push notification are {!pushNotificationSupported && "NOT"} supported by your device.</p>

                <p>
                    User consent to receive push notifications is <strong>{userConsent}</strong>.
                </p>

                <Error error={error}/>
                <Info info={info} onClose={handleInfoClose}/>
                <PushMsg lastMessage={lastMessage} onClose={handlePushMsgClose}/>


                <button disabled={!pushNotificationSupported || isConsentGranted} onClick={onClickAskUserPermission}>
                    {isConsentGranted ? "Consent granted" : " Ask user permission"}
                </button><br/>

                <button disabled={!pushNotificationSupported || !isConsentGranted || userSubscription}
                        onClick={onClickSubscribeToPushNotification}>
                    {userSubscription ? "Push subscription created" : "Create Notification subscription"}
                </button><br/>

                <button disabled={!userSubscription || pushServerSubscriptionId}
                        onClick={onClickSendSubscriptionToPushServer}>
                    {pushServerSubscriptionId ? "Subscrption sent to the server" : "Send subscription to push server"}
                </button><br/>

                {pushServerSubscriptionId && (
                    <div>
                        <p>The server accepted the push subscrption!</p>
                        <button onClick={onClickSendNotification}>Send a notification</button>
                        <button onClick={onClickClaimToken}>Claim token F0-34-AC-03</button>
                    </div>
                )}
                <br/>

                {/*<section>
                    <h4>Your notification subscription details</h4>
                    <pre>
                        <code>{JSON.stringify(userSubscription, null, " ")}</code>
                    </pre>
                </section>*/}
            </div>
        </PushrNavigation>
    );
}