import React, {useContext, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import { GoogleLogout } from 'react-google-login';

import AppContext from '../AppContext';

export default function Logout() {

    let history = useHistory();
    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        }
    });

    const onLogoutClicked = () => {
        globalState.setUserContext(null);
        history.push('/login');
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12 btn btn-info">
                    Welcome to Logout
                </div>
            </div>
            <div className="row">
                <div className="col-sm-9">
                    {(/*process.env.NODE_ENV === "production" &&*/
                        globalState.userContext.loginProvider === 'Google' ?
                        <GoogleLogout
                            clientId="217519645658-9ink26e7bn8q4p59k7799kvi9qdqtghe.apps.googleusercontent.com"
                            buttonText="Logout"
                            onLogoutSuccess={onLogoutClicked}
                        >
                        </GoogleLogout>
                        : <div>logout from {globalState.userContext.loginProvider}</div>
                    )}
                </div>
            </div>
        </div>
    )
}
