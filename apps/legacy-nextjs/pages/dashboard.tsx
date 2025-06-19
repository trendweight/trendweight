import { Page } from "../lib/core/page";
import Dashboard from "../lib/dashboard/Dashboard";

const DashboardPage: Page = () => {
  return <Dashboard />;
};

DashboardPage.title = "Dashboard";
DashboardPage.requireLogin = true;

export default DashboardPage;
