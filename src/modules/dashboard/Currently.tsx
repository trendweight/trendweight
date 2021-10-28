import { Box, Stack } from "@chakra-ui/react";
import { LocalDate } from "@js-joda/core";
import _ from "lodash";
import React from "react";
import { shortDate } from "../core/dates";
import { DataPoint, Modes } from "../core/interfaces";
import { formatMeasurement } from "../core/numbers";
import ChangeArrow from "./ChangeArrow";
import { useDashboardData } from "./context";

const Currently = () => {
  const {
    dataPoints,
    mode: [mode],
    profile: { useMetric, plannedPoundsPerWeek, goalWeight, goalStart },
  } = useDashboardData();

  if (dataPoints.length === 0) {
    return null;
  }

  let first: DataPoint = dataPoints[0];
  const goalStartDate = goalStart && LocalDate.parse(goalStart);
  if (goalStartDate) {
    const cutoff = goalStartDate.minusDays(1);
    first = _.find(dataPoints, (m) => m.date.isAfter(cutoff)) || first;
  }
  const last = dataPoints[dataPoints.length - 1];
  const difference = last.trend - first.trend;
  let intendedDirection: number;
  if (mode === "weight") {
    intendedDirection = plannedPoundsPerWeek || (goalWeight ? goalWeight - first.trend : -1);
  } else if (mode === "fatpercent" || mode === "fatmass") {
    intendedDirection = -1;
  } else {
    intendedDirection = 1;
  }

  return (
    <Stack direction="column" spacing={0} pb={{ md: 12 }}>
      <Box fontWeight={300} fontSize="lg">
        Current {Modes[mode]}
      </Box>
      <Box fontSize={{ base: "4xl", md: "5xl" }} fontWeight="medium">
        {formatMeasurement(last.trend, { type: mode, metric: useMetric })}
      </Box>
      <Stack direction="row" align="center" fontSize="2xl">
        <Box>{formatMeasurement(difference, { type: mode, metric: useMetric, sign: true })}</Box>
        <Box>
          <ChangeArrow change={difference} intendedDirection={intendedDirection} />
        </Box>
      </Stack>
      <Box color="gray.600" fontWeight={300} fontStyle="italic" fontSize="sm" pt={2}>
        {goalStartDate ? `since ${shortDate(goalStartDate)}` : `as of ${shortDate(last.date)}`}
      </Box>
    </Stack>
  );
};

export default Currently;
