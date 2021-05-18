import { Box } from "@chakra-ui/layout";
import { getTimeZones } from "@vvo/tzdb";
import React, { FC, useMemo, useState } from "react";
import { DashboardProvider } from "../../lib/dashboard/context";
import { Mode, TimeRange } from "../../lib/dashboard/interfaces";
import { useMeasurements } from "../../lib/queries/measurements";

const Dashboard: FC<{ user?: string }> = ({ user }) => {
  const [mode, setMode] = useState<Mode>("weight");
  const [timeRange, setTimeRange] = useState<TimeRange>("4w");
  const measurements = useMeasurements(user);

  const dashboardData = useMemo(
    () => ({ measurements, mode, setMode, timeRange, setTimeRange }),
    [measurements, mode, timeRange]
  );

  const timezones = getTimeZones();
  console.log(timezones);

  if (!measurements) {
    return null;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <Box>Retrieved {measurements.length} readings.</Box>
    </DashboardProvider>
  );
};

export default Dashboard;
