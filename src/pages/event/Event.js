import React, {useContext, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import {Fab} from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import AppContext from '../../AppContext';
import EventList from './EventList';
import Typography from '@material-ui/core/Typography';
import CopyIcon from '@material-ui/icons/FileCopy';
import IconButton from '@material-ui/core/IconButton';
import http from '../../util/http';
import {useSnackbar} from 'notistack';
import {getEventList} from './EventController';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    fabButton: {
        position: 'absolute', zIndex: 1, top: 50, left: 0, right: 0, margin: '0 auto',
    },
}));

export default function Event() {

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
        } else if (globalState.events.length === 0) {
            getEventList(globalState, enqueueSnackbar);
        }
    }, []);

    const handleNewEventClick = () => {
        history.push('/event/new/');
    }

    const refreshEventList = () => {
        getEventList(globalState, enqueueSnackbar).then(handleMenuClose);
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
            <Fab color="secondary" className={classes.fabButton} onClick={handleNewEventClick}>
                <AddIcon/>
            </Fab>
            <Grid container spacing={3}>
                <Grid item xs={10}>
                    <Typography variant="h5">{globalState.events.length} Events</Typography>
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
                        <MenuItem onClick={handleNewEventClick}>Create new Event</MenuItem>
                        <MenuItem onClick={()=>handleSort('created', true)}>Order by 'Created' (ascending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('created', false)}>Order by 'Created' (decending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('lastTriggered', true)}>Order by 'Last triggered' (ascending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('lastTriggered', false)}>Order by 'Last triggered' (decending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('name', true)}>Order by 'Name' (ascending)</MenuItem>
                        <MenuItem onClick={()=>handleSort('name', false)}>Order by 'Name' (decending)</MenuItem>
                        <MenuItem onClick={refreshEventList}>Refresh from server</MenuItem>
                    </Menu>
                </Grid>
            </Grid>

            <div>
                <EventList elements={globalState.events}/>
            </div>
        </div>
    )
}
