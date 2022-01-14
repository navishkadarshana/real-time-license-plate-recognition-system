
import React, {Component} from 'react';
import MDButton from "../../components/MDButton";
import {deleteVehicle} from '../../services/vehicle'

export default class DeleteVehicle extends Component {
    deleteHandler = () => {
        let id = this.props.id.id
        deleteVehicle(id).then(res => {
            if (res.data.success) {
                this.props.loadAll()
            }
        })
    }

    render() {

        return (
            <div>
                <MDButton onClick={this.deleteHandler} style={{marginLeft: 10}} variant="gradient" color="error">
                    Delete
                </MDButton>
            </div>
        );
    }
}
