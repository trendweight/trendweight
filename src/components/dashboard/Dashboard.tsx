import { Box, Stack } from "@chakra-ui/react";
import React, { FC } from "react";
import { DashboardProvider, useComputeDashboardData } from "../../lib/dashboard/context";
import Buttons from "./Buttons";
import Currently from "./Currently";
import DashboardPlaceholder from "./DashboardPlaceholder";
import RecentReadings from "./RecentReadings";

const Dashboard: FC<{ user?: string }> = ({ user }) => {
  const dashboardData = useComputeDashboardData(user);

  if (!dashboardData) {
    return <DashboardPlaceholder />;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <Stack direction="column" spacing={4}>
        <Buttons />
        <Stack direction={{ base: "column", md: "row" }} align={{ md: "center" }} spacing={4}>
          <Box h="240px" w={{ base: "full", md: "650px" }}>
            Chart
          </Box>
          <Currently />
        </Stack>
        <Stack direction={{ base: "column-reverse", md: "row" }} spacing={12}>
          <RecentReadings />
          <Box w="33%">Stats</Box>
        </Stack>
      </Stack>
    </DashboardProvider>
  );
};

export default Dashboard;
