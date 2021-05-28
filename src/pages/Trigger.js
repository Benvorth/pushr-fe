import React from 'react'
import { useHistory } from "react-router-dom";

import PushrNavigation from './PushrNavigation';
import {
    askUserPermission, isPushNotificationSupported
} from "../pushService/pushServiceController";

export default function Trigger({userContext, title, selectedIndex, setSelectedIndex, token, setToken}) {

    let history = useHistory();

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 btn btn-info">
                        Welcome to Trigger
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-9">...</div>
                </div>
            </div>
        </PushrNavigation>
    )
}
