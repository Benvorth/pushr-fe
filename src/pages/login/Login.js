import React, {useEffect, useContext } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import SvgIcon  from "@material-ui/core/SvgIcon"
import Button from '@material-ui/core/Button';

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from "react-instagram-login";
import GitHubLogin from 'github-login';

import AppContext from '../../AppContext';

import pushRlogo from '../../img/pushr.svg';

import http from '../../util/http';


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
        marginTop: '25%',
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
    },
    button: {
        margin: theme.spacing(1),
        textTransform: 'none',
        width: '220px',
        alignItems: 'center',
    },
}));

export default function Login() {
    const classes = useStyles();
    let history = useHistory();

    // const [globalState, dispatchGlobalState] = useTracked();
    const globalState = useContext(AppContext);

    const responseGoogle = async (googleUser) => {

        if (!!googleUser) {
debugger;
            let profile = googleUser.getBasicProfile();

            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

            // user token for backend:
            const id_token = googleUser.getAuthResponse().id_token;
            console.log('ID token: ' + id_token);

            const res = await http.put('/api/user/google', id_token);

            globalState.setUserContext({
                accessToken: res.token,
                accessTokenCreated: res.created,
                accessTokenExpires: res.expires,
                userName: profile.getName(),
                userImgUrl: profile.getImageUrl(),
                loginProvider: 'Google'

            });
        }
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

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        if (!!globalState.userContext && globalState.userContext.accessToken) {
            history.push('/dashboard');
        }
    });

    const googleSVGIcon = (
        <SvgIcon>
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="#000" fillRule="evenodd"><path d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z" fill="#EA4335"></path><path d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z" fill="#4285F4"></path><path d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z" fill="#FBBC05"></path><path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z" fill="#34A853"></path><path fill="none" d="M0 0h18v18H0z"></path></g></svg>
        </SvgIcon>
    );

    const gitHubSVGIcon = (
        <SvgIcon>
            <svg aria-hidden="true" className="svg-icon iconGitHub" width="18" height="18" viewBox="0 0 18 18"><path d="M9 1a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 009 1z" fill="#010101"></path></svg>
        </SvgIcon>
    );

    const facebookSVGIcon = (
        <SvgIcon>
            <svg aria-hidden="true" className="svg-icon iconFacebook" width="18" height="18" viewBox="0 0 18 18"><path d="M3 1a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V3a2 2 0 00-2-2H3zm6.55 16v-6.2H7.46V8.4h2.09V6.61c0-2.07 1.26-3.2 3.1-3.2.88 0 1.64.07 1.87.1v2.16h-1.29c-1 0-1.19.48-1.19 1.18V8.4h2.39l-.31 2.42h-2.08V17h-2.5z" fill="#4167B2"></path></svg>
        </SvgIcon>
    );

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Paper className={classes.paper}>
                <br/>
                <br/>
                <img src={pushRlogo} width="72" alt="PUSHr - open notifications"/>
                <br/>
                <Typography variant="h3">
                    PUSHr
                </Typography>
                <Typography variant="h6">
                    open notifications
                </Typography>
                <br/>
                <br/>
                <form className={classes.form} noValidate>

                    {(true || process.env.NODE_ENV === "production" ?
                            <>
                                <GoogleLogin
                                    clientId="217519645658-9ink26e7bn8q4p59k7799kvi9qdqtghe.apps.googleusercontent.com"
                                    buttonText="Login with Google"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    isSignedIn={true}
                                    fullWidth
                                    render={renderProps => (
                                        <Button
                                            className={classes.button}
                                            variant='outlined'
                                            startIcon={googleSVGIcon}
                                            onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                                Login using Google
                                        </Button>
                                    )}
                                />

                                <GoogleLogin
                                    clientId='123'
                                    buttonText='Login with Google'
                                    onSuccess={false}
                                    onFailure={false}
                                    isSignedIn={true}
                                    fullWidth
                                    render={renderProps => (
                                        <Button
                                            className={classes.button}
                                            variant="outlined"
                                            startIcon={facebookSVGIcon}
                                            disabled
                                        >
                                            Login using Facebook
                                        </Button>
                                    )}
                                />

                                <GoogleLogin
                                    clientId='123'
                                    buttonText="Login with Google"
                                    onSuccess={false}
                                    onFailure={false}
                                    isSignedIn={true}
                                    fullWidth
                                    render={renderProps => (
                                        <Button
                                            className={classes.button}
                                            variant="outlined"
                                            startIcon={gitHubSVGIcon}
                                            disabled
                                        >
                                                 Login using GitHub
                                        </Button>
                                    )}
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
                            <button >Login with google</button>
                    )}
                    <br/>


                </form>
                <br/>
            </Paper>
            <Box mt={2}>
                <Copyright/>
            </Box>
        </Container>
    );
}