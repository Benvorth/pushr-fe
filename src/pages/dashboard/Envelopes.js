import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import TriggerIcon from '@material-ui/icons/Error';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MessagesIcon from '@material-ui/icons/Textsms';
import PeopleIcon from '@material-ui/icons/People';
import DevicesIcon from '@material-ui/icons/DevicesOther';
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import WhistleIcon from '@material-ui/icons/Sports';
import QrCodeIcon from '@material-ui/icons/CropFree';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HttpIcon from '@material-ui/icons/Http';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 700,
    },
    paper: {
        padding: theme.spacing(2),
        vAlign: 'center',
        color: theme.palette.text.secondary,
    },
    envelopeIcons: {
        padding: '6px',
        align: 'center'
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

export default function Envelopes({envelopes}) {

    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className={classes.root}>
            {envelopes.map((envelope, number) => (
                <Accordion
                    expanded={expanded === 'envelope_' + number}
                    onChange={handleChange('envelope_' + number)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls={"panel" + number + "bh-content"}
                        id={"panel" + number + "bh-header"}
                    >

                        <Grid container spacing={1}>

                            <Grid item xs={1}>
                                <IconButton className={classes.envelopeIcons}>
                                    <MyIcon icon={envelope.icon}/>
                                </IconButton>
                            </Grid>
                            <Grid item xs={10}>
                                <div className={classes.paper}>
                                    {envelope.title}
                                </div>
                            </Grid>
                        </Grid>

                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={3}>
                            <Grid item sm={6} xs={12}>
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Badge badgeContent={(envelope.triggers.length === 1 ? 0 : envelope.triggers.length)} color="secondary">
                                                <Avatar className={classes.largeTrigger}>
                                                    <TriggerIcon className={classes.iconSize}/>
                                                </Avatar>
                                            </Badge>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon/>
                                            </IconButton>
                                        }
                                        title={envelope.triggers[0].title + (envelope.triggers.length === 1 ? "" : " and " + envelope.triggers.length + " more")}
                                        subheader={"Trigger (token '" + envelope.triggers[0].token + (envelope.triggers.length === 1 ? "" : " and " + envelope.triggers.length + " more") + "')"}
                                    />
                                </Card>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Avatar className={classes.largeMsg}><MessagesIcon
                                                className={classes.iconSize}/></Avatar>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon/>
                                            </IconButton>
                                        }
                                        title={envelope.message.content}
                                        subheader="Triggered push-message"
                                    />
                                </Card>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Badge badgeContent={(envelope.recipients.people.length === 1 ? 0 : envelope.recipients.people.length)} color="secondary">
                                                <Avatar className={classes.largeRecipient}><PeopleIcon
                                                    className={classes.iconSize}/></Avatar>
                                            </Badge>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon/>
                                            </IconButton>
                                        }
                                        title={envelope.recipients.title}
                                        subheader={"Message recipients: Myself" + (envelope.recipients.people.length === 1 ? "" : " and " + envelope.recipients.people.length + " others")}
                                    />
                                </Card>
                            </Grid>
                            <Grid item sm={6} xs={12}>
                                <Card>
                                    <CardHeader
                                        avatar={
                                            <Badge badgeContent={(envelope.devices.length === 1 ? 0 : envelope.devices.length)} color="secondary">
                                                <Avatar className={classes.largeDevice}>
                                                    <DevicesIcon className={classes.iconSize}/>
                                                </Avatar>
                                            </Badge>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                <MoreVertIcon/>
                                            </IconButton>
                                        }
                                        title={"All mobiles and some tablets (" + envelope.devices.length+ " devices)"}
                                        subheader="Recipient's devices"
                                    />
                                </Card>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}

        </div>
    );
}
