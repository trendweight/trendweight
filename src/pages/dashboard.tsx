import { Page } from "~/lib/core/page";

const Dashboard: Page = () => <div>Dashboard Page</div>;

Dashboard.title = "Dashboard";
Dashboard.requireLogin = true;

export default Dashboard;
