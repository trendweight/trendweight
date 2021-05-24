import { Box, Stack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";
import React from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { Modes } from "~/lib/computations/interfaces";
import { useDashboardData } from "~/lib/dashboard/context";
import { shortDate } from "~/lib/utils/dates";
import { formatMeasurement } from "~/lib/utils/numbers";

const Currently = () => {
  const {
    dataPoints,
    mode: [mode],
    profile: { useMetric },
  } = useDashboardData();

  if (dataPoints.length === 0) {
    return null;
  }

  const first = dataPoints[0];
  const last = dataPoints[dataPoints.length - 1];
  const difference = last.trend - first.trend;

  return (
    <Stack direction="column" spacing={0}>
      <Box fontWeight={300} fontSize="lg">
        Current {Modes[mode]}
      </Box>
      <Box fontSize={{ base: "4xl", md: "5xl" }} fontWeight="medium">
        {formatMeasurement(last.trend, { type: mode, metric: useMetric })}
      </Box>
      <Stack direction="row" align="center" fontSize="2xl">
        <Box>{formatMeasurement(difference, { type: mode, metric: useMetric, sign: true })}</Box>
        <Box>{difference < 0 ? <Icon as={ImArrowDown} /> : <Icon as={ImArrowUp} />}</Box>
      </Stack>
      <Box color="gray.600" fontWeight={300} fontStyle="italic" fontSize="sm" pt={2}>
        as of {shortDate(last.date)}
      </Box>
    </Stack>
  );
};

export default Currently;
