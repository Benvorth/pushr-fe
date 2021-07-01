import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import React from 'react';


export default function PushrDialog({title, body, open, onClose, onClickAction, cancelLabel, actionLabel}) {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {(title ? <DialogTitle id="alert-dialog-title">{title}</DialogTitle> : null)}
            {(body ?
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {body}
                    </DialogContentText>
                </DialogContent> : null
            )}
            <DialogActions>
                <Button onClick={onClose} color='primary' autoFocus variant="outlined">
                    {cancelLabel}
                </Button>
                <Button onClick={onClickAction} color='secondary' variant="outlined">
                    {actionLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}