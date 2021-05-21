import React from 'react';

import pushRlogo from '../img/pushr-dots.png'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import {mainListItems, secondaryListItems} from './listItems';
import Chart from './Chart';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ListItemText from '@material-ui/core/ListItemText';

import TriggerIcon from '@material-ui/icons/Error';
import MessagesIcon from '@material-ui/icons/Textsms';
import PeopleIcon from '@material-ui/icons/People';
import SettingstIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

// import Deposits from './Deposits';
// import Orders from './Orders';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    /*menuButton: {
        marginRight: theme.spacing(2),
    },*/
    title: {
        flexGrow: 1,
    },
}));

export default function Dashboard3() {

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <CssBaseline />
            <AppBar className={classes.appBar} position="absolute">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={handleClick}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <ListItem button>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>

                        <Divider />

                        <ListItem button>
                            <ListItemIcon>
                                <TriggerIcon />
                            </ListItemIcon>
                            <ListItemText primary="Trigger" />
                        </ListItem>

                        <ListItem button>
                            <ListItemIcon>
                                <MessagesIcon />
                            </ListItemIcon>
                            <ListItemText primary="Messages" />
                        </ListItem>

                        <ListItem button>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Recipients" />
                        </ListItem>

                        <Divider />

                        <ListItem button>
                            <ListItemIcon>
                                <SettingstIcon />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>

                        <ListItem button>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                        {/*<MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>*/}
                    </Menu>
                    {/*<Typography variant="h6" className={classes.title}>
                        <img src={pushRlogo}/>
                    </Typography>*/}
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        Dashboard
                    </Typography>

                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="secondary">
                            <img src={pushRlogo}/>
                        </Badge>
                    </IconButton>
                </Toolbar>

            </AppBar>


        </>
    );
}