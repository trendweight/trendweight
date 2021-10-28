/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import createPersistedState from "use-persisted-state";
import { profileQuery, sourceDataQuery } from "../api/queries";
import { DataPoint, Delta, Measurement, Mode, ProfileData, TimeRange } from "../core/interfaces";
import { computeDataPoints } from "./computations/data-points";
import { computeMeasurements } from "./computations/measurements";
import { computeActiveSlope, computeDeltas, computeWeightSlope } from "./computations/stats";

export interface DashboardData {
  dataPoints: DataPoint[];
  measurements: Measurement[];
  mode: [Mode, (mode: Mode) => void];
  timeRange: [TimeRange, (timeRange: TimeRange) => void];
  profile: ProfileData;
  weightSlope: number;
  activeSlope: number;
  deltas: Delta[];
}

const dashboardContext = createContext<DashboardData | undefined>(undefined);

export const DashboardProvider: FC<PropsWithChildren<{ data: DashboardData }>> = ({ data, children }) => (
  <dashboardContext.Provider value={data}>{children}</dashboardContext.Provider>
);

const useTimeRangeState = createPersistedState("timeRange");

export const useDashboardData = (): DashboardData => {
  const data = useContext(dashboardContext);
  if (!data) {
    throw new Error("Called useDashboardData() when the provider is not present.");
  }
  return data;
};

export const useComputeDashboardData = (user?: string) => {
  const [mode, setMode] = useState<Mode>("weight");
  const [timeRange, setTimeRange] = useTimeRangeState<TimeRange>("4w");

  const profile = useQuery(profileQuery(user)).data!;
  const sourceData = useQuery(sourceDataQuery(user)).data!;

  const measurements = useMemo(() => computeMeasurements(sourceData, profile), [profile, sourceData]);
  const dataPoints = useMemo(() => computeDataPoints(mode, measurements), [measurements, mode]);
  const weightSlope = useMemo(() => computeWeightSlope(measurements), [measurements]);
  const activeSlope = useMemo(() => computeActiveSlope(mode, dataPoints), [mode, dataPoints]);
  const deltas = useMemo(() => computeDeltas(mode, dataPoints), [mode, dataPoints]);

  if (!measurements || !dataPoints) {
    return undefined;
  }

  const data: DashboardData = {
    dataPoints,
    measurements,
    profile,
    mode: [mode, setMode],
    timeRange: [timeRange, setTimeRange],
    weightSlope,
    activeSlope,
    deltas,
  };

  return data;
};
