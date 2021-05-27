import React from 'react'
import { useHistory } from "react-router-dom";

import PushrNavigation from './PushrNavigation';

export default function Dashboard({userContext, title, selectedIndex, setSelectedIndex, token, setToken}) {

    let history = useHistory();

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    // todo: PushMsg handling automated (from pushServicePanel)
    if (!!token) {
        // todo: claim token here
    }

    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
            <div className="container">
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
                </div>
                    : null}
            </div>
        </PushrNavigation>
    )
}
