import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import './App.css';
import Login from './login/Login';
import LoginByGoogle from './login/LoginByGoogle';

import PushrNavigation from './pages/PushrNavigation';
import Dashboard from './dashboard/Dashboard';
import Dashboard2 from './dashboard/Dashboard2';
import Dashboard3 from './dashboard/Dashboard3';
import Dashboard4 from './dashboard/Dashboard4';



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

    let userContext = {
        userName: 'Benjamin Steinvorth',
        userImgUrl: 'https://lh3.googleusercontent.com/a-/AOh14GhHZiWTn02o7flxrwSObvb_vv4sRli0kV7ccyL_vA=s96-c',
    };

    return (

        <div className="App">
            <ThemeProvider theme={theme}>
            <Router>
                <PushrNavigation userContext={userContext}>
                    <Switch>
                        <Route exact path='/' component={Login} />
                        <Route path='/Dashboard' component={Dashboard} />
                    </Switch>
                </PushrNavigation>
            </Router>
            </ThemeProvider>
        </div>

    );
}

export default App;
