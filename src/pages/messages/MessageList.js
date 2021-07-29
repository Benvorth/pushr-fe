import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React, {useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TriggerIcon from '@material-ui/icons/Notifications';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import QRcode from 'qrcode.react'
import Chip from '@material-ui/core/Chip';
import {useSnackbar} from 'notistack';
import AppContext from '../../AppContext';
import {useHistory} from 'react-router-dom';
import PushrDialog from '../elements/PushrDialog';
import {copyToClipboard} from '../../util/PushrUtils';
import {deleteMessage} from './MessageController';
import MessagesIcon from '@material-ui/icons/Textsms';

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

    chipIconTrigger: {
        color: '#ff7961',
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

const getEventNameById = (eventId, events) => {

    const newEvents = events.map((event) => {
        if (event.eventId === eventId) {
            return event;
        }
    });
    return newEvents[0].name;
}

export default function MessageList({elements}) {

    let history = useHistory();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const globalState = useContext(AppContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedMessage, setSelectedMessage] = React.useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
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
        globalState.setSelectedMessage(idx);
        history.push('/message/edit/');
    }

    const handleDeleteDialogOpen = (selEv) => {
        handleContextMenuClose();
        setSelectedMessage(selEv);
        setDeleteDialogOpen(true);
    };
    const handleDeleteDialogClose = () => {
        setSelectedMessage(null);
        setDeleteDialogOpen(false);
    }
    const handleDoDelete = () => {
        if (!selectedMessage) {
            console.error('No message selected for deletion');
            return;
        }
        deleteMessage(selectedMessage, globalState, enqueueSnackbar);
        setSelectedMessage(null);
        setDeleteDialogOpen(false);
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
                                            <Avatar className={classes.largeMsg}>

                                                <img src={element.icon} height={35} />
                                            </Avatar>
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
                                            <MenuItem onClick={()=>handleEdit(number)}>Edit Message</MenuItem>
                                            <MenuItem onClick={()=>handleDeleteDialogOpen(element)}>Delete Message</MenuItem>
                                        </Menu>
                                    </>
                                }
                                title={
                                    <>
                                        {element.title}
                                    </>
                                }
                                subheader={
                                    <>
                                        {element.body}<br/>
                                        {'Created: ' + timeSince(element.created) + ' ago'}<br/>
                                        <Chip icon={<TriggerIcon className={classes.chipIconTrigger} />} label={getEventNameById(element.eventId, globalState.events)} size='small' />&nbsp;
                                    </>
                                }
                            />

                        </Card>
                    </Grid>
                </Grid>
            ))}

            {(selectedMessage !== null && deleteDialogOpen ?
                <PushrDialog
                    title={'Delete'}
                    body={'Delete Message \'' + selectedMessage.title + '\'?'}
                    open={deleteDialogOpen}
                    onClose={handleDeleteDialogClose}
                    onClickAction={handleDoDelete}
                    cancelLabel={'Cancel'}
                    actionLabel={'Delete'}
                />
                : null)}
        </div>
    );
}