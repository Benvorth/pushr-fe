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

function copyToClipboard (text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}

export default function NewEvent() {

    const classes = useStyles();
    let history = useHistory();
    let {trigger} = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const eventNameElement = useRef(null);

    const [newTrigger, setNewTrigger] = useState('fetching...');
    const [eventName, setEventName] = React.useState('');
    const [triggerPermission, setTriggerPermission] = React.useState('everyone');
    const [subscribePermission, setSubscribePermission] = React.useState('everyone');
    const [triggerActive, setTriggerActive] = React.useState(true);
    const [subscribeNow, setSubscribeNow] = React.useState(true);
    const [copyToClipboardInfoOpen, setCopyToClipboardInfoOpen] = React.useState(false);
    const [backdropOpen, setBackdropOpen] = React.useState(false);

    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        } else {
            if (!!trigger) {
                // check if trigger already claimed
                setNewTrigger(trigger);
            } else {
                // fetch a random trigger for this trigger
                fetchNewRandomTrigger();
            }
        }
    },// array of variables that can trigger an update if they change. Pass an
     // an empty array if you just want to run it once after component mounted.
        []);

    const handleCopyToClipboardInfoOpen = () => {
        enqueueSnackbar('Trigger URL copied to clipboard', {
            variant: 'success',
        });
    };

    const handleEventNameChange = (event)=> {
        setEventName(event.target.value);
    }

    const handleClickCopyTriggerURL = () => {
        copyToClipboard('https://pushr.info/token/' + newTrigger);
        handleCopyToClipboardInfoOpen();
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
        http
            // .post("/api/subscribe", userSubscription)
            .get("/api/event/get_new_trigger",
                globalState.userContext.accessToken)
            .then(response => {
                console.log('new trigger ' + response.msg);
                setNewTrigger(response.msg);
            })
            .catch(err => {
                console.info('Could not get new trigger: ' + err);
            });
    }

    let onSaveClicked = () => {
        setBackdropOpen(true);
        http.post("/api/event/create_event" +
            "?event_name=" + encodeURIComponent(eventName) +
            "&trigger=" + encodeURIComponent(trigger) +
            "&trigger_active=" + encodeURIComponent(triggerActive) +
            "&subscribe=" + encodeURIComponent(subscribeNow),
            '',
            globalState.userContext.accessToken
        )
        .then(response => {
            console.info(response);
        })
        .catch(err => {
            console.info('Could not create new Event: ' + err);
        })
        .finally(() => {
            setBackdropOpen(false);
            history.goBack();
        });
        /*
        POST
        '/api/event/create_event?'

        "&event_name=" + eventName +
        "&trigger=" + trigger +
        "&trigger_active=" + triggerActive +
        "&subscribe=" + subscribeNow +
        */
    }

    return (
        <div className="container">
            <Typography variant="h5">New Event</Typography>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField required label='Event name' variant='outlined' defaultValue=''
                           value={eventName}
                           onChange={handleEventNameChange}/>
                {/*<TextField disabled label="Trigger" variant="outlined" value={newTrigger}/>*/}

                <FormControl variant="outlined">
                    <InputLabel htmlFor="standard-adornment-password">Trigger URL</InputLabel>
                    <OutlinedInput InputProps={{readOnly: true,}} id="outlined-basic" label="Trigger URL" variant="outlined"
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
                <Button variant="outlined" color="primary" className={classes.button} onClick={onSaveClicked}>
                    Cancel
                </Button>
                <Button variant="contained" color="primary" className={classes.button} onClick={onSaveClicked}>
                    Save
                </Button>
            </form>
        </div>
    )
}
