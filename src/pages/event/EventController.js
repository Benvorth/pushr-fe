import http from '../../util/http';
import {useSnackbar} from 'notistack';
import {useContext} from 'react';
import AppContext from '../../AppContext';
import {getUserSubscription} from '../../pushService/pushServiceController';


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

function saveOrUpdateEvent (globalState, enqueueSnackbar,
                            eventName, eventId, newTrigger, triggerActive, subscribeNow) {

    globalState.setBackdropOpen(true);
    return http.post("/api/event/save_event" +
        "?event_name=" + encodeURIComponent(eventName) +
        (!!eventId ? '&event_id=' + encodeURIComponent(eventId) : '') +
        "&trigger=" + encodeURIComponent(newTrigger) +
        "&trigger_active=" + encodeURIComponent(triggerActive) +
        "&subscribe=" + encodeURIComponent(subscribeNow),
        '',
        globalState.userContext.accessToken
    )
    .then(response => {
        if (response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else if (response.status === 'success') {
            const theEvent = response.content;
            let found = false;
            let newEvents = globalState.events.map((evt) => {
                if (evt.eventId === theEvent.eventId) { // update existing event
                    found = true;
                    return theEvent;
                }
                return evt;
            });
            if (!found) { // a new event
                newEvents.push(theEvent);
            }
            globalState.setEvents(newEvents);

            enqueueSnackbar(response.msg, {variant: 'success'});
        }
        console.info(response);
    })
    .catch(err => {
        console.info('Could not create new Event: ' + err);
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

function subscribeUnSubscribeEvent (theEvent, globalState, enqueueSnackbar, subscribe) {

    http.post('/api/event/subscribe_unsubscribe_to_event?' +
        'event_id=' + theEvent.eventId +
        '&subscribe=' + subscribe,
        null,
        globalState.userContext.accessToken
    )
    .then(response => {
        if (response.status && response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else if (response.error && response.status) {
            enqueueSnackbar(response.status + ': ' + response.error, {variant: 'error'});
        } else {
            theEvent.subscribed = subscribe;

            const newEvents = globalState.events.map((evt) => {
                if (evt.eventId === theEvent.eventId) {
                    evt.subscribed = subscribe;
                }
                return evt;
            });
            globalState.setEvents(newEvents);

            if (subscribe) {
                enqueueSnackbar('Subscribed to event ' + theEvent.name, {variant: 'success'});
            } else {
                enqueueSnackbar('Unsubscribed from event ' + theEvent.name, {variant: 'success'});
            }

        }
        console.info(response);
    })
    .catch(err => {
        console.info('Could not change subscription status for event: ' + err);
        enqueueSnackbar(err, {variant: 'error'});
    })
    .finally(() => {
    });
}

function fetchRandomTrigger (globalState, enqueueSnackbar) {

    return http.get(
        '/api/event/get_new_trigger',
        globalState.userContext.accessToken
    )
    .then(response => {
        console.info(response);
        if (response.status && response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else if (response.error && response.status) {
            enqueueSnackbar(response.status + ': ' + response.error, {variant: 'error'});
        } else {
            console.log('new trigger ' + response.msg);
            return response.msg;
        }
        return '';
    })
    .catch(err => {
        console.info('Could not get new trigger: ' + err);
        enqueueSnackbar(err, {variant: 'error'});
    });
}

function triggerEvent (trigger, globalState, enqueueSnackbar) {

    http.get(
        '/api/push' +
        '?trigger=' + encodeURIComponent(trigger),
        globalState.userContext.accessToken
    )
    .then(response => {
        if (response.status && response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else if (response.error && response.status) {
            enqueueSnackbar(response.status + ': ' + response.error, {variant: 'error'});
        } else {
            const updatedEvt = response.content;
            const newEvents = globalState.events.map((evt) => {
                if (evt.eventId === updatedEvt.eventId) {
                    return updatedEvt;
                }
                return evt;
            });
            globalState.setEvents(newEvents);

            enqueueSnackbar(response.msg, {variant: 'success'});
        }
        console.info(response);
    })
    .catch(err => {
        console.info('Could not trigger event: ' + err);
        enqueueSnackbar(err, {variant: 'error'});
    })
    .finally(() => {
    });
}

export {
    getEventList,
    saveOrUpdateEvent, deleteEvent, subscribeUnSubscribeEvent,
    triggerEvent, fetchRandomTrigger,
};