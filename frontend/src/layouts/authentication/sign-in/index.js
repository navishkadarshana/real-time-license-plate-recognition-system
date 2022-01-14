import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpg";
import axios from "axios";
import cookies from "js-cookie";
import Swal from 'sweetalert2'


const INITIAL_USER = {
    username: '',
    password: ''
}

const ACCESS_TOKEN = "2d2c094";
function Basic() {
    const [rememberMe, setRememberMe] = useState(false);
    const [user, setUser] = useState(INITIAL_USER)

    const handleChange = (e) => {
        console.log(e.target.value)
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }))
    }
    const errorMsg = (msg) => {
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

    const validateForm = () => {
        let {username, password} = user;
        if ( username == null || username === '') {
            errorMsg('Please enter your username!')
        }else if (password == null || password === '') {
            errorMsg('Please enter your password!')
        }else {
            console.log(username)
            fetchHandler().then(r => console.log(true));
        }
    }


    const fetchHandler = async e => {
        let data = new FormData();
        let {username, password} = user;
        data.append('username', username);
        data.append('password', password);

        let config = {
            method: 'post',
            url: 'http://127.0.0.1:5000/login',
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(response.data.token)
                cookies.set(ACCESS_TOKEN, response.data.token);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login Success',
                    showConfirmButton: false,
                    timer: 1500
                })
                window.location.href = "/dashboard"
            })
            .catch(function (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'warning',
                    title: error,
                    showConfirmButton: false,
                    timer: 1500
                })
            });
    };

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Sign in
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox>
                        <MDBox mb={2}>
                            <MDInput type="email" label="Email" name="username" onChange={handleChange} fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" label="Password" name="password" onChange={handleChange} fullWidth/>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton variant="gradient" color="info"
                                      onClick={validateForm} fullWidth>
                                sign in
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
