import MDBox from "components/MDBox";
import typography from "assets/theme/base/typography";
import {strings} from '../../const/strings'

function Footer() {
    const {size} = typography;

    return (
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
                color="text"
                fontSize={size.sm}
                px={1.5}
            >
                {strings.copyrightText}
            </MDBox>
        </MDBox>
    );
}

export default Footer;
