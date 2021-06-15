import React, {useContext, useEffect, useState} from 'react'
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import FormHelperText from '@material-ui/core/FormHelperText';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '95%',
        },
    },
    button: {
        width: '150px',
    },
    permissionFormControl: {
        margin: theme.spacing(1),
        maxWidth: 350,
    },
}));

export default function SubscribeEvent() {

    const classes = useStyles();
    let history = useHistory();
    let {trigger, eventName, triggerPermission, subscribePermission, triggerActive} = useParams();

    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        }
    },// array of variables that can trigger an update if they change. Pass an
     // an empty array if you just want to run it once after component mounted.
        []);

    const onSubscribeClicked = () => {

        /*
        POST
        '/api/event/subscribe_event?'
        'trigger=' + trigger +
         */

        history.goBack();
    }

    return (
        <div className="container">
            <Typography variant="h5">Subscribe to Event</Typography>


            <form className={classes.root} noValidate autoComplete="off">
                <TextField InputProps={{readOnly: true,}} required id="outlined-basic" label="Event name" variant="outlined" value={eventName}/>
                <TextField disabled id="outlined-basic" label="Trigger" variant="outlined" value={trigger}/>
                <TextField InputProps={{readOnly: true,}} id="outlined-basic" label="Trigger URL" variant="outlined" value={'https://pushr.info/token/' + trigger}/>

                <FormControl className={classes.permissionFormControl} >
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={triggerPermission}
                        disabled
                    >
                        <MenuItem value={'everyone'}>Everyone</MenuItem>
                        <MenuItem value={'authenticated'}>Only authenticated users</MenuItem>
                        <MenuItem value={'me'}>Only I</MenuItem>
                    </Select>
                    <FormHelperText>can <b>trigger</b> this event</FormHelperText>
                </FormControl>

                <FormControl className={classes.permissionFormControl} >
                    <Select
                        labelId="demo-simple-select-helper-label2"
                        id="demo-simple-select-helper2"
                        value={subscribePermission}
                        disabled
                    >
                        <MenuItem value={'everyone'}>Everyone</MenuItem>
                        <MenuItem value={'authenticated'}>Only authenticated users</MenuItem>
                        <MenuItem value={'me'}>Only I</MenuItem>
                    </Select>
                    <FormHelperText>can <b>subscribe</b> to this event</FormHelperText>
                </FormControl>

                <FormControlLabel
                    control={<Switch disabled checked={triggerActive}  />}
                    label={'Event is ' + (triggerActive ? '' : 'in') + 'active'}
                />

                <Button variant="contained" color="primary" className={classes.button} onClick={onSubscribeClicked}>
                    Subscribe
                </Button>
            </form>
        </div>
    )
}
