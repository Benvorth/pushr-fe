import React, {useContext, useEffect} from 'react'
import { useHistory } from "react-router-dom";

import AppContext from '../AppContext';

export default function Recipients() {

    let history = useHistory();

    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        }
    });

    return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 btn btn-info">
                        Welcome to Recipients
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-9"></div>
                </div>
            </div>
    )
}
