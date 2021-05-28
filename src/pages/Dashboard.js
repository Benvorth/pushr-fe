import React, {useState} from 'react'
import { useHistory } from "react-router-dom";

import PushrNavigation from './PushrNavigation';
import pushService from '../pushService/pushService';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


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

export default function Dashboard(
    {userContext, title, selectedIndex, setSelectedIndex, token, setToken,
    userSubscription, setUserSubscription}) {

    let history = useHistory();

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
        error,
        loading,
        info, setInfo,
        lastMessage, setLastMessage,
        onClickClaimToken
    } = pushService({userSubscription, setUserSubscription});

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    // todo: PushMsg handling automated (from pushServicePanel)
    if (!!token) {
        // history.push('/trigger');
    }

    token = 'F0-34-AC-03';

    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
            <div className="container">
                <Loading loading={loading}/>
                <Error error={error}/>
                <Info info={info} onClose={handleInfoClose}/>
                <PushMsg lastMessage={lastMessage} onClose={handlePushMsgClose}/>

                <div className="row">
                    <div className="col-sm-12 btn btn-info">
                        Welcome to Dashboard
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-3"> Welcome : {userContext.userName}</div>
                    <div className="col-sm-9"></div>
                </div>
                {token ?
                <div className="row">
                    <div className="col-sm-3"> Token : {token}</div>
                    <button onClick={onClickClaimToken}>Claim token {token}</button>
                </div>
                    : null}
            </div>
        </PushrNavigation>
    )
}
