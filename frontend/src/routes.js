import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Vehicles from "layouts/vehicles";
import Icon from "@mui/material/Icon";

const routes = [
    {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: "/dashboard",
        component: <Dashboard/>,
    },
    {
        type: "collapse",
        name: "Vehicles",
        key: "vehicles",
        icon: <Icon fontSize="small">directions_car</Icon>,
        route: "/vehicles",
        component: <Vehicles/>,
    },
    {
        type: "collapse",
        name: "Logout",
        key: "sign-in",
        icon: <Icon fontSize="small">logout</Icon>,
        route: "/authentication/sign-in",
        component: <SignIn/>,
    },
];

export default routes;
