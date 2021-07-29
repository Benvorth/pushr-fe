import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AppContext from './AppContext';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Event from './pages/event/Event';
import SubscribeEvent from './pages/event/SubscribeEvent';
import NewOrModifyEvent from './pages/event/NewOrModifyEvent';
import Messages from './pages/messages/Messages';
import Recipients from './pages/Recipients';
import Settings from './pages/settings/Settings';
import Logout from './pages/Logout';
import Token from './pages/Token';
import EnvelopeWizard from './pages/dashboard/EnvelopeWizzard';
import PushrNavigation from './pages/navigation/PushrNavigation';
import NewOrModifyMessage from './pages/messages/NewOrModifyMessage';


// process.env.NODE_ENV === "production"
function App() {

    const [userContext, setUserContext] = useState(
        {
            accessToken: null,
            accessTokenCreated: null,
            accessTokenExpires: null,
            userName: null,
            userImgUrl: null,
            loginProvider: null, // Google, GitHub, Facbook, ...
        });
    const [selectedNaviIndex, setSelectedNaviIndex] = useState(0);

    const [token, setToken] = useState(null);
    const [backdropOpen, setBackdropOpen] = useState(false);
    const [userSubscription, setUserSubscription] = useState(null);

    const [selectedEvent, setSelectedEvent] = useState(-1); // index of the event we want to edit. Used in NewOrModifyEvent
    const [selectedMessage, setSelectedMessage] = useState(-1); // index of the event we want to edit. Used in NewOrModifyEvent
    const [events, setEvents] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [devices, setDevices] = useState([]);



    // https://www.savaslabs.com/blog/using-react-global-state-hooks-and-context
    const globalStateInContext = {
        userContext: userContext, setUserContext: setUserContext,
        selectedNaviIndex: selectedNaviIndex, setSelectedNaviIndex: setSelectedNaviIndex,
        events: events, setEvents: setEvents,
        messages: messages, setMessages: setMessages,
        recipients: recipients, setRecipients: setRecipients,
        devices: devices, setDevices: setDevices,

        selectedEvent: selectedEvent, setSelectedEvent: setSelectedEvent,
        selectedMessage: selectedMessage, setSelectedMessage: setSelectedMessage,
        backdropOpen: backdropOpen, setBackdropOpen: setBackdropOpen,

    }

    return (
        <AppContext.Provider value={globalStateInContext}>
        <Router>
            <Switch>
                <Route exact path='/' render={(props) => (
                    <Login {...props}
                    />
                )}/>
                <Route path='/login' render={(props) => (
                    <Login {...props}
                    />
                )}/>
                <Route path='/token/:token' render={(props) => (
                    <Token {...props}
                           setToken={setToken}
                    />
                )}/>
                <Route path='/dashboard' render={(props) => (
                    <PushrNavigation title={''}>
                        <Dashboard {...props}
                                   token={token} setToken={setToken}
                                   userSubscription={userSubscription} setUserSubscription={setUserSubscription}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/envelope/new' render={(props) => (
                    <PushrNavigation title={''}>
                        <EnvelopeWizard {...props}
                                 token={token} setToken={setToken}
                        />
                    </PushrNavigation>
                )}/>

                <Route path='/event/edit' render={(props) => (
                    <PushrNavigation title={''}>
                        <NewOrModifyEvent {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/event/new/:trigger?' render={(props) => (
                    <PushrNavigation title={''}>
                        <NewOrModifyEvent {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/event/subscribe/:trigger' render={(props) => (
                    <PushrNavigation title={''}>
                        <SubscribeEvent {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/events' render={(props) => (
                    <PushrNavigation title={''}>
                        <Event {...props}
                        />
                    </PushrNavigation>
                )}/>

                <Route path='/messages' render={(props) => (
                    <PushrNavigation title={''}>
                        <Messages {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/message/new' render={(props) => (
                    <PushrNavigation title={''}>
                        <NewOrModifyMessage {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/message/edit' render={(props) => (
                    <PushrNavigation title={''}>
                        <NewOrModifyMessage {...props}
                        />
                    </PushrNavigation>
                )}/>

                <Route path='/recipients' render={(props) => (
                    <PushrNavigation title={'Recipients'}>
                        <Recipients {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/settings' render={(props) => (
                    <PushrNavigation title={''}>
                        <Settings {...props}
                        />
                    </PushrNavigation>
                )}/>
                <Route path='/logout' render={(props) => (
                    <PushrNavigation title={''}>
                        <Logout {...props}
                        />
                    </PushrNavigation>
                )}/>
            </Switch>
        </Router>
        </AppContext.Provider>
    );
}

export default App;
