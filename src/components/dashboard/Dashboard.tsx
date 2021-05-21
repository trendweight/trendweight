import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { getTimeZones } from "@vvo/tzdb";
import React, { FC } from "react";
import { DashboardProvider, useComputeDashboardData } from "../../lib/dashboard/context";

const Dashboard: FC<{ user?: string }> = ({ user }) => {
  const dashboardData = useComputeDashboardData(user);
  const timezones = getTimeZones();
  console.log(timezones);

  if (!dashboardData) {
    return <Spinner />;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <Box>Retrieved {dashboardData.dataPoints.length} data points.</Box>
    </DashboardProvider>
  );
};

export default Dashboard;
