import { Box, Stack } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { useIsFetching } from "react-query";
import progress from "~/lib/core/progress";
import { logRender } from "~/lib/utils/logging";
import { DashboardProvider, useComputeDashboardData } from "../../lib/dashboard/context";
import Buttons from "./Buttons";
import Chart from "./Chart";
import Currently from "./Currently";
import DashboardPlaceholder from "./DashboardPlaceholder";
import Deltas from "./Deltas";
import RecentReadings from "./RecentReadings";
import Stats from "./Stats";

const Dashboard: FC<{ user?: string }> = ({ user }) => {
  const dashboardData = useComputeDashboardData(user);
  const queryInProgress = useIsFetching();
  logRender("Dashboard", queryInProgress);

  useEffect(() => {
    progress.setFetching(queryInProgress);
  }, [queryInProgress]);

  if (!dashboardData) {
    return <DashboardPlaceholder />;
  }

  if (dashboardData.measurements.length === 0) {
    return <Box>No data yet.</Box>;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <Stack direction="column" spacing={4}>
        <Buttons />
        <Stack direction={{ base: "column", md: "row" }} align={{ md: "center" }} spacing={{ base: 4, md: 12 }}>
          <Box w={{ base: "full", md: "475px", lg: "650px", xl: "840px" }}>
            <Chart />
          </Box>
          <Currently />
        </Stack>
        <Stack direction={{ base: "column-reverse", md: "row" }} spacing={{ base: 4, md: 12, lg: 20 }}>
          <RecentReadings />
          <Stack direction="column" spacing={4}>
            <Deltas />
            <Stats />
          </Stack>
        </Stack>
      </Stack>
    </DashboardProvider>
  );
};

export default Dashboard;
