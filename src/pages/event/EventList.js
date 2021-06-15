import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import TriggerIcon from '@material-ui/icons/Error';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import WhistleIcon from '@material-ui/icons/Sports';
import QrCodeIcon from '@material-ui/icons/CropFree';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HttpIcon from '@material-ui/icons/Http';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import QRcode from 'qrcode.react'

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
    }
}));

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

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
                                        <Avatar className={classes.largeTrigger}>
                                            <QRcode
                                                id="myqr"
                                                value={'https://pushr.info/token/' + element.token}
                                                size={30}
                                                includeMargin={false}
                                            />

                                        </Avatar>

                                    </Badge>
                                }
                                action={
                                    <>
                                    <IconButton aria-label="settings" onClick={handleClick}>
                                        <MoreVertIcon/>
                                    </IconButton>
                                    <Menu
                                        id="simple-menu"
                                        anchorEl={anchorEl}
                                        keepMounted
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <MenuItem onClick={handleClose}>Edit Trigger</MenuItem>
                                        <MenuItem onClick={handleClose}>Delete Trigger</MenuItem>
                                        <MenuItem onClick={handleClose}>Copy Trigger-URL</MenuItem>
                                        <MenuItem onClick={handleClose}>Download QR-Code</MenuItem>
                                    </Menu>
                                    </>
                                }
                                title={element.name}
                                subheader={element.token + 'Created: ' + element.created + ', last triggered: ' + element.lastTriggered}
                            />

                        </Card>
                    </Grid>
                </Grid>
            ))}
        </div>
    );
}
