import http from '../../util/http';
import {useSnackbar} from 'notistack';
import {useContext} from 'react';
import AppContext from '../../AppContext';


async function getEventList (globalState, enqueueSnackbar) {

    await http.get('/api/event/get_all_events',
        globalState.userContext.accessToken
    )
    .then(response => {
        if (response.status && response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else {
            globalState.setEvents(response);
            enqueueSnackbar('Fetched ' + response.length + ' events', {variant: 'success'});
        }
        console.info(response);
    })
    .catch(err => {
        console.info('Could not fetch events: ' + err);
    })
    .finally(() => {
        // setBackdropOpen(false);
        // history.goBack();
    });
}

function deleteEvent (theEvent, globalState, enqueueSnackbar) {

    http.post('/api/event/delete_event?' +
        'event_id=' + theEvent.eventId,
        null,
        globalState.userContext.accessToken
    )
        .then(response => {
            if (response.status && response.status === 'error') {
                enqueueSnackbar(response.msg, {variant: 'error'});
            } else if (response.error && response.status) {
                enqueueSnackbar(response.status + ': ' + response.error, {variant: 'error'});
            } else {
                const newEvents = globalState.events.filter((ev) => {
                    return ev.eventId !== theEvent.eventId;
                });

                globalState.setEvents(newEvents);
                enqueueSnackbar('Deleted event ' + theEvent.name, {variant: 'success'});

            }
            console.info(response);
        })
        .catch(err => {
            console.info('Could not delete event: ' + err);
            enqueueSnackbar(err, {variant: 'error'});
        })
        .finally(() => {
            // setBackdropOpen(false);
            // history.goBack();
        });
}

export {
    getEventList,
    deleteEvent,
};