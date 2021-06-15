import React, {useContext, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import {Fab} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import AppContext from '../../AppContext';
import EventList from './EventList';
import Typography from '@material-ui/core/Typography';

export default function Event() {

    let history = useHistory();

    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        }
    });

    const handleNewEventClick = () => {
        history.push('/event/new/');
    }

    return (
        <div className="container">
            <Typography variant="h5">Events</Typography>
            <div>&nbsp;</div>
            <Fab color="secondary" style={{
                position: 'absolute',
                zIndex: 1,
                top: 50,
                left: 0,
                right: 0,
                margin: '0 auto',
            }} onClick={handleNewEventClick}>
                <AddIcon/>
            </Fab>
            <div>
                <EventList elements={globalState.trigger}/>
            </div>
        </div>
    )
}
