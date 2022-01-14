import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {Component} from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class AlertDialogSlide extends Component {
    render() {
        return (
            <div>
                <Button variant="outlined"
                    // onClick={handleClickOpen}
                >
                    Slide in alert dialog
                </Button>
                <Dialog
                    open={this.props.state.isSubmited}
                    TransitionComponent={Transition}
                    keepMounted
                    // onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"We recognized your vehicle number"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            <div align={'center'}>Your vehicle number is
                                "{this.props.state.vehicleNo !== undefined && this.props.state.vehicleNo.trim()}"
                            </div>
                            {console.log(this.props)}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.props.modalHandler(false)}>Incorrect</Button>
                        <Button onClick={() => this.props.modalHandler(false)}>Correct</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
