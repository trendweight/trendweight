import { ChronoUnit, Instant, ZoneId } from "@js-joda/core";
import type { Measurement, ProfileData, SourceMeasurement, SourceData } from "../../core/interfaces";
import "../../core/time";

export const computeMeasurements = (data: SourceData[], profile: ProfileData): Measurement[] => {

  const dayStartOffset = profile.dayStartOffset || 0;

  // combines measurements from all sources into a single array
  const rawData: SourceMeasurement[] = data
    .map((sourceData) => {
      if (!sourceData.measurements) {
        return [];
      }
      return sourceData.measurements.map((sourceMeasurement) => {
        const timestamp = Instant.ofEpochSecond(sourceMeasurement.timestamp).atZone(ZoneId.of(profile.timezone)).toLocalDateTime();
        return {
          date: timestamp.minusHours(dayStartOffset).toLocalDate(),
          timestamp,
          source: sourceData.source,
          weight: sourceMeasurement.weight,
          fatRatio: sourceMeasurement.fatRatio,
          weightIsInterpolated: false,
        };
      });
    })
    .flat();

  // groups all source measurements by day
  const groupedByDay = Object.groupBy(rawData, (m) => m.date.toString()) as Record<string, SourceMeasurement[]>;

  // selects the first source measurement of each day
  let sourceMeasurements = Object.keys(groupedByDay)
    .map((key) => {
      const dayMeasurements = groupedByDay[key] || [];
      return dayMeasurements.toSorted((a, b) => a.timestamp.toString().localeCompare(b.timestamp.toString()))[0];
    })
    .filter(Boolean)
    .toSorted((a, b) => a.date.toString().localeCompare(b.date.toString()));

  // fill in missing days and interpolate weights
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
  sourceMeasurements = [...sourceMeasurements, ...missingDays].toSorted((a, b) => a.date.toString().localeCompare(b.date.toString()));

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

  const measurementsByDate = Object.fromEntries(measurements.map((m) => [m.date.toString(), m]));

  // now find missing fatRatios and interpolate
  const fatGroupedByDay = Object.groupBy(
    rawData.filter((m) => m.fatRatio !== undefined).toSorted((a, b) => a.timestamp.toString().localeCompare(b.timestamp.toString())),
    (m) => m.date.toString(),
  ) as Record<string, SourceMeasurement[]>;

  // selects the first source measurement of each day
  let fatSourceMeasurements = Object.keys(fatGroupedByDay)
    .map((key) => {
      const dayMeasurements = fatGroupedByDay[key] || [];
      return dayMeasurements.toSorted((a, b) => a.timestamp.toString().localeCompare(b.timestamp.toString()))[0];
    })
    .filter(Boolean)
    .toSorted((a, b) => a.date.toString().localeCompare(b.date.toString()));

  const missingFatDays: SourceMeasurement[] = [];

  previous = undefined;
  for (let ndx = 0; ndx < fatSourceMeasurements.length; ndx++) {
    const currentFat = fatSourceMeasurements[ndx];
    if (previous) {
      const daysBetween = previous.date.until(currentFat.date, ChronoUnit.DAYS);
      if (daysBetween > 1) {
        const fatChangePerDay = (currentFat.fatRatio! - previous.fatRatio!) / daysBetween;
        const weightChangePerDay = (currentFat.weight - previous.weight) / daysBetween;
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

  fatSourceMeasurements = [...fatSourceMeasurements, ...missingFatDays].toSorted((a, b) => a.date.toString().localeCompare(b.date.toString()));

  // compute fat trends
  let trendFatRatio = 0;
  let trendFatMass = 0;
  let trendLeanMass = 0;

  for (let ndx = 0; ndx < fatSourceMeasurements.length; ndx++) {
    const sourceMeasurement = fatSourceMeasurements[ndx];
    const weight = sourceMeasurement.weight;
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
    if (measurement) {
      measurement.actualFatPercent = fatRatio;
      measurement.actualFatMass = fatMass;
      measurement.actualLeanMass = leanMass;
      measurement.trendFatPercent = trendFatRatio;
      measurement.trendFatMass = trendFatMass;
      measurement.trendLeanMass = trendLeanMass;
      measurement.fatIsInterpolated = sourceMeasurement.fatRatioIsInterpolated || false;
    } else {
      // This is an interpolated fat day that doesn't have a corresponding weight measurement
      // We need to create a new measurement for this day
      measurements.push({
        date: sourceMeasurement.date,
        source: sourceMeasurement.source,
        actualWeight: sourceMeasurement.weight,
        trendWeight: sourceMeasurement.weight, // Use the interpolated weight as trend too
        weightIsInterpolated: true,
        actualFatPercent: fatRatio,
        actualFatMass: fatMass,
        actualLeanMass: leanMass,
        trendFatPercent: trendFatRatio,
        trendFatMass: trendFatMass,
        trendLeanMass: trendLeanMass,
        fatIsInterpolated: sourceMeasurement.fatRatioIsInterpolated || false,
      });
    }
  }

  // Re-sort measurements after adding interpolated fat days
  return measurements.toSorted((a, b) => a.date.toString().localeCompare(b.date.toString()));
};
