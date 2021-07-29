import React, {useContext, useEffect, useRef, useState} from 'react'
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import AppContext from '../../AppContext';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';

import { useSnackbar } from 'notistack';
import {saveOrUpdateMessage} from './MessageController';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


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

let newMessage = true;

export default function NewOrModifyMessage() {

    const classes = useStyles();
    let history = useHistory();
    // let {trigger} = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const globalState = useContext(AppContext);

    const [eventId, setEventId] = React.useState(null);
    const [messageId, setMessageId] = React.useState(null);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const [image, setImage] = React.useState('');
    const [icon, setIcon] = React.useState('https://pushr.info/img/pushr-72.png');
    const [badge, setBadge] = React.useState('https://pushr.info/img/pushr-badge_96.png');
    const [dir, setDir] = React.useState('auto');
    const [lang, setLang] = React.useState('');

    const [invalidMsgTitle, setInvalidMsgTitle] = React.useState(false);


    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        } else {

            if (globalState.selectedMessage > -1) { // edit-message mode
                newMessage = false;
                const pushrMsg = globalState.messages[globalState.selectedMessage];
                setMessageId(pushrMsg.messageId);
                setTitle(pushrMsg.title);
                setBody(pushrMsg.body);
                setImage(pushrMsg.image);
                setIcon(pushrMsg.icon);
                setBadge(pushrMsg.badge);
            } else { // new-event mode

            }
        }
    },// array of variables that can trigger an update if they change. Pass an
     // an empty array if you just want to run it once after component mounted.
        []);

    const handleEventChanged = (event)=> {
        setEventId(event.target.value);
    }
    const handleMsgTitleChange = (event)=> {
        setTitle(event.target.value);
    }
    const handleMsgBodyChange = (event)=> {
        setBody(event.target.value);
    }
    const handleMsgImageChange = (event)=> {
        setImage(event.target.value);
    }
    const handleMsgIconChange = (event)=> {
        setIcon(event.target.value);
    }
    const handleMsgBadgeChange = (event)=> {
        setBadge(event.target.value);
    }
    const handleMsgDirChange = (event)=> {
        setDir(event.target.value);
    }
    const handleMsgLangChange = (event)=> {
        setLang(event.target.value);
    }

    let onCancelClicked = () => {
        globalState.setSelectedMessage(-1);
        history.goBack();
    }

    let onSaveClicked = () => {

        if (title === null || title.trim() === '') {
            setInvalidMsgTitle(true);
            return;
        }

        saveOrUpdateMessage(globalState, enqueueSnackbar,
            messageId, eventId, title, body, icon, badge)
        .then(()=>{
            globalState.setBackdropOpen(false);
            globalState.setSelectedMessage(-1);
            history.goBack();
        });
    }


    return (
        <div className="container">
            <Typography variant="h5">{(newMessage ? 'New' : 'Edit')} Message</Typography>
            <form className={classes.root} noValidate autoComplete="off">

                <FormControl variant="outlined" >
                    <InputLabel htmlFor="outlined-age-native-simple" className={classes.inputLabel}>
                        This event triggers the message
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={eventId}
                        onChange={handleEventChanged}
                    >
                        {
                            globalState.events.map((evt, i) => {
                                return (<MenuItem value={evt.eventId}>{evt.name}</MenuItem>);
                            })
                        }
                    </Select>
                </FormControl>

                <TextField
                    required label='Title' variant='outlined'
                    value={title}
                    onChange={handleMsgTitleChange}
                    error={invalidMsgTitle}
                    helperText={(invalidMsgTitle ? 'Invalid title' : '')}
                />
                <TextField
                    label='Body' variant='outlined'
                    value={body}
                    onChange={handleMsgBodyChange}
                    multiline rows={3}
                />

                {/*
                <FormControl variant="outlined" >
                    <InputLabel htmlFor="outlined-age-native-simple" className={classes.inputLabel}>Language</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={lang}
                        onChange={handleMsgLangChange}
                    >
                        <MenuItem value={'en-US'}>en-US</MenuItem>
                        <MenuItem value={'de-DE'}>de-DE</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" >
                    <InputLabel htmlFor="outlined-age-native-simple" className={classes.inputLabel}>Direction</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={dir}
                        onChange={handleMsgDirChange}
                    >
                        <MenuItem value={'auto'}>auto</MenuItem>
                        <MenuItem value={'rtl'}>Right-to-left</MenuItem>
                        <MenuItem value={'ltr'}>Left-to-right</MenuItem>
                    </Select>
                </FormControl>
                */}

                <FormControl variant="outlined">
                    <InputLabel htmlFor="standard-adornment-password">Icon</InputLabel>
                    <OutlinedInput
                        id="outlined-basic-icon" label="Icon"
                        variant="outlined"
                        value={icon}
                        onChange={handleMsgIconChange}
                        endAdornment={
                           <InputAdornment position="end">
                               <IconButton
                                   size={'small'}
                               >
                                   <img src={icon} height={45} />
                               </IconButton>

                           </InputAdornment>
                        }
                    />
                </FormControl>

                {/*<FormControl variant="outlined">
                    <InputLabel htmlFor="standard-adornment-password">Image</InputLabel>
                    <OutlinedInput
                        id="outlined-basic-img" label="Image"
                        variant="outlined"
                        value={image}
                        endAdornment={
                           <InputAdornment position="end">
                               <IconButton
                                   size={'small'}
                               >
                                   <CopyIcon/>
                               </IconButton>
                               <img src={image} />
                           </InputAdornment>
                        }
                    />
                </FormControl>*/}

                <FormControl variant="outlined">
                    <InputLabel htmlFor="standard-adornment-password">Badge</InputLabel>
                    <OutlinedInput
                        InputProps={{readOnly: true,}}
                        id="outlined-basic-Badge" label="Badge"
                        variant="outlined"
                        value={badge}
                        onChange={handleMsgBadgeChange}
                        endAdornment={
                           <InputAdornment position="end">
                               <div style={{backgroundColor: 'black', height: 'auto'}} >
                               <IconButton
                                   size={'small'}
                               >
                                   <img src={badge} height={25} />
                               </IconButton>
                            </div>
                           </InputAdornment>
                        }
                    />
                </FormControl>

                &nbsp;<br/>
                &nbsp;<br/>
                <Button variant="outlined" color="primary" className={classes.button}
                        onClick={onCancelClicked}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onSaveClicked}
                    disabled={(newMessage === 'fetching...')}
                >
                    Save
                </Button>
            </form>
        </div>
    )
}
