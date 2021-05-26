import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core';
// import './App.css';
import Login from './login/Login';
import PushServicePanel from './pushService/pushServicePanel';

import PushrNavigation from './pages/PushrNavigation';
import Dashboard from './dashboard/Dashboard';

function App() {

    const theme = createMuiTheme({
        palette: {
            primary: {
                light: '#4f5b62',
                main: '#000a12',
                dark: '#263238',
                contrastText: '#eee',
            },
            secondary: {
                light: '#ff7961',
                // main: '#f44336',
                main: '#ff7961',
                dark: '#ba000d',
                contrastText: '#000',
            },
        },
    });

    const [userContext, setUserContext] = useState({
        userName: 'Benjamin Steinvorth',
        userImgUrl: 'https://lh3.googleusercontent.com/a-/AOh14GhHZiWTn02o7flxrwSObvb_vv4sRli0kV7ccyL_vA=s96-c',
    });



    return (
        <div className="App">
            <ThemeProvider theme={theme}>
            <Router>
                <PushrNavigation userContext={userContext}>
                    <Switch>
                        <Route exact path='/' render={(props) => (
                            <Login {...props} setUserContext={setUserContext} userContext={userContext}/>
                        )} />
                        <Route path='/dashboard' render={(props) => (
                            <Dashboard {...props} userContext={userContext}/>
                        )} />
                        <Route path='/trigger' component={Login} />
                        <Route path='/messages' component={Login} />
                        <Route path='/settings' component={PushServicePanel} />
                        <Route path='/logout' component={Login} />
                    </Switch>
                </PushrNavigation>
            </Router>
            </ThemeProvider>
        </div>

    );
}

export default App;
