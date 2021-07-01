import React, {useContext, useEffect, useRef, useState} from 'react'
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import Typography from '@material-ui/core/Typography';
import http from "../../util/http";
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

import CopyIcon from '@material-ui/icons/FileCopy';

import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';

import { useSnackbar } from 'notistack';
import {fetchRandomTrigger, getEventList, saveOrUpdateEvent} from './EventController';
import {copyToClipboard} from '../../util/PushrUtils';

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
    inputLabel: {
        backgroundColor: 'white',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

let newEvent = true;

export default function NewOrModifyEvent() {

    const classes = useStyles();
    let history = useHistory();
    let {trigger} = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const globalState = useContext(AppContext);

    const [newTrigger, setNewTrigger] = useState('fetching...');
    const [eventId, setEventId] = React.useState(null);
    const [eventName, setEventName] = React.useState('');
    const [triggerPermission, setTriggerPermission] = React.useState('everyone');
    const [subscribePermission, setSubscribePermission] = React.useState('everyone');
    const [triggerActive, setTriggerActive] = React.useState(true);
    const [subscribeNow, setSubscribeNow] = React.useState(true);
    const [invalidEventName, setInvalidEventName] = React.useState(false);

    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        } else {
            if (!!trigger) { // new-event-for-given-trigger mode
                // check if trigger already claimed
                setNewTrigger(trigger);
            } else if (globalState.selectedEvent > -1) { // edit-event mode
                newEvent = false;
                const pushrEvent = globalState.events[globalState.selectedEvent];
                setEventId(pushrEvent.eventId);
                setEventName(pushrEvent.name);
                setNewTrigger(pushrEvent.trigger);
                setTriggerActive(pushrEvent.triggerActive);
                setSubscribeNow(pushrEvent.subscribed);
            } else { // new-event mode
                // fetch a random trigger for this trigger
                fetchNewRandomTrigger();
            }
        }
    },// array of variables that can trigger an update if they change. Pass an
     // an empty array if you just want to run it once after component mounted.
        []);

    const handleEventNameChange = (event)=> {
        setEventName(event.target.value);
    }

    const handleClickCopyTriggerURL = () => {
        copyToClipboard('https://pushr.info/token/' + newTrigger);
        enqueueSnackbar('Trigger URL copied to clipboard', {variant: 'success',});
    }

    const handleMouseDownTriggerURL = (event) => {
        event.preventDefault();
    }

    const handleTriggerPermissionChange = (event) => {
        setTriggerPermission(event.target.value);
    }
    const handleSubscribePermissionChange =(event) => {
        setSubscribePermission(event.target.value);
    }

    const handleTriggerActiveChecked = (event) => {
        setTriggerActive(event.target.checked);
    }

    const toggleSubscribeNow = (event) => {
        setSubscribeNow(event.target.checked);
    }

    const fetchNewRandomTrigger = () => {
        setNewTrigger('fetching...');
        fetchRandomTrigger(globalState, enqueueSnackbar)
        .then((fetchedTrigger) => {
            setNewTrigger(fetchedTrigger);
        })
    }

    let onCancelClicked = () => {
        globalState.setSelectedEvent(-1);
        history.goBack();
    }

    let onSaveClicked = () => {

        if (eventName === null || eventName.trim() === '') {
            setInvalidEventName(true);
            return;
        }

        saveOrUpdateEvent(globalState, enqueueSnackbar,
            eventName, eventId, newTrigger, triggerActive, subscribeNow)
        .then(()=>{
            globalState.setBackdropOpen(false);
            globalState.setSelectedEvent(-1);
            history.goBack();
        });
    }


    return (
        <div className="container">
            <Typography variant="h5">{(newEvent ? 'New' : 'Edit')} Event</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    required label='Event name' variant='outlined'
                    value={eventName}
                    onChange={handleEventNameChange}
                    error={invalidEventName}
                    helperText={(invalidEventName ? 'Invalid event name' : '')}
                />
                {/*<TextField disabled label="Trigger" variant="outlined" value={newTrigger}/>*/}

                <FormControl variant="outlined">
                    <InputLabel htmlFor="standard-adornment-password">Trigger URL</InputLabel>
                    <OutlinedInput
                        InputProps={{readOnly: true,}}
                        id="outlined-basic" label="Trigger URL"
                        variant="outlined"
                        value={'https://pushr.info/token/' + newTrigger}
                        endAdornment={
                           <InputAdornment position="end">
                               <IconButton
                                   aria-label="toggle password visibility"
                                   onClick={handleClickCopyTriggerURL}
                                   onMouseDown={handleMouseDownTriggerURL}
                                   size={'small'}
                                   color='secondary'
                               >
                                   <CopyIcon/>
                               </IconButton>
                           </InputAdornment>
                        }
                    />
                </FormControl>

                <FormControl variant="outlined" >
                    <InputLabel htmlFor="outlined-age-native-simple" className={classes.inputLabel}>Who can trigger this event?</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={triggerPermission}
                        onChange={handleTriggerPermissionChange}
                    >
                        <MenuItem value={'everyone'}>Everyone</MenuItem>
                        <MenuItem value={'authenticated'}>Only authenticated users</MenuItem>
                        <MenuItem value={'me'}>Only I</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" >
                    <InputLabel htmlFor="outlined-age-native-simple" className={classes.inputLabel}>Who can subscribe to this event?</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label2"
                        id="demo-simple-select-helper2"
                        value={subscribePermission}
                        onChange={handleSubscribePermissionChange}
                    >
                        <MenuItem value={'everyone'}>Everyone</MenuItem>
                        <MenuItem value={'authenticated'}>Only authenticated users</MenuItem>
                        <MenuItem value={'me'}>Only I</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={<Switch checked={triggerActive} onChange={handleTriggerActiveChecked} />}
                    label={'Event is ' + (triggerActive ? '' : 'in') + 'active'}
                />
                <FormControlLabel
                    control={<Switch checked={subscribeNow} onChange={toggleSubscribeNow} />}
                    label={'' + (subscribeNow ? 'S' : 'Don\'t s') + 'ubscribe me to this event now'}
                />

                {/*<FormControl component="fieldset">
                    <FormLabel component="legend">Who can pull this trigger?</FormLabel>
                    <RadioGroup name="triggerPermission1" value={triggerPermission} onChange={handleTriggerPermissionChange}>
                        <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
                        <FormControlLabel disabled value="authenticated" control={<Radio />} label="Only authenticated users" />
                        <FormControlLabel disabled value="me" control={<Radio />} label="Only myself" />
                    </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                    <FormLabel component="legend">Who can subscribe to this trigger?</FormLabel>
                    <RadioGroup name="subscribePermission1" value={triggerPermission} onChange={handleSubscribePermissionChange}>
                        <FormControlLabel value="everyone" control={<Radio />} label="Everyone" />
                        <FormControlLabel disabled value="authenticated" control={<Radio />} label="Only authenticated users" />
                        <FormControlLabel disabled value="me" control={<Radio />} label="Only myself" />
                    </RadioGroup>
                </FormControl>
                */}

                &nbsp;<br/>
                &nbsp;<br/>
                <Button variant="outlined" color="primary" className={classes.button} onClick={onCancelClicked}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onSaveClicked}
                    disabled={(newTrigger === 'fetching...')}
                >
                    Save
                </Button>
            </form>
        </div>
    )
}
