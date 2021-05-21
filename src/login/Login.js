import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

import pushRlogo from '../img/pushr-dots.png';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import InstagramLogin from "react-instagram-login";
import GitHubLogin from 'github-login';


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
        marginTop: theme.spacing(6),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        textAlign: 'center',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

}));

export default function SignIn() {
    const classes = useStyles();

    const responseGoogle = (response) => {
        console.log(response);
        let res = response.profileObj;
        console.log(res);
        debugger;
        // this.signup(response);
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
        return;
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Paper className={classes.paper}>
                <br/>
                <br/>
                <img src={pushRlogo}/>
                <br/>
                <Typography variant="h4">
                    PUSHr
                </Typography>
                <Typography variant="h7">
                    notifying you
                </Typography>
                <br/>
                <br/>
                <form className={classes.form} noValidate>
                    <GoogleLogin
                        clientId="217519645658-9ink26e7bn8q4p59k7799kvi9qdqtghe.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onClick={onLoginClicked}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        fullWidth
                    /><br/>

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

                </form>
                <br/>
            </Paper>
            <Box mt={2}>
                <Copyright/>
            </Box>
        </Container>
    );
}