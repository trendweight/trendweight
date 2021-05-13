import { useMemo } from "react";
import { computeMeasurements } from "../dashboard/measurements";
import { useSourceData } from "./data";
import { useSettings } from "./settings";

export const useMeasurements = (user?: string) => {
  const { data: settings } = useSettings();
  const { data: sourceData } = useSourceData(user);
  const measurements = useMemo(() => computeMeasurements(sourceData, settings), [sourceData, settings]);
  return measurements;
};
