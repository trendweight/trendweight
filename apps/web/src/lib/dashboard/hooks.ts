import { useContext, useMemo, useState } from "react";
import { dashboardContext, type DashboardData } from "./dashboardContext";
import { useDashboardQueries } from "../api/queries";
import type { Mode, TimeRange } from "../core/interfaces";
import { usePersistedState } from "../hooks/usePersistedState";
import { computeDataPoints } from "./computations/data-points";
import { computeMeasurements } from "./computations/measurements";
import { computeActiveSlope, computeDeltas, computeWeightSlope } from "./computations/stats";

export const useDashboardData = (): DashboardData => {
  const data = useContext(dashboardContext);
  if (!data) {
    throw new Error("Called useDashboardData() when the provider is not present.");
  }
  return data;
};

export const useComputeDashboardData = (): DashboardData => {
  const [mode, setMode] = useState<Mode>("weight");
  const [timeRange, setTimeRange] = usePersistedState<TimeRange>("timeRange", "4w");

  // Get profile and measurement data in parallel
  const { profile, measurementData: apiSourceData, providerStatus } = useDashboardQueries();

  // Transform API data to match core interfaces
  const sourceData = useMemo(
    () =>
      apiSourceData.map((data) => ({
        source: data.source as "withings" | "fitbit",
        lastUpdate: data.lastUpdate,
        measurements: data.measurements,
      })),
    [apiSourceData],
  );

  // Compute derived data - profile and apiSourceData are guaranteed by suspense
  const measurements = useMemo(() => computeMeasurements(sourceData, profile), [profile, sourceData]);

  const dataPoints = useMemo(() => computeDataPoints(mode, measurements), [measurements, mode]);

  const weightSlope = useMemo(() => computeWeightSlope(measurements), [measurements]);

  const activeSlope = useMemo(() => computeActiveSlope(mode, dataPoints), [mode, dataPoints]);

  const deltas = useMemo(() => computeDeltas(mode, dataPoints), [mode, dataPoints]);

  const data: DashboardData = {
    dataPoints,
    measurements,
    profile,
    mode: [mode, setMode],
    timeRange: [timeRange, setTimeRange],
    weightSlope,
    activeSlope,
    deltas,
    providerStatus,
  };

  return data;
};
