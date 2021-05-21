/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { profileQuery, sourceDataQuery } from "../api/queries";
import { computeDataPoints } from "../computations/data-points";
import { DataPoint, Mode, TimeRange } from "../computations/interfaces";
import { computeMeasurements } from "../computations/measurements";

export interface DashboardData {
  dataPoints: DataPoint[];
  mode: [Mode, (mode: Mode) => void];
  timeRange: [TimeRange, (timeRange: TimeRange) => void];
}

const dashboardContext = createContext<DashboardData | undefined>(undefined);

export const DashboardProvider: FC<PropsWithChildren<{ data: DashboardData }>> = ({ data, children }) => (
  <dashboardContext.Provider value={data}>{children}</dashboardContext.Provider>
);

export const useDashboardData = (): DashboardData => {
  const data = useContext(dashboardContext);
  if (!data) {
    throw new Error("Called useDashboardData() when the provider is not present.");
  }
  return data;
};

export const useComputeDashboardData = (user?: string) => {
  const [mode, setMode] = useState<Mode>("weight");
  const [timeRange, setTimeRange] = useState<TimeRange>("4w");

  const profile = useQuery(profileQuery(user)).data!;
  const sourceData = useQuery(sourceDataQuery(user)).data!;

  const measurements = useMemo(() => computeMeasurements(sourceData, profile), [sourceData, profile]);
  const dataPoints = useMemo(() => computeDataPoints(mode, measurements), [measurements, mode]);

  if (!measurements || !dataPoints) {
    return undefined;
  }

  const data: DashboardData = {
    dataPoints,
    mode: [mode, setMode],
    timeRange: [timeRange, setTimeRange],
  };

  return data;
};
