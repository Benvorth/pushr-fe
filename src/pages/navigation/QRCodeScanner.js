import React, {useContext} from 'react';
import QrScan from 'react-qr-reader';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {withStyles} from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import {useHistory} from 'react-router-dom';

import AppContext from '../../AppContext';
import {canIPullThisTrigger, canISubscribeToThisEvent, getEventNameFromTrigger, isTriggerAssociatedWithEvent} from '../../pushService/pushServiceController';

const styles = (theme) => ({
    dialogRoot: {
        margin: 0,
        padding: theme.spacing(2)
    },
    dialogCloseButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    }
});

const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.dialogRoot} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.dialogCloseButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

export default function QRCodeScanner({qrScanOpen, setQrScanOpen}) {


    let history = useHistory();
    const [qrscan, setQrscan] = React.useState('No result');
    const [foundPUSHrCode, setFoundPUSHrCode] = React.useState(false);
    const [trigger, setTrigger] = React.useState(null);
    const [canIPull, setCanIPull] = React.useState(false);
    const [canISubscribe, setCanISubscribe] = React.useState(false);
    const [isEventAlreadyCreated, setIsEventAlreadyCreated] = React.useState(false);
    const globalState = useContext(AppContext);

    const handleQRscannerClose = () => {
        setQrscan('No result'); // clean up for next start
        setTrigger(null);
        setCanIPull(false);
        setCanISubscribe(false);
        setFoundPUSHrCode(false);
        setQrScanOpen(false);
    }
    const handleQRscanError = (err) => {
        console.error(err)
    }
    const handleQRScanScan = (data) => {
        if (data && !foundPUSHrCode) {
            setFoundPUSHrCode(true);
            setQrscan(data)
            if (data.lastIndexOf('https://pushr.info/token/') === 0) {
                const trigger = data.replaceAll('https://pushr.info/token/', '');

                canIPullThisTrigger(trigger, globalState.userContext.accessToken).then((result) => {
                    setCanIPull(result);
                });
                canISubscribeToThisEvent(trigger, globalState.userContext.accessToken).then((result) => {
                    setCanISubscribe(result);
                });

                isTriggerAssociatedWithEvent(trigger, globalState.userContext.accessToken)
                .then((result) => {
                    if (!!result) {
                        getEventNameFromTrigger(trigger, globalState.userContext.accessToken).then((result) => {
                            if (!result) { // no event found for this trigger
                                setIsEventAlreadyCreated(false);
                            } else {
                                setIsEventAlreadyCreated(true);
                                setQrscan('Found trigger \"' + trigger + '\", Event \"' + result + "\"");
                            }
                        });
                    } else {
                        setIsEventAlreadyCreated(false);
                    }
                });
                setTrigger(trigger);

            }
        }
    }

    const triggerEvent = () => {

        handleQRscannerClose();
    }

    const subscribeToEvent = () => {
        history.push('/event/subscribe/' + trigger);
        handleQRscannerClose();
    }
    const createEvent = () => {
        history.push('/event/new/' + trigger);
        handleQRscannerClose();
    }

    return (
        <Dialog onClose={handleQRscannerClose} aria-labelledby="customized-dialog-title" open={qrScanOpen}>
            <DialogTitle id="customized-dialog-title" onClose={handleQRscannerClose}>
                QR-Code Scanner
            </DialogTitle>
            <DialogContent dividers>

                <div>
                    <QrScan
                        delay={300}
                        onError={handleQRscanError}
                        onScan={handleQRScanScan}
                        style={{height: 250, width: 250}}
                    />
                </div>
                <div>
                    {qrscan}
                </div>

            </DialogContent>
            {(!!trigger ?
                <DialogActions>
                    {canISubscribe ? <Button size="small" variant="contained" onClick={subscribeToEvent} color="primary">
                        Subscribe Event
                    </Button> : null}

                    {canIPull ? <Button size="small" variant="contained" onClick={triggerEvent} color="secondary">
                        Trigger Event
                    </Button> : null}

                    {!isEventAlreadyCreated ? <Button size="small" variant="contained" onClick={createEvent} color="primary">
                        Create Event
                    </Button>: null}

                </DialogActions>
            : null)}
        </Dialog>
    );
}