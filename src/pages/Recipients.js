import React from 'react'
import { useHistory } from "react-router-dom";

import PushrNavigation from './PushrNavigation';
import Messages from './Messages';

export default function Recipients({userContext, title, selectedIndex, setSelectedIndex}) {

    let history = useHistory();

    if (!userContext || !('userImgUrl' in userContext)) {
        history.push('/login');
    }

    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
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
        </PushrNavigation>
    )
}
