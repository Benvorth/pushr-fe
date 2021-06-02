import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

// import './App.css';
import Login from './pages/login/Login';
import Dashboard from './pages/Dashboard';
import Trigger from './pages/Trigger';
import Messages from './pages/Messages';
import Recipients from './pages/Recipients';
import Settings from './pushService/pushServicePanel';
import Logout from './pages/Logout';
import Token from './pages/Token';

function App() {

    const [userContext, setUserContext] = useState(
        (true || process.env.NODE_ENV === "production" ? null :
                {
                    userName: 'John Doea',
                    userImgUrl: 'https://i.pravatar.cc/96',
                    loginProvider: 'Google'
                }
        ));

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [token, setToken] = useState(null);
    const [userSubscription, setUserSubscription] = useState(null);

    return (
        <Router>
            <Switch>
                <Route exact path='/' render={(props) => (
                    <Login {...props}
                           setUserContext={setUserContext} userContext={userContext} title={'Login'}
                           selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
                <Route path='/login' render={(props) => (
                    <Login {...props}
                           setUserContext={setUserContext} userContext={userContext} title={'Login'}
                           selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
                <Route path='/token/:token' render={(props) => (
                    <Token {...props}
                           setToken={setToken}
                    />
                )}/>
                <Route path='/dashboard' render={(props) => (
                    <Dashboard {...props}
                               userContext={userContext} title={'Dashboard'}
                               selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                               token={token} setToken={setToken}
                               userSubscription={userSubscription} setUserSubscription={setUserSubscription}
                    />
                )}/>
                <Route path='/trigger' render={(props) => (
                    <Trigger {...props}
                             userContext={userContext} title={'Trigger'}
                             selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
                <Route path='/messages' render={(props) => (
                    <Messages {...props} userContext={userContext} title={'Messages'}
                              selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
                <Route path='/recipients' render={(props) => (
                    <Recipients {...props}
                                userContext={userContext} title={'Recipients'}
                                selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
                <Route path='/settings' render={(props) => (
                    <Settings {...props}
                              userContext={userContext} title={'Settings'}
                              selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
                <Route path='/logout' render={(props) => (
                    <Logout {...props}
                           userContext={userContext} setUserContext={setUserContext} title={'Logout'}
                           selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}
                    />
                )}/>
            </Switch>
        </Router>
    );
}

export default App;
