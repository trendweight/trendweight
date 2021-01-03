import { Box } from "@chakra-ui/react";
import { Page } from "~/lib/core/interfaces";

const Dashboard: Page = () => <Box>Dashboard Page</Box>;

Dashboard.title = "Dashboard";
Dashboard.requireLogin = true;

export default Dashboard;
