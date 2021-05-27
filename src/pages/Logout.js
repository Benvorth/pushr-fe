import React from 'react'
import { useHistory } from "react-router-dom";
import { GoogleLogout } from 'react-google-login';

import PushrNavigation from './PushrNavigation';

export default function Logout({userContext, setUserContext, title, selectedIndex, setSelectedIndex}) {

    let history = useHistory();

    const onLogoutClicked = () => {
        setUserContext(null);
        history.push('/login');
    }

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 btn btn-info">
                        Welcome to Logout
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-9">
                        {(process.env.NODE_ENV === "production" &&
                            userContext.loginProvider === 'Google' ?
                            <GoogleLogout
                                clientId="217519645658-9ink26e7bn8q4p59k7799kvi9qdqtghe.apps.googleusercontent.com"
                                buttonText="Logout"
                                onLogoutSuccess={onLogoutClicked}
                            >
                            </GoogleLogout>
                            : <div>logout from {userContext.loginProvider}</div>
                        )}
                    </div>
                </div>
            </div>
        </PushrNavigation>
    )
}
