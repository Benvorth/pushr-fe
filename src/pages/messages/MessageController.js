import http from '../../util/http';


async function getMessageList (globalState, enqueueSnackbar) {

    await http.get('/api/message',
        globalState.userContext.accessToken
    )
    .then(response => {
        if (response.status && response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else {
            globalState.setMessages(response);
            enqueueSnackbar('Fetched ' + response.length + ' messages', {variant: 'success'});
        }
        console.info(response);
    })
    .catch(err => {
        console.info('Could not fetch messages: ' + err);
    })
    .finally(() => {
        // setBackdropOpen(false);
        // history.goBack();
    });
}

function saveOrUpdateMessage (globalState, enqueueSnackbar,
                              messageId, eventId, title, body, icon, badge)
{
    // work here
    globalState.setBackdropOpen(true);
    return http.post("/api/message" +
        "?title=" + encodeURIComponent(title) +
        "&body=" + encodeURIComponent(body) +
        "&icon=" + encodeURIComponent(icon) +
        "&badge=" + encodeURIComponent(badge) +
        (!!messageId ? '&message_id=' + encodeURIComponent(messageId) : '') +
        (!!eventId ? '&event_id=' + encodeURIComponent(eventId) : '')

        ,
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

function deleteMessage (theMessage, globalState, enqueueSnackbar) {

    http.del('/api/message/' +
        '?message_id=' + theMessage.messageId,
        null,
        globalState.userContext.accessToken
    )
    .then(response => {
        if (response.status && response.status === 'error') {
            enqueueSnackbar(response.msg, {variant: 'error'});
        } else if (response.error && response.status) {
            enqueueSnackbar(response.status + ': ' + response.error, {variant: 'error'});
        } else {
            const newMessages = globalState.messages.filter((msg) => {
                return msg.messageId !== theMessage.messageId;
            });
            globalState.setMessages(newMessages);
            enqueueSnackbar('Deleted messages ' + theMessage.title, {variant: 'success'});
        }
        console.info(response);
    })
    .catch(err => {
        console.info('Could not delete message: ' + err);
        enqueueSnackbar(err, {variant: 'error'});
    })
    .finally(() => {
        // setBackdropOpen(false);
        // history.goBack();
    });
}

export {
    getMessageList,
    saveOrUpdateMessage,
    deleteMessage,
};