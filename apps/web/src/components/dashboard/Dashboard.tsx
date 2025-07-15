import type { FC } from "react";
import { Navigate } from "@tanstack/react-router";
import { DashboardProvider } from "../../lib/dashboard/context";
import { useComputeDashboardData } from "../../lib/dashboard/hooks";
import { ApiError } from "../../lib/api/client";
import { Modes, TimeRanges } from "../../lib/core/interfaces";
import { Heading } from "../ui/Heading";
import Buttons from "./Buttons";
import Chart from "./chart/Chart";
import Currently from "./Currently";
import RecentReadings from "./RecentReadings";
import Stats from "./Stats";
import Deltas from "./Deltas";
import HelpLink from "./HelpLink";
import ProviderSyncErrors from "./ProviderSyncErrors";
import { NoDataCard } from "./NoDataCard";
import { useProviderLinks } from "../../lib/api/queries";

interface DashboardProps {
  sharingCode?: string;
}

const Dashboard: FC<DashboardProps> = ({ sharingCode }) => {
  const dashboardData = useComputeDashboardData(sharingCode);
  const { data: providerLinks } = useProviderLinks();

  // Check if profile exists - if not, redirect to initial setup (skip for shared views)
  if (!sharingCode && dashboardData.profileError instanceof ApiError && dashboardData.profileError.status === 404) {
    return <Navigate to="/initial-setup" replace />;
  }

  // If shared view and profile not found, redirect to home
  if (sharingCode && sharingCode !== "demo" && dashboardData.profileError instanceof ApiError && dashboardData.profileError.status === 404) {
    return <Navigate to="/" replace />;
  }

  // Check if user has any connected providers
  const hasConnectedProviders = providerLinks?.some((link) => link.hasToken);

  // If profile exists but no measurements
  if (!sharingCode && dashboardData.measurements.length === 0) {
    // If no providers connected, redirect to link page
    if (!hasConnectedProviders) {
      return <Navigate to="/link" replace />;
    }
    // If providers connected but no data, show waiting message
    return (
      <div className="py-8">
        <NoDataCard />
      </div>
    );
  }

  return (
    <DashboardProvider data={dashboardData}>
      <div className="flex flex-col gap-4">
        <ProviderSyncErrors providerStatus={dashboardData.providerStatus} />
        <Buttons />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-12">
          <div className="w-full md:w-[475px] lg:w-[650px] xl:w-[840px]">
            <Heading level={2} className="mb-4">
              {Modes[dashboardData.mode[0]]}, {dashboardData.timeRange[0] === "all" ? "All Time" : `Past ${TimeRanges[dashboardData.timeRange[0]]}`}
              {!dashboardData.isMe && ` for ${dashboardData.profile.firstName}`}
            </Heading>
            <Chart />
          </div>
          <Currently />
        </div>
        <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-12 lg:gap-20">
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
