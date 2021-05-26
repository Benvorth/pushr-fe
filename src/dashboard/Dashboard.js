import React from 'react'
import { useHistory } from "react-router-dom";

export default function Dashboard({userContext}) {

    let history = useHistory();

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    return (
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
        </div>
    )
}
