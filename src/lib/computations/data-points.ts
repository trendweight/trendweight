import _ from "lodash";
import { logCall } from "../core/utils";
import { DataPoint, Measurement, Mode } from "./interfaces";

const propertyFromMode = {
  weight: "Weight",
  fatpercent: "FatPercent",
  fatmass: "FatMass",
  leanmass: "LeanMass",
};

export const computeDataPoints = (mode: Mode, measurements?: Measurement[]) => {
  logCall("computeDataPoints", `measurements.length: ${measurements?.length}, ${mode}`);

  if (!measurements) {
    return;
  }

  const property = propertyFromMode[mode];
  const interpolated = mode === "weight" ? "weightIsInterpolated" : "fatIsInterpolated";
  return _.chain(measurements)
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any) =>
        ({
          date: m.date,
          source: m.source,
          actual: m[`actual${property}`],
          trend: m[`trend${property}`],
          isInterpolated: m[interpolated],
        } as DataPoint)
    )
    .sortBy((m) => m.date.toString())
    .dropWhile((m) => m.actual === undefined)
    .dropRightWhile((m) => m.actual === undefined)
    .value();
};
