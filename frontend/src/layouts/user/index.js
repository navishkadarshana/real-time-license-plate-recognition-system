import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import {userTableColumn, UserTableColumn, vehicleTableColumn} from '../../const/tables'
import AddNew from './addNew'
import React, {Component} from "react";
import {strings} from "../../const/strings";
import TextField from "@mui/material/TextField";
import cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";
const ACCESS_TOKEN = "2d2c094";
class Vehicles extends Component {

    state = {
        vehicles: []
    }

    componentDidMount() {
        this.getAllVehicles()
    }

    getAllVehicles = () => {
        let config = {
            method: 'get',
            url: 'http://127.0.0.1:5000/user/get-user',
            headers: {
                'x-access-token': cookies.get(ACCESS_TOKEN)
            }
        };

        axios(config)
            .then( (response) => {
                if (response.data.success) {
                    this.setState({
                        vehicles: response.data.data
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let row = []
        this.state.vehicles.map(v => {
            row.push({
                id: v.id,
                name:v.name,
                userName: v.userName,
            })
        })

        return (
            <DashboardLayout>
                <DashboardNavbar/>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label={strings.vehicleNo}
                            type="text"
                            variant="standard"
                            onChange={this.onInputHandler}
                            name={'vehicleNo'}
                        />
                    </div>
                    <AddNew loadAll={this.getAllVehicles}/>
                </div>
                <MDBox pt={6} pb={3}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Card>
                                <MDBox
                                    mx={2}
                                    mt={-3}
                                    py={3}
                                    px={2}
                                    variant="gradient"
                                    bgColor="info"
                                    borderRadius="lg"
                                    coloredShadow="info"
                                >
                                    <MDTypography variant="h6" color="white">
                                        All Vehicles Data
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{columns: userTableColumn, rows: row}}
                                        isSorted={false}
                                        entriesPerPage={false}
                                        showTotalEntries={false}
                                        noEndBorder
                                    />
                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </MDBox>
                <Footer/>
            </DashboardLayout>
        );
    }
}

export default Vehicles;
