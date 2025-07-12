import type { FC } from "react";
import { Navigate } from "@tanstack/react-router";
import { DashboardProvider } from "../../lib/dashboard/context";
import { useComputeDashboardData } from "../../lib/dashboard/hooks";
import { ApiError } from "../../lib/api/client";
import Buttons from "./Buttons";
import Chart from "./chart/Chart";
import Currently from "./Currently";
import RecentReadings from "./RecentReadings";
import Stats from "./Stats";
import Deltas from "./Deltas";
import HelpLink from "./HelpLink";
import ProviderSyncErrors from "./ProviderSyncErrors";

const Dashboard: FC = () => {
  const dashboardData = useComputeDashboardData();

  // Check if profile exists - if not, redirect to initial setup
  if (dashboardData.profileError instanceof ApiError && dashboardData.profileError.status === 404) {
    return <Navigate to="/initial-setup" replace />;
  }

  // If profile exists but no measurements, redirect to link page
  if (dashboardData.measurements.length === 0) {
    return <Navigate to="/link" replace />;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <div className="flex flex-col gap-4">
        <ProviderSyncErrors providerStatus={dashboardData.providerStatus} />
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
            <HelpLink />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
