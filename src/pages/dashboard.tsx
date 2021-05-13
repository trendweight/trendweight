import Dashboard from "~/components/dashboard/Dashboard";
import { Page } from "~/lib/core/page";

const DashboardPage: Page = () => <Dashboard />;

DashboardPage.title = "Dashboard";
DashboardPage.requireLogin = true;

export default DashboardPage;
