import type { FC } from "react";
import { DashboardProvider } from "../../lib/dashboard/context";
import { useComputeDashboardData } from "../../lib/dashboard/hooks";
import Buttons from "./Buttons";
import Chart from "./chart/Chart";
import Currently from "./Currently";
import DashboardPlaceholder from "./DashboardPlaceholder";
import RecentReadings from "./RecentReadings";
import Stats from "./Stats";
import Deltas from "./Deltas";

const Dashboard: FC = () => {
  const dashboardData = useComputeDashboardData();

  if (!dashboardData) {
    return <DashboardPlaceholder />;
  }

  if (dashboardData.measurements.length === 0) {
    return <div>No data yet.</div>;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <div className="flex flex-col gap-4">
        <Buttons />
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
          <div className="w-full md:w-[475px] lg:w-[650px] xl:w-[840px]">
            <Chart />
          </div>
          <Currently />
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 lg:gap-20">
          <RecentReadings />
          <div className="flex flex-col gap-4">
            <Deltas />
            <Stats />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
