import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";
import {strings} from '../../../../const/strings'

function Footer({light}) {
    const {size} = typography;

    return (
        <MDBox position="absolute" width="100%" bottom={0} py={4}>
            <Container>
                <MDBox
                    width="100%"
                    display="flex"
                    flexDirection={{xs: "column", lg: "row"}}
                    justifyContent="center"
                    alignItems="center"
                    px={1.5}
                >
                    <MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        color={light ? "white" : "text"}
                        fontSize={size.sm}
                    >
                        {strings.copyrightText}
                    </MDBox>
                </MDBox>
            </Container>
        </MDBox>
    );
}

// Setting default props for the Footer
Footer.defaultProps = {
    light: false,
};

// Typechecking props for the Footer
Footer.propTypes = {
    light: PropTypes.bool,
};

export default Footer;
