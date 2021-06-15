import React, {useContext} from 'react';
import clsx from 'clsx';
import Avatar from '@material-ui/core/Avatar';
import {
    makeStyles,
    withStyles,
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
import pushRlogo from '../../img/pushr-dots.svg';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TriggerIcon from '@material-ui/icons/Notifications';
import MessagesIcon from '@material-ui/icons/Textsms';
import PeopleIcon from '@material-ui/icons/People';
import DevicesIcon from '@material-ui/icons/DevicesOther';
import SettingstIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import QrCodeIcon from '@material-ui/icons/CropFree';

import QRCodeScanner from './QRCodeScanner';
import AppContext from '../../AppContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import { SnackbarProvider, useSnackbar } from 'notistack';

const drawerWidth = 240;

const styles = (theme) => ({
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
    largeTrigger: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText('#ff7961'),
        backgroundColor: '#ff7961'
    },
    largeMsg: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText('#4f5b62'),
        backgroundColor: '#4f5b62'
    },
    largeRecipient: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText('#263238'),
        backgroundColor: '#263238'
    },
    largeDevice: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText('#000a12'),
        backgroundColor: '#000a12'
    },
    neutralAvatar: {
        width: theme.spacing(5),
        height: theme.spacing(5),
        color: theme.palette.getContrastText('#eeeeee'),
        backgroundColor: '#eeeeee'
    },
});

const useStyles = makeStyles(styles);


// https://krasimirtsonev.com/blog/article/children-in-jsx
export default function PushrNavigation(
    {children, title, backdropOpen}) {

    const classes = useStyles();
    let history = useHistory();
    const globalState = useContext(AppContext);

    const [open, setOpen] = React.useState(false);
    const [qrScanOpen, setQrScanOpen] = React.useState(false);


    if (!globalState.userContext || !globalState.userContext.accessToken) {
        // no decoration for login-page
        return children;
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleQRscannerOpen = () => {

        setQrScanOpen(true);
    }


    const handleSwitchTab = (index, url) => {
        globalState.setSelectedNaviIndex(index);
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

    // https://iamhosseindhv.com/notistack/demos
    return (
        <SnackbarProvider
            dense
            maxSnack={5}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            autoHideDuration={2500}
        >
        <div className="App">
            <ThemeProvider theme={theme}>
                <div className={classes.root}>
                    <CssBaseline />
                    <Backdrop className={classes.backdrop} open={backdropOpen}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
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
                            <div className={classes.grow} />
                            <IconButton color="inherit">
                                <Badge badgeContent={0} color="secondary">
                                    <img src={pushRlogo} width="50" alt="PUSHr - open notifications"/>
                                </Badge>
                            </IconButton>
                            <Typography variant="h6" noWrap className={classes.title}>
                                {title}
                            </Typography>
                            <IconButton color="inherit">
                                <Avatar className={classes.avatar} src={globalState.userContext.userImgUrl} alt={globalState.userContext.userName} />
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
                            <ListItem button selected={globalState.selectedNaviIndex === 0} onClick={() => handleSwitchTab(0, '/dashboard')}>
                                <ListItemIcon>
                                    <Avatar className={classes.neutralAvatar}>
                                        <DashboardIcon />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>

                            <Divider />

                            <ListItem button selected={globalState.selectedNaviIndex === 1} onClick={() => handleSwitchTab(1, '/events')}>
                                <ListItemIcon>
                                    <Badge badgeContent={globalState.trigger.length} color="primary">
                                        <Avatar className={classes.largeTrigger}>
                                            <TriggerIcon />
                                        </Avatar>
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary="Events" />
                            </ListItem>

                            <ListItem button selected={globalState.selectedNaviIndex === 2} onClick={() => handleSwitchTab(2, '/messages')}>
                                <ListItemIcon>
                                    <Badge badgeContent={globalState.messages.length} color="primary">
                                        <Avatar className={classes.largeMsg}>
                                            <MessagesIcon />
                                        </Avatar>
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary="Messages" />
                            </ListItem>

                            <ListItem button selected={globalState.selectedNaviIndex === 3} onClick={() => handleSwitchTab(3, '/recipients')}>
                                <ListItemIcon>
                                    <Badge badgeContent={globalState.recipients.length} color="primary">
                                        <Avatar className={classes.largeRecipient}>
                                            <PeopleIcon />
                                        </Avatar>
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary="Recipients" />
                            </ListItem>

                            <ListItem button selected={globalState.selectedNaviIndex === 4} onClick={() => handleSwitchTab(4, '/devices')}>
                                <ListItemIcon>
                                    <Badge badgeContent={globalState.devices.length} color="primary">
                                        <Avatar className={classes.largeDevice}>
                                            <DevicesIcon />
                                        </Avatar>
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary="Devices" />
                            </ListItem>

                            <Divider />

                            <ListItem button selected={globalState.selectedNaviIndex === 5} onClick={() => handleSwitchTab(5, '/settings')}>
                                <ListItemIcon>
                                    <Avatar className={classes.neutralAvatar}>
                                        <SettingstIcon />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary="Settings" />
                            </ListItem>

                            <ListItem button selected={globalState.selectedNaviIndex === 6} onClick={() => handleSwitchTab(6, '/logout')}>
                                <ListItemIcon>
                                    <Avatar className={classes.neutralAvatar}>
                                        <LogoutIcon />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Drawer>
                    <main className={classes.content}>
                        <div className={classes.toolbar} />
                        <QRCodeScanner
                            qrScanOpen={qrScanOpen} setQrScanOpen={setQrScanOpen}
                        />



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

                            <IconButton edge="end" color="inherit" onClick={handleQRscannerOpen}>
                                <QrCodeIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                </div>


            </ThemeProvider>
        </div>
        </SnackbarProvider>
    );
}
