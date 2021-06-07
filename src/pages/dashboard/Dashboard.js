import React, {useState} from 'react'
import {useHistory} from "react-router-dom";

import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';

import WhistleIcon from '@material-ui/icons/Sports';
import HttpIcon from '@material-ui/icons/Http';
import QrCodeIcon from '@material-ui/icons/CropFree';
import ScheduleIcon from '@material-ui/icons/Schedule';

import PushrNavigation from '../PushrNavigation';
import pushService from '../../pushService/pushService';
import Envelopes from './Envelopes';


const Loading = ({loading}) => (loading ?
    <div className="app-loader">Please wait, we are loading something...</div> : null);

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
    {
        userContext, title, selectedIndex, setSelectedIndex, token, setToken,
        userSubscription, setUserSubscription
    }) {

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
    } = pushService({userSubscription, setUserSubscription, userContext});

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    // todo: PushMsg handling automated (from pushServicePanel)
    if (!!token) {
        // history.push('/trigger');
    }

    token = 'F0-34-AC-03';

    const envelopes = [
        {
            title: 'Call neighbours for help via IoT-button',
            icon: 'whistle',
            triggers: [
                {
                    triggerId: 123,
                    title: 'IoT-Button pressed',
                    token: 'F0-34-AC-03',
                }
            ],
            message: {
                messageId: 123,
                content: '\"Come to my place!\"',
            },
            recipients: {
                title: "All neighbours",
                people: [
                    {
                        userId: 123,
                        name: 'Myself'
                    }
                ],
            },
            devices: [
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "My handy",
                    type: "Mobile",
                }
            ]
        },
        {
            title: 'Dryer ready event via REST-call',
            icon: 'http',
            triggers: [
                {
                    triggerId: 123,
                    title: 'Dryer ready (KNX)',
                    token: 'F0-A7-CF-8B',
                }
            ],
            message: {
                messageId: 123,
                content: '\"This is your dryer: I am ready, come down please.\"',
            },
            recipients: {
                title: "Family",
                people: [
                    {
                        userId: 123,
                        name: 'Dad'
                    },
                    {
                        userId: 456,
                        name: 'Mom'
                    },
                    {
                        userId: 789,
                        name: 'Son'
                    },
                    {
                        userId: 976,
                        name: 'Daughter'
                    }
                ],
            },
            devices: [
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Dad handy",
                    type: "Mobile",
                },
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Mom handy",
                    type: "Mobile",
                },
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Son handy",
                    type: "Mobile",
                },
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Daughter handy",
                    type: "Mobile",
                },
            ]
        },
        {
            title: 'A daily joke received from a scheduled trigger',
            icon: 'scheduled',
            triggers: [
                {
                    triggerId: 123,
                    title: '24h scheduled REST call ',
                    token: 'F0-34-AC-03',
                }
            ],
            message: {
                messageId: 123,
                content: 'A fresh joke received from the Chuck Norris API',
            },
            recipients: {
                title: "Myself",
                people: [
                    {
                        userId: 123,
                        name: 'Myself'
                    }
                ],
            },
            devices: [
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "My handy",
                    type: "Mobile",
                }
            ]
        },
        {
            title: 'Info about empty toilet paper in upstairs WC via QR-code',
            icon: 'qrcode',
            triggers: [
                {
                    triggerId: 123,
                    title: 'QR-Code scanned',
                    token: 'F0-A7-CF-8B',
                }
            ],
            message: {
                messageId: 123,
                content: '\"I need new toilet paper in upstairs WC!\"',
            },
            recipients: {
                title: "Family",
                people: [
                    {
                        userId: 123,
                        name: 'Dad'
                    },
                    {
                        userId: 456,
                        name: 'Mom'
                    },
                    {
                        userId: 789,
                        name: 'Son'
                    },
                    {
                        userId: 976,
                        name: 'Daughter'
                    }
                ],
            },
            devices: [
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Dad handy",
                    type: "Mobile",
                },
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Mom handy",
                    type: "Mobile",
                },
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Son handy",
                    type: "Mobile",
                },
                {
                    deviceId: 1234,
                    userId: 123,
                    name: "Daughter handy",
                    type: "Mobile",
                },
            ]
        },
    ];

    return (
        <PushrNavigation
            userContext={userContext} title={title}
            selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
        >

            <Typography>My PUSHrs</Typography>
            <IconButton>
                <WhistleIcon color="secondary"/>
            </IconButton>

            <Typography>My Envelopes</Typography>
            <Envelopes envelopes={envelopes} />


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
