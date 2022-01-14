import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";
import {strings} from '../../const/strings'
import {dashboardData} from '../../services/dashboard'
import {Component} from "react";

const {sales, tasks} = reportsLineChartData;

class Dashboard extends Component {

    state = {
        noOfVehicles: 0
    }

    componentDidMount() {
        dashboardData().then(res => {
            console.log(res)
            if (res.data.success) {
                this.setState({
                    noOfVehicles: res.data.data.noOfVehicles
                })
            }
        })
    }

    render() {
        return (
            <DashboardLayout>
                <DashboardNavbar/>
                <MDBox py={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6} lg={3}>
                            <MDBox mb={1.5}>
                                <ComplexStatisticsCard
                                    color="dark"
                                    icon="directions_car"
                                    title={strings.totalVehicles}
                                    count={this.state.noOfVehicles}
                                    percentage={{
                                        color: "success",
                                        amount: "+55%",
                                        label: "than lask week",
                                    }}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <MDBox mb={1.5}>
                                <ComplexStatisticsCard
                                    icon="leaderboard"
                                    title={strings.activeVehicles}
                                    count="2,300"
                                    percentage={{
                                        color: "success",
                                        amount: "+3%",
                                        label: "than last month",
                                    }}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <MDBox mb={1.5}>
                                <ComplexStatisticsCard
                                    color="success"
                                    icon="store"
                                    title="Revenue"
                                    count="34k"
                                    percentage={{
                                        color: "success",
                                        amount: "+1%",
                                        label: "than yesterday",
                                    }}
                                />
                            </MDBox>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3}>
                            <MDBox mb={1.5}>
                                <ComplexStatisticsCard
                                    color="primary"
                                    icon="person_add"
                                    title={strings.unsettleVehicles}
                                    count="+91"
                                    percentage={{
                                        color: "success",
                                        amount: "",
                                        label: "Just updated",
                                    }}
                                />
                            </MDBox>
                        </Grid>
                    </Grid>
                    <MDBox mt={4.5}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6} lg={4}>
                                <MDBox mb={3}>
                                    <ReportsBarChart
                                        color="info"
                                        title="website views"
                                        description="Last Campaign Performance"
                                        date="campaign sent 2 days ago"
                                        chart={reportsBarChartData}
                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <MDBox mb={3}>
                                    <ReportsLineChart
                                        color="success"
                                        title="daily sales"
                                        description={
                                            <>
                                                (<strong>+15%</strong>) increase in today sales.
                                            </>
                                        }
                                        date="updated 4 min ago"
                                        chart={sales}
                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4}>
                                <MDBox mb={3}>
                                    <ReportsLineChart
                                        color="dark"
                                        title="completed tasks"
                                        description="Last Campaign Performance"
                                        date="just updated"
                                        chart={tasks}
                                    />
                                </MDBox>
                            </Grid>
                        </Grid>
                    </MDBox>
                    {/*<MDBox>*/}
                    {/*  <Grid container spacing={3}>*/}
                    {/*    <Grid item xs={12} md={6} lg={8}>*/}
                    {/*      <Projects />*/}
                    {/*    </Grid>*/}
                    {/*    <Grid item xs={12} md={6} lg={4}>*/}
                    {/*      <OrdersOverview />*/}
                    {/*    </Grid>*/}
                    {/*  </Grid>*/}
                    {/*</MDBox>*/}
                </MDBox>
                <Footer/>
            </DashboardLayout>
        );
    }
}

export default Dashboard;
