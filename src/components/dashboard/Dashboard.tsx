import React, { FC, useMemo, useState } from "react";
import { toJson } from "../../lib/core/utils";
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

  if (!measurements) {
    return null;
  }

  return (
    <DashboardProvider data={dashboardData}>
      <div>
        <code>
          <pre>{toJson(measurements)}</pre>
        </code>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;
