import { Box, Stack } from "@chakra-ui/react";
import React, { FC } from "react";
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

  if (!dashboardData) {
    return <DashboardPlaceholder />;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <Stack direction="column" spacing={4}>
        <Buttons />
        <Stack direction={{ base: "column", md: "row" }} align={{ md: "center" }} spacing={{ base: 4, md: 12 }}>
          <Box
            h={{ base: "240px", md: "280px", lg: "325px", xl: "420px" }}
            w={{ base: "full", md: "475px", lg: "650px", xl: "840px" }}
          >
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
