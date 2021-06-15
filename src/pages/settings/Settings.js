import React, {useContext, useEffect} from 'react';
import AppContext from '../../AppContext';
import { useHistory } from 'react-router-dom';


export default function Settings() {

    let history = useHistory();
    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        }
    });


    return (
        <div>
            Settings<br/>
            <br/>
            Language<br/>
            Consent to push-notifications on this device<br/>
            Consent to access camera on this device<br/>
            Open QR-code scanner on app startup<br/>

        </div>
    );
}