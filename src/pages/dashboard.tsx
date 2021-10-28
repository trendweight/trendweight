import Dashboard from "../modules/dashboard/Dashboard";
import { Page } from "../modules/shared/page";

const DashboardPage: Page = () => {
  return <Dashboard />;
};

DashboardPage.title = "Dashboard";
DashboardPage.requireLogin = true;

export default DashboardPage;
