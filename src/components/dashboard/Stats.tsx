import { Box, Heading, List, ListItem } from "@chakra-ui/react";
import { ChronoUnit, LocalDate, Period } from "@js-joda/core";
import _ from "lodash";
import React from "react";
import { useDashboardData } from "~/lib/dashboard/context";
import { Measurement } from "~/lib/interfaces";
import { shortDate } from "~/lib/utils/dates";
import { formatNumber, formatWeight } from "~/lib/utils/numbers";

const Stats = () => {
  const {
    weightSlope,
    measurements,
    profile: { useMetric, goalWeight, showCalories, plannedPoundsPerWeek },
  } = useDashboardData();

  const lastMeasurement = measurements[measurements.length - 1];
  const gainPerWeek = Math.abs(weightSlope * 7);

  const duration = calculateDuration(measurements[0].date, lastMeasurement.date);
  const distanceToGoal = calculateDistanceToGoal(measurements, useMetric, goalWeight);
  const dateOfGoal = calculateDateOfGoal(weightSlope, lastMeasurement, goalWeight, distanceToGoal);

  const ppw = useMetric ? plannedPoundsPerWeek && plannedPoundsPerWeek * (2.20462262 / 2) : plannedPoundsPerWeek;
  const caloriesPerDay = (gainPerWeek / 7) * 3500 * (useMetric ? 2.20462262 : 1);
  const caloriesVsPlan = plannedPoundsPerWeek !== undefined ? caloriesPerDay - plannedPoundsPerWeek * 500 : 0;

  return (
    <Box>
      <Heading>Overall Weight Statistics</Heading>
      <List>
        <ListItem>
          You are {weightSlope > 0 ? "gaining" : "losing"} <b>{formatWeight(gainPerWeek, useMetric)}/week</b> of total
          weight.{" "}
        </ListItem>
        <ListItem mt={4}>
          You have been tracking your weight for <b>{duration}</b>.
        </ListItem>
        {distanceToGoal &&
          (distanceToGoal === 0 ? (
            <ListItem>You have reached your goal weight.</ListItem>
          ) : (
            <>
              <ListItem>
                You have <b>{formatWeight(Math.abs(distanceToGoal), useMetric)}</b> to{" "}
                {distanceToGoal > 0 ? "lose" : "gain"} to reach your goal.
              </ListItem>
              {dateOfGoal && (
                <ListItem>
                  You will reach your goal around <b>{shortDate(dateOfGoal)}</b>
                </ListItem>
              )}
            </>
          ))}
        {showCalories && ppw && ppw <= 0 && (
          <>
            <ListItem mt={4}>
              You are burning <b>{formatNumber(caloriesPerDay)} cal/day</b> {weightSlope > 0 ? "less" : "more"} than you
              are eat.
            </ListItem>
            <ListItem>
              {caloriesVsPlan < 0 ? (
                <>
                  You are burning <b>{formatNumber(-1 * caloriesVsPlan)} cal/day</b> beyond your plan.
                </>
              ) : (
                <>
                  You must cut <b>{formatNumber(caloriesVsPlan)} cal/day</b> to lose {formatWeight(-1 * ppw, useMetric)}
                  /week.
                </>
              )}
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );
};

const calculateDuration = (start: LocalDate, end: LocalDate) => {
  const period = Period.between(start, end).normalized();
  const days = start.until(end, ChronoUnit.DAYS);
  const weeks = Math.floor(days / 7);
  const months = period.years() * 12 + period.months();
  const years = period.years();
  let duration;
  if (years > 1) {
    duration = `${years} years`;
  } else if (months > 12) {
    duration = `${months} months`;
  } else if (days > 7) {
    duration = `${weeks} weeks`;
  } else {
    duration = `${days} days`;
  }
  return duration;
};

const calculateDistanceToGoal = (measurements: Measurement[], metric: boolean, goalWeight?: number) => {
  if (!goalWeight) {
    return undefined;
  }

  const goalRange = metric ? 1.134 : 2.5;
  const lastBelowGoal = _.findLast(measurements, (m) => m.trendWeight <= goalWeight);
  const lastAboveGoal = _.findLast(measurements, (m) => m.trendWeight > goalWeight);
  const lastBelowMin = _.findLast(measurements, (m) => m.trendWeight <= goalWeight - goalRange);
  const lastAboveMax = _.findLast(measurements, (m) => m.trendWeight > goalWeight + goalRange);

  if (!lastBelowMin && !lastAboveMax) {
    // weight was never outside of goal range = maintaining
    return 0;
  }

  if (
    lastAboveMax &&
    (!lastBelowMin || lastAboveMax.date.isAfter(lastBelowMin.date)) &&
    lastBelowGoal &&
    lastBelowGoal.date.isAfter(lastAboveMax.date)
  ) {
    // If was above max more recently the last time was below min,
    // and has been below the goal more recently then when it was above max.
    // In other words, weight is heading down and has passed the goal
    // but not gone below the min.
    // = maintaining
    return 0;
  }

  if (
    lastBelowMin &&
    (!lastAboveMax || lastBelowMin.date.isAfter(lastAboveMax.date)) &&
    lastAboveGoal &&
    lastAboveGoal.date.isAfter(lastBelowMin.date)
  ) {
    // If was below min more recently the last time was above max,
    // and has been above the goal more recently then when it was below min.
    // In other words, weight is heading up and has passed the goal
    // but not gone above the max.
    // = maintaining
    return 0;
  }

  // not maintaining, so return the difference between current weight and goal
  return measurements[measurements.length - 1].trendWeight - goalWeight;
};

const calculateDateOfGoal = (
  weightSlope: number,
  lastMeasurement: Measurement,
  goalWeight?: number,
  distanceToGoal?: number
) => {
  if (goalWeight && distanceToGoal) {
    const currentWeight = lastMeasurement.trendWeight;
    if (
      goalWeight &&
      ((weightSlope > 0 && currentWeight < goalWeight) || (weightSlope <= 0 && currentWeight > goalWeight))
    ) {
      return lastMeasurement.date.plusDays(Math.floor(Math.abs(distanceToGoal / weightSlope)));
    }
  }
  return undefined;
};

export default Stats;
