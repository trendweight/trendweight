import { ChronoUnit, Instant, ZoneId } from "@js-joda/core";
import _ from "lodash";
import "~/lib/core/time";
import { Profile, SourceData, SourceMeasurement } from "../data/interfaces";
import { logCall } from "../utils/logging";
import { Measurement } from "./interfaces";

export const computeMeasurements = (data?: SourceData[], profile?: Profile) => {
  logCall("computeMeasurements", `data: ${!!data}`, `profile: ${!!profile}`);

  if (!data || !profile) {
    return undefined;
  }

  // combines measurements from all sources into a single array
  const rawData: SourceMeasurement[] = _.flatten(
    data.map((sourceData) => {
      if (!sourceData.measurements) {
        return [];
      }
      return sourceData.measurements.map((sourceMeasurement) => {
        const timestamp = Instant.ofEpochSecond(sourceMeasurement.timestamp)
          .atZone(ZoneId.of(profile.timezone))
          .toLocalDateTime();
        return {
          date: timestamp.toLocalDate(),
          timestamp,
          source: sourceData.source,
          weight: sourceMeasurement.weight,
          fatRatio: sourceMeasurement.fatRatio,
          weightIsInterpolated: false,
        };
      });
    })
  );

  // groups all source measurements by day
  const groupedByDay = _.groupBy(rawData, (m) => m.date.toString());

  // selects the first source measurement of each day
  let sourceMeasurements = _.chain(groupedByDay)
    .keys()
    .map((key) => _.sortBy(groupedByDay[key], (m) => m.timestamp.toString())[0])
    .sortBy((m) => m.date.toString())
    .value();

  //fill in missing days and interpolate weights
  const missingDays: SourceMeasurement[] = [];
  let previous: SourceMeasurement | undefined = undefined;
  for (let i = 0; i < sourceMeasurements.length; i++) {
    const currentWeight = sourceMeasurements[i];
    if (previous) {
      const daysBetween = previous.date.until(currentWeight.date, ChronoUnit.DAYS);
      if (daysBetween > 1) {
        const changePerDay = (currentWeight.weight - previous.weight) / daysBetween;
        let weight = previous.weight;
        for (let date = previous.date.plusDays(1); date.isBefore(currentWeight.date); date = date.plusDays(1)) {
          weight += changePerDay;
          missingDays.push({
            date,
            weight,
            timestamp: date.atTime(23, 59, 59),
            source: "interpolated",
            weightIsInterpolated: true,
          });
        }
      } else {
        currentWeight.weightIsInterpolated = false;
      }
    }
    previous = currentWeight;
  }

  // add in the missing days and re-sort
  sourceMeasurements = _.chain(sourceMeasurements)
    .concat(missingDays)
    .sortBy((m) => m.date.toString())
    .value();

  // compute weight trends
  let trendWeight = 0;
  const measurements: Measurement[] = [];
  for (let i = 0; i < sourceMeasurements.length; i++) {
    const sourceMeasurement = sourceMeasurements[i];
    const weight = sourceMeasurement.weight;
    if (i === 0) {
      trendWeight = weight;
    } else {
      trendWeight = trendWeight + 0.1 * (weight - trendWeight);
    }
    measurements.push({
      date: sourceMeasurement.date,
      source: sourceMeasurement.source,
      actualWeight: sourceMeasurement.weight,
      trendWeight: trendWeight,
      weightIsInterpolated: sourceMeasurement.weightIsInterpolated || false,
      fatIsInterpolated: false, // for now, set correctly below
    });
  }

  const measurementsByDate = _.keyBy(measurements, (m) => m.date.toString());

  // now find missing fatRatios and interpolate
  const fatGroupedByDay = _.chain(rawData)
    .filter((m) => m.fatRatio !== undefined)
    .sortBy((m) => m.timestamp.toString())
    .groupBy((m) => m.date.toString())
    .value();

  // selects the first source measurement of each day
  let fatSourceMeasurements = _.chain(fatGroupedByDay)
    .keys()
    .map((key) => _.sortBy(fatGroupedByDay[key], (m) => m.timestamp.toString())[0])
    .value();

  const missingFatDays: SourceMeasurement[] = [];

  previous = undefined;
  for (let ndx = 0; ndx < fatSourceMeasurements.length; ndx++) {
    const currentFat = fatSourceMeasurements[ndx];
    if (previous) {
      const daysBetween = previous.date.until(currentFat.date, ChronoUnit.DAYS);
      if (daysBetween > 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const fatChangePerDay = (currentFat.fatRatio! - previous.fatRatio!) / daysBetween;
        const weightChangePerDay = (currentFat.weight - previous.weight) / daysBetween;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let fatRatio = previous.fatRatio!;
        let weight = previous.weight;
        for (let date = previous.date.plusDays(1); date.isBefore(currentFat.date); date = date.plusDays(1)) {
          fatRatio += fatChangePerDay;
          weight += weightChangePerDay;
          missingFatDays.push({
            date: date,
            source: "interpolated",
            weight: weight,
            weightIsInterpolated: true,
            timestamp: date.atStartOfDay(),
            fatRatio: fatRatio,
            fatRatioIsInterpolated: true,
          });
        }
      }
    }
    previous = currentFat;
  }

  fatSourceMeasurements = _.chain(fatSourceMeasurements)
    .concat(missingFatDays)
    .sortBy((m) => m.date.toString())
    .value();

  // compute fat trends
  let trendFatRatio = 0;
  let trendFatMass = 0;
  let trendLeanMass = 0;
  for (let ndx = 0; ndx < fatSourceMeasurements.length; ndx++) {
    const sourceMeasurement = fatSourceMeasurements[ndx];
    const weight = sourceMeasurement.weight;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fatRatio = sourceMeasurement.fatRatio!;
    const fatMass = weight * fatRatio;
    const leanMass = weight - fatMass;

    if (ndx === 0) {
      trendFatRatio = fatRatio;
      trendFatMass = fatMass;
      trendLeanMass = leanMass;
    } else {
      trendFatRatio = trendFatRatio + 0.1 * (fatRatio - trendFatRatio);
      trendFatMass = trendFatMass + 0.1 * (fatMass - trendFatMass);
      trendLeanMass = trendLeanMass + 0.1 * (leanMass - trendLeanMass);
    }

    const measurement = measurementsByDate[sourceMeasurement.date.toString()];
    measurement.actualFatPercent = fatRatio;
    measurement.actualFatMass = fatMass;
    measurement.actualLeanMass = leanMass;
    measurement.trendFatPercent = trendFatRatio;
    measurement.trendFatMass = trendFatMass;
    measurement.trendLeanMass = trendLeanMass;
    measurement.fatIsInterpolated = sourceMeasurement.fatRatioIsInterpolated || false;
  }

  return measurements;
};
