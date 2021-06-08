import React from 'react';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import {
    makeStyles,
    ThemeProvider,
    unstable_createMuiStrictModeTheme as createMuiTheme
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from "react-router-dom";
import Badge from '@material-ui/core/Badge';
import pushRlogo from '../img/pushr-dots.svg';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TriggerIcon from '@material-ui/icons/Error';
import MessagesIcon from '@material-ui/icons/Textsms';
import PeopleIcon from '@material-ui/icons/People';
import DevicesIcon from '@material-ui/icons/DevicesOther';
import SettingstIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import QrCodeIcon from '@material-ui/icons/CropFree';
import Menu from '@material-ui/core/Menu';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarBottom: {
        top: 'auto',
        bottom: 0,
    },
    grow: {
        flexGrow: 1,
    },
    appBarShift: {
        // marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: 0,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

// https://krasimirtsonev.com/blog/article/children-in-jsx
export default function PushrNavigation({children, userContext, title, selectedIndex, setSelectedIndex}) {

    const classes = useStyles();
    // const theme = useTheme();
    let history = useHistory();

    const [open, setOpen] = React.useState(false);
    // const [selectedIndex, setSelectedIndex] = React.useState(0);

    if (!userContext || Object.keys(userContext).length === 0) {
        return children;
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleSwitchTab = (index, url) => {
        setSelectedIndex(index);
        handleDrawerClose();
        handleNavigation(url);
    }

    const handleNavigation = (url) => {
        history.push(url);
    }

    const theme = createMuiTheme({
        palette: {
            primary: {
                light: '#4f5b62',
                main: '#000a12',
                dark: '#263238',
                contrastText: '#eee'
            },
            secondary: {
                light: '#ff7961',
                // main: '#f44336',
                main: '#ff7961',
                dark: '#ba000d',
                contrastText: '#000'
            }
        }
    });

    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: open,
                        })}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: open,
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge badgeContent={0} color="secondary">
                                    <img src={pushRlogo} width="50" alt="PUSHr - open notifications"/>
                                </Badge>
                            </IconButton>
                            <Typography variant="h6" noWrap className={classes.title}>
                                {title}
                            </Typography>
                            <IconButton color="inherit">
                                <Avatar className={classes.avatar} src={userContext.userImgUrl} alt={userContext.userName} />
                            </IconButton>
                        </Toolbar>

                    </AppBar>
                    <Drawer
                        variant="persistent"
                        anchor="left"
                        open={open}
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            }),
                        }}
                    >
                        <div className={classes.toolbar}>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <ListItem button selected={selectedIndex === 0} onClick={() => handleSwitchTab(0, '/dashboard')}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>

                            <Divider />

                            <ListItem button selected={selectedIndex === 1} onClick={() => handleSwitchTab(1, '/trigger')}>
                                <ListItemIcon>
                                    <TriggerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Trigger" />
                            </ListItem>

                            <ListItem button selected={selectedIndex === 2} onClick={() => handleSwitchTab(2, '/messages')}>
                                <ListItemIcon>
                                    <MessagesIcon />
                                </ListItemIcon>
                                <ListItemText primary="Messages" />
                            </ListItem>

                            <ListItem button selected={selectedIndex === 3} onClick={() => handleSwitchTab(3, '/recipients')}>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Recipients" />
                            </ListItem>

                            <ListItem button selected={selectedIndex === 4} onClick={() => handleSwitchTab(4, '/devices')}>
                                <ListItemIcon>
                                    <DevicesIcon />
                                </ListItemIcon>
                                <ListItemText primary="Devices" />
                            </ListItem>

                            <Divider />

                            <ListItem button selected={selectedIndex === 5} onClick={() => handleSwitchTab(5, '/settings')}>
                                <ListItemIcon>
                                    <SettingstIcon />
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>

                            <ListItem button selected={selectedIndex === 6} onClick={() => handleSwitchTab(6, '/logout')}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        {children}


                        {/*<div className={classes.toolbar} />
                        <Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                            ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
                            facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
                            gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
                            donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                            adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
                            Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
                            imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
                            arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                            donec massa sapien faucibus et molestie ac.
                        </Typography>
                        <Typography paragraph>
                            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
                            facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
                            tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
                            consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
                            vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
                            hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
                            tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
                            nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
                            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
                        </Typography>*/}


                        <div>
                            {/*This is required because of the the bottom AppBar*/}
                            &nbsp;<br/>
                            &nbsp;<br/>
                            &nbsp;<br/>
                        </div>
                    </main>

                    <AppBar position="fixed" color="primary" className={classes.appBarBottom}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit">
                                <DashboardIcon />
                            </IconButton>
                            <div className={classes.grow} />

                            <IconButton edge="end" color="inherit">
                                <QrCodeIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>


            </ThemeProvider>
        </div>
    );
}
