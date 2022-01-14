import React, {Component, useCallback} from 'react';
import {Button, Grid, FilledInput} from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from "@mui/material/Icon";
import {strings} from "../../const/strings";
import MDButton from "../../components/MDButton";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {addVehicle} from '../../services/vehicle'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import '../../scss/style.scss'
import axios from "axios";
import {Rings} from "react-loader-spinner/dist/loader/Rings";
import Dropzone from 'react-dropzone-uploader'
import Swal from "sweetalert2";
import cookies from "js-cookie";

const ACCESS_TOKEN = "2d2c094";
export default class AddVehicle extends Component {

    state = {
        open: false,
        src: null,
        isCropped: false,
        name:null,
        username:null,
        password :null
    }

    handleClickOpen = (state) => {
        this.setState({
            open: state,
            isCropped: false,
            src: state === false ? null : this.state.src,
            croppedImageUrl: state === false ? null : this.state.croppedImageUrl,
        })
    };


    onInputHandler = (e) => {
        let val = e.target.value

        this.setState({
            [e.target.name]: val
        })
    }


    errorMsg = (msg) => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        Toast.fire({
            icon: 'error',
            title: msg
        })
    }

     handlePickImage = async ({meta, file}, status) => {
        console.log(file)
        if (status === 'done') {
                this.setState({image: file})
        }
    };


     saveUser = () => {
         this.setState({open: false})
         let data = new FormData();
         data.append('name', this.state.name);
         data.append('username', this.state.username);
         data.append('password', this.state.password);

         let config = {
             method: 'post',
             url: 'http://127.0.0.1:5000/user/create',
             headers: {
                 'x-access-token': cookies.get(ACCESS_TOKEN)
             },
             data : data
         };
         axios(config)
             .then((response) => {
                 if(response.data.success){
                     Swal.fire({
                         position: 'top-end',
                         icon: 'success',
                         title: response.data.msg,
                         showConfirmButton: false,
                         timer: 1500
                     })
                 }else {
                     Swal.fire({
                         position: 'top-end',
                         icon: 'error',
                         title: response.data.msg,
                         showConfirmButton: false,
                         timer: 1500
                     })
                 }
             })
             .catch((error) => {
                 this.errorMsg(error)
             });
     }
    render() {
        const {crop, croppedImageUrl, src} = this.state;

        return (
            <div>
                <MDButton variant="gradient" color="dark" onClick={() => this.handleClickOpen(true)}>
                    <Icon sx={{fontWeight: "bold"}}>add</Icon>
                    &nbsp;{strings.addNewVehicle}
                </MDButton>
                <Dialog open={this.state.open} onClose={() => this.handleClickOpen(false)} maxWidth={'sm'}
                        fullWidth={true}>
                        <DialogTitle>{strings.addNewVehicle}</DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={6}>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="name"
                                            label="name"
                                            type="name"
                                            fullWidth
                                            variant="standard"
                                            onChange={this.onInputHandler}
                                            name={'name'}
                                            value={this.state.name}
                                        />
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="username"
                                            label="username"
                                            type="username"
                                            fullWidth
                                            variant="standard"
                                            onChange={this.onInputHandler}
                                            name={'username'}
                                            value={this.state.username}
                                        />

                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="password"
                                            label="Password"
                                            type="password"
                                            fullWidth
                                            variant="standard"
                                            onChange={this.onInputHandler}
                                            name={'password'}
                                            value={this.state.password}
                                        />
                                    </Grid>
                                </>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => this.handleClickOpen(false)}>Cancel</Button>
                            <Button onClick={this.saveUser}>Save</Button>
                        </DialogActions>
                </Dialog>
            </div>
        );
    }
}
