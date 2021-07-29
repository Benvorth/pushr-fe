import React, {useContext, useEffect} from 'react'
import { useHistory } from "react-router-dom";

import AppContext from '../../AppContext';
import MessageList from './MessageList';
import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';
import {getEventList} from '../event/EventController';
import {getMessageList} from './MessageController';
import AddIcon from '@material-ui/icons/Add';
import {Fab} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EventList from '../event/EventList';


const useStyles = makeStyles((theme) => ({
    fabButton: {
        position: 'absolute', zIndex: 1, top: 50, left: 0, right: 0, margin: '0 auto',
        color: theme.palette.getContrastText('#4f5b62'),
        backgroundColor: '#4f5b62',
    },
}));

export default function Messages() {

    let history = useHistory();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const [sortListBy, setSortListBy] = React.useState('created');
    const [sortAsc, setSortAsc] = React.useState(true);

    const globalState = useContext(AppContext);
    useEffect(() => {
        if (!globalState.userContext || !globalState.userContext.accessToken) {
            history.push('/login');
        } else if (globalState.messages.length === 0) {
            // getMessageList(globalState, enqueueSnackbar);
        }
    }, []);

    const handleNewMessageClick = () => {
        history.push('/message/new/');
    }

    const refreshMessageList = () => {
        debugger;
        getMessageList(globalState, enqueueSnackbar).then(handleMenuClose);
    }
    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleSort = (sortCol, asc) => {
        setSortListBy(sortCol);
        setSortAsc(asc);
        handleMenuClose();
    };

    globalState.events.sort((a,b) => {
        if (a[sortListBy] > b[sortListBy]) {
            return (sortAsc ? -1 : 1);
        } else if (b[sortListBy] > a[sortListBy]) {
            return (sortAsc ? 1 : -1);
        } else {
            return 0;
        }
    });

    return (
        <div className="container">
            <Fab color="inherit" className={classes.fabButton} onClick={handleNewMessageClick}>
                <AddIcon/>
            </Fab>
            <Grid container spacing={3}>
                <Grid item xs={10}>
                    <Typography variant="h5">
                        {(globalState.messages.length === 0 ? 'No messages': globalState.messages.length + ' Message' + (globalState.messages.length > 1 ? 's' : ''))}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="settings" onClick={handleMenuClick}>
                        <MoreVertIcon/>
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={menuAnchorEl}
                        keepMounted
                        open={Boolean(menuAnchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleNewMessageClick}>Create new Message</MenuItem>
                        <MenuItem onClick={()=>handleSort('created', true)}>Order by 'Created' (ascending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('created', false)}>Order by 'Created' (decending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('title', true)}>Order by 'Title' (ascending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('title', false)}>Order by 'Title' (decending)</MenuItem>
                        <MenuItem onClick={()=>refreshMessageList()}>Refresh from server</MenuItem>
                    </Menu>
                </Grid>
            </Grid>

            <div>
                <MessageList elements={globalState.messages}/>
            </div>

        </div>
    )
}
