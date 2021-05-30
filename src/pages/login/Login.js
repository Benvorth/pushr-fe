import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import PushrNavigation from '../PushrNavigation';
import pushRlogo from '../../img/pushr-dots.svg';
import http from '../../util/http';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from "react-instagram-login";
import GitHubLogin from 'github-login';

import {useHistory} from "react-router-dom";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://pushr.info/">
                pushr.info
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        textAlign: 'center'
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

export default function Login({setUserContext, userContext, title, selectedIndex, setSelectedIndex}) {
    const classes = useStyles();
    let history = useHistory();

    const responseGoogle = async (googleUser) => {

        let profile = googleUser.getBasicProfile();
        debugger;
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

        // user token for backend:
        const id_token = googleUser.getAuthResponse().id_token;
        console.log('ID token: ' + id_token);

        const res = await http.put('/api/user/google', id_token);
        debugger;

        setUserContext({
            userIdToken: id_token,
            userName: profile.getName(),
            userImgUrl: profile.getImageUrl(),
            loginProvider: 'Google'
        });

        /*
        console.log(response);
        let res = response.profileObj;
        console.log(res);
        debugger;
        // this.signup(response);
        */
    }

    const responseFacebook = (response) => {
        console.log(response);
        debugger;
    }

    const responseInstagram = (response) => {
        console.log(response);
        debugger;
    };

    const responseGitHub = (response) => {
        console.log(response);
        debugger;
    };

    const onLoginClicked = () => {
        setUserContext({
            userName: 'John Doea',
            userImgUrl: 'https://i.pravatar.cc/96',
            loginProvider: 'Google'
        });
        history.push('/dashboard');
        return;
    }

    if (!!userContext && 'userImgUrl' in userContext) {
        history.push('/dashboard');
    }

    return (
        <PushrNavigation userContext={userContext} title={title} selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Paper className={classes.paper}>
                    <br/>
                    <br/>
                    <img src={pushRlogo} width="70" alt="PUSHr - open notifications"/>
                    <br/>
                    <Typography variant="h4">
                        PUSHr
                    </Typography>
                    <Typography variant="h7">
                        open notifications
                    </Typography>
                    <br/>
                    <br/>
                    <form className={classes.form} noValidate>

                        {(process.env.NODE_ENV === "production" ?
                                <>
                                    <GoogleLogin
                                        clientId="217519645658-9ink26e7bn8q4p59k7799kvi9qdqtghe.apps.googleusercontent.com"
                                        buttonText="Login with Google"
                                        onClick={onLoginClicked}
                                        onSuccess={responseGoogle}
                                        onFailure={responseGoogle}
                                        isSignedIn={true}
                                        fullWidth
                                    />
                                    {/*
                            <FacebookLogin
                                appId="123"
                                autoLoad={true}
                                fields="name,email,picture"
                                onClick={onLoginClicked}
                                callback={responseFacebook}
                            /><br/>

                            <InstagramLogin
                                clientId="123"
                                buttonText="Login"
                                onSuccess={responseInstagram}
                                onFailure={responseInstagram}
                            /><br/>

                            <GitHubLogin clientId="ac56fad434a3a3c1561e"
                                         onSuccess={responseGitHub}
                                         onFailure={responseGitHub}
                            />*/}
                                </>
                                :
                                <button onClick={onLoginClicked}>Login with google</button>
                        )}
                        <br/>


                    </form>
                    <br/>
                </Paper>
                <Box mt={2}>
                    <Copyright/>
                </Box>
            </Container>
        </PushrNavigation>
    );
}