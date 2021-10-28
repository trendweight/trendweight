import { Page } from "../modules/core/page";
import Dashboard from "../modules/dashboard/Dashboard";

const DashboardPage: Page = () => {
  return <Dashboard />;
};

DashboardPage.title = "Dashboard";
DashboardPage.requireLogin = true;

export default DashboardPage;
