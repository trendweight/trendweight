import { ChronoUnit, LocalDate } from "@js-joda/core";
import _ from "lodash";
import { DataPoint, Delta, Measurement, Mode } from "../../shared/interfaces";
import { log, logCall } from "../../shared/logging";

export const computeDeltas = (mode: Mode, dataPoints?: DataPoint[]) => {
  logCall("computeDeltas", mode);
  const deltas: Delta[] = [];

  if (!dataPoints) {
    return deltas;
  }

  // clone the array, and reverse it
  const points = _.chain(dataPoints).slice().reverse().value();
  if (points.length == 0) {
    return deltas;
  }

  const today = LocalDate.now();

  const daysSinceMostRecent = points[0].date.until(today, ChronoUnit.DAYS);
  if (daysSinceMostRecent > 2 || points.length <= 1) {
    return deltas; // not enough recent readings
  }

  const mostRecentTrendValue = points[0].trend;
  let comparisonDataPoint: DataPoint;
  let targetDate: LocalDate;
  let index: number;

  const deltaStart = today.equals(points[0].date) ? today : today.plusDays(-1);

  // yesterday
  if (daysSinceMostRecent <= 1) {
    comparisonDataPoint = points[1];
    if (comparisonDataPoint.date.until(deltaStart, ChronoUnit.DAYS) === 1) {
      deltas.push({
        period: 1,
        description: "yesterday",
        delta: mostRecentTrendValue - comparisonDataPoint.trend,
      });
    }
  }

  // a week ago
  targetDate = deltaStart.plusDays(-7);
  index = _.findIndex(points, (m) => m.date.equals(targetDate));
  // needs to be at least 4 readings between now and a week ago for a valid trend comparison
  if (index >= 4) {
    comparisonDataPoint = points[index];
    deltas.push({
      period: 7,
      description: "last week",
      delta: mostRecentTrendValue - comparisonDataPoint.trend,
    });
  }

  // two weeks ago
  targetDate = deltaStart.plusDays(-14);
  index = _.findIndex(points, (m) => m.date.equals(targetDate));
  // needs to be at least 9 readings between now and a week ago for a valid trend comparison
  if (index >= 9) {
    comparisonDataPoint = points[index];
    deltas.push({
      period: 14,
      description: "two weeks ago",
      delta: mostRecentTrendValue - comparisonDataPoint.trend,
    });
  }

  // a month ago
  targetDate = deltaStart.plusDays(-28);
  index = _.findIndex(points, (m) => m.date.equals(targetDate));
  // needs to be at least 9 readings between now and a week ago for a valid trend comparison
  if (index >= 19) {
    comparisonDataPoint = points[index];
    deltas.push({
      period: 28,
      description: "a month ago",
      delta: mostRecentTrendValue - comparisonDataPoint.trend,
    });
  }

  log(deltas);

  return deltas;
};

export const computeActiveSlope = (mode: Mode, dataPoints?: DataPoint[]) => {
  logCall("computeActiveSlope", mode);
  if (!dataPoints) {
    return 0;
  }

  const count = mode === "weight" ? 14 : 28;
  const values = _.chain(dataPoints)
    .takeRight(count)
    .map((m) => m.trend)
    .value();
  return calculateSlope(values);
};

export const computeWeightSlope = (measurements?: Measurement[]) => {
  logCall("computeWeightSlope");
  if (!measurements) {
    return 0;
  }

  const weights = _.chain(measurements)
    .takeRight(14)
    .map((m) => m.trendWeight)
    .value();
  return calculateSlope(weights);
};

const calculateSlope = (values: number[]) => {
  const count = values.length;
  let averageX = 0;
  let averageY = 0;
  let numerator = 0;
  let denominator = 0;

  // calculate averages
  values.forEach((value, index) => {
    averageX += index;
    averageY += value;
  });
  averageX /= count;
  averageY /= count;

  // calculate numerator / denominator
  values.forEach((value, index) => {
    numerator += (index - averageX) * (value - averageY);
    denominator += Math.pow(index - averageX, 2);
  });

  return numerator / denominator;
};
