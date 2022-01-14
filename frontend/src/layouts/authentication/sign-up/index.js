import {useState} from "react";
import {Link} from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-up-basic.jpg";

function Basic() {
    const [rememberMe, setRememberMe] = useState(false);

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

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
                        Sign up
                    </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput type="email" label="Email" fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" label="Password" fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" label="Repeat Password" fullWidth/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="text" label="Vehicle Number" fullWidth/>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton variant="gradient" color="info" fullWidth>
                                sign up
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">
                            <MDTypography variant="button" color="text">
                                Already have an account?{" "}
                                <MDTypography
                                    component={Link}
                                    to="/authentication/sign-in"
                                    variant="button"
                                    color="info"
                                    fontWeight="medium"
                                    textGradient
                                >
                                    Sign in
                                </MDTypography>
                            </MDTypography>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default Basic;
