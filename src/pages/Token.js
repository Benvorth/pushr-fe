import React from 'react';
import {useHistory, useParams} from 'react-router-dom';


export default function Token({setToken}) {

    let history = useHistory();
    let {token} = useParams();

    console.log('token: ' + token);

    if (!!token) {
        setToken(token);
    }

    history.push('/login');


    return (<></>);
}