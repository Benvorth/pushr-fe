import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import TriggerIcon from '@material-ui/icons/Error';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, {useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import WhistleIcon from '@material-ui/icons/Sports';
import QrCodeIcon from '@material-ui/icons/CropFree';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HttpIcon from '@material-ui/icons/Http';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import QRcode from 'qrcode.react'
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {useSnackbar} from 'notistack';
import AppContext from '../../AppContext';
import {deleteEvent, subscribeUnSubscribeEvent, triggerEvent} from './EventController';
import {useHistory} from 'react-router-dom';
import PushrDialog from '../elements/PushrDialog';
import {copyToClipboard} from '../../util/PushrUtils';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        // maxWidth: 700
    },
    paper: {
        padding: theme.spacing(2),
        vAlign: 'center',
        color: theme.palette.text.secondary
    },
    iconSize: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },

    largeTrigger: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        color: theme.palette.getContrastText('#ff7961'),
        backgroundColor: '#ff7961'
    },
    largeMsg: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        color: theme.palette.getContrastText('#4f5b62'),
        backgroundColor: '#4f5b62'
    },
    largeRecipient: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        color: theme.palette.getContrastText('#263238'),
        backgroundColor: '#263238'
    },
    largeDevice: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        color: theme.palette.getContrastText('#000a12'),
        backgroundColor: '#000a12'
    },
    smallText: {
        fontSize: '10px',
        marginTop: '3px'
    }
}));

const timeSince = (milisecs) => {

    const seconds = Math.floor((new Date() - new Date(milisecs)) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

const MyIcon = (props) => {
    if (props.icon === 'whistle') {
        return (<WhistleIcon/>);
    } else if (props.icon === 'qrcode') {
        return (<QrCodeIcon/>);
    } else if (props.icon === 'scheduled') {
        return (<ScheduleIcon/>);
    } else {
        return (<HttpIcon/>);
    }
}

export default function EventList({elements}) {

    let history = useHistory();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const globalState = useContext(AppContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [subscribeDialogOpen, setSubscribeDialogOpen] = React.useState(false);
    const [unSubscribeDialogOpen, setUnsubscribeDialogOpen] = React.useState(false);
    const [triggerEventDialogOpen, setTriggerEventDialogOpen] = React.useState(false);
    const [contextMenuOpen, setContextMenuOpen] = React.useState(-1);

    const handleContextMenuClick = (idx, event) => {
        setContextMenuOpen(idx)
        setAnchorEl(event.currentTarget);
    };
    const handleContextMenuClose = () => {
        setAnchorEl(null);
        setContextMenuOpen(-1);
    };

    const handleEdit = (idx) => {
        globalState.setSelectedEvent(idx);
        history.push('/event/edit/');
    }

    const handleDeleteDialogOpen = (selEv) => {
        handleContextMenuClose();
        setSelectedEvent(selEv);
        setDeleteDialogOpen(true);
    };
    const handleDeleteDialogClose = () => {
        setSelectedEvent(null);
        setDeleteDialogOpen(false);
    }
    const handleDoDelete = () => {
        if (!selectedEvent) {
            console.error('No event selected for deletion');
            return;
        }
        deleteEvent(selectedEvent, globalState, enqueueSnackbar);
        setSelectedEvent(null);
        setDeleteDialogOpen(false);
    }

    const handleSubscribeDialogOpen = (selEv) => {
        handleContextMenuClose();
        setSelectedEvent(selEv);
        setSubscribeDialogOpen(true);
    }
    const handleSubscribeDialogClose = () => {
        setSelectedEvent(null);
        setSubscribeDialogOpen(false);
    }
    const handleDoSubscribe = () => {
        if (!selectedEvent) {
            console.error('No event selected for subscription');
            return;
        }
        subscribeUnSubscribeEvent(selectedEvent, globalState, enqueueSnackbar, true);
        setSelectedEvent(null);
        setSubscribeDialogOpen(false);
    }

    const handleUnSubscribeDialogOpen = (selEv) => {
        handleContextMenuClose();
        setSelectedEvent(selEv);
        setUnsubscribeDialogOpen(true);
    }
    const handleUnSubscribeDialogClose = () => {
        setSelectedEvent(null);
        setUnsubscribeDialogOpen(false);
    }
    const handleDoUnSubscribe = () => {
        if (!selectedEvent) {
            console.error('No event selected for subscription');
            return;
        }
        subscribeUnSubscribeEvent(selectedEvent, globalState, enqueueSnackbar, false);
        setSelectedEvent(null);
        setUnsubscribeDialogOpen(false);
    }

    const handleTriggerDialogOpen = (selEv) => {
        handleContextMenuClose();
        setSelectedEvent(selEv);
        setTriggerEventDialogOpen(true);
    }
    const handleTriggerDialogClose = () => {
        setSelectedEvent(null);
        setTriggerEventDialogOpen(false);
    }
    const handleDoTriggerEvent = () => {
        if (!selectedEvent) {
            console.error('No event selected for subscription');
            return;
        }
        triggerEvent(selectedEvent.trigger, globalState, enqueueSnackbar);
        setSelectedEvent(null);
        setUnsubscribeDialogOpen(false);
    }

    const handleCopyClpbTriggerURL = (elEv) => {
        handleContextMenuClose();
        copyToClipboard('https://pushr.info/token/' + elEv.trigger);
        enqueueSnackbar('Trigger URL copied to clipboard', {variant: 'success',});
    }

    return (
        <div className={classes.root}>
            {elements.map((element, number) => (
                <Grid container spacing={3} key={'element_id_' + number}>
                    <Grid item sm={12} xs={12}>
                        <Card >
                            <CardHeader
                                avatar={
                                    <Badge
                                        badgeContent={0}
                                        color="secondary">
                                        <Grid >
                                            <Grid item sm={12} xs={12}>
                                                <Avatar className={classes.largeTrigger}>
                                                    <QRcode
                                                        id="myqr"
                                                        value={'https://pushr.info/trigger/' + element.trigger}
                                                        size={30}
                                                        includeMargin={false}
                                                    />
                                                </Avatar>
                                            </Grid>
                                            <Grid item sm={12} xs={12} className={classes.smallText}>
                                                {element.trigger}
                                            </Grid>
                                        </Grid>
                                    </Badge>
                                }
                                action={
                                    <>
                                        <IconButton id={'simple-menu_btn_' + number} aria-label="settings" onClick={handleContextMenuClick.bind(this, number)}>
                                            <MoreVertIcon/>
                                        </IconButton>
                                        <Menu
                                            id={'simple-menu_' + number}
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={(contextMenuOpen === number)}
                                            onClose={handleContextMenuClose}
                                        >
                                            <MenuItem onClick={()=>handleEdit(number)}>Edit Event</MenuItem>
                                            <MenuItem onClick={()=>handleDeleteDialogOpen(element)}>Delete Event</MenuItem>
                                            <MenuItem onClick={()=>handleTriggerDialogOpen(element)}>Trigger Event</MenuItem>
                                            {element.subscribed ?
                                                <MenuItem onClick={() => handleUnSubscribeDialogOpen(element)}>Unsubscribe Event</MenuItem> :
                                                <MenuItem onClick={() => handleSubscribeDialogOpen(element)}>Subscribe Event</MenuItem>
                                            }
                                            <MenuItem onClick={()=>handleCopyClpbTriggerURL(element)}>Copy Trigger-URL</MenuItem>
                                            <MenuItem onClick={handleContextMenuClose}>Download QR-Code</MenuItem>
                                        </Menu>
                                    </>
                                }
                                title={
                                    <>
                                        {element.name}
                                    </>
                                }
                                subheader={
                                    <>
                                    {// element.trigger + ' <br>' +
                                        // 'Created: ' + new Date(element.created).toLocaleString("en-US") + ', ' +
                                        // 'Created: ' + timeSince(element.created) + ' ago      _' +
                                    }
                                        {(element.lastTriggered === -1 ? 'Never triggered' : 'Last triggered ' + timeSince(element.lastTriggered) + ' ago')}<br/>
                                        {'Created: ' + timeSince(element.created) + ' ago'}<br/>
                                        <Chip label={element.triggerActive ? "Active" : "Inactive"} disabled={!element.triggerActive} size='small' />&nbsp;
                                        {/*element.owned ? <Chip label='Owned' size='small' /> : null*/}&nbsp;

                                        {element.subscribed ? <Chip label="Subscribed" size="small" /> : null}&nbsp;
                                    </>
                                }
                            />

                        </Card>
                    </Grid>
                </Grid>
            ))}

            {(selectedEvent !== null && deleteDialogOpen ?
                <PushrDialog
                    title={'Delete'}
                    body={'Delete Event \'' + selectedEvent.name + '\'?'}
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    onClickAction={handleDoDelete}
                    cancelLabel={'Cancel'}
                    actionLabel={'Delete'}
                />
            : null)}

            {(selectedEvent !== null && subscribeDialogOpen ?
                <PushrDialog
                    title={'Subscribe'}
                    body={'Subscribe to Event \'' + selectedEvent.name + '\'?'}
                    open={subscribeDialogOpen}
                    onClose={handleSubscribeDialogClose}
                    onClickAction={handleDoSubscribe}
                    cancelLabel={'Cancel'}
                    actionLabel={'Subscribe'}
                />
            : null)}

            {(selectedEvent !== null && unSubscribeDialogOpen ?
                <PushrDialog
                    title={'Unsubscribe'}
                    body={'Unsubscribe from Event \'' + selectedEvent.name + '\'?'}
                    open={unSubscribeDialogOpen}
                    onClose={handleUnSubscribeDialogClose}
                    onClickAction={handleDoUnSubscribe}
                    cancelLabel={'Cancel'}
                    actionLabel={'Unsubscribe'}
                />
            : null)}

            {(selectedEvent !== null && triggerEventDialogOpen ?
                <PushrDialog
                    title={'Trigger'}
                    body={'Trigger Event \'' + selectedEvent.name + '\'?'}
                    open={triggerEventDialogOpen}
                    onClose={handleTriggerDialogClose}
                    onClickAction={handleDoTriggerEvent}
                    cancelLabel={'Cancel'}
                    actionLabel={'Trigger'}
                />
                : null)}
        </div>
    );
}
