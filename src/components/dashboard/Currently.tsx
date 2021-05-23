import { Box, Stack } from "@chakra-ui/layout";
import { Icon } from "@chakra-ui/react";
import React from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { Modes } from "~/lib/computations/interfaces";
import { shortDate } from "~/lib/core/utils";
import { useDashboardData } from "~/lib/dashboard/context";

const Currently = () => {
  const {
    dataPoints,
    mode: [mode],
    profile: { useMetric },
  } = useDashboardData();
  if (dataPoints.length === 0) {
    return null;
  }
  const valueFormat = Intl.NumberFormat([], {
    maximumFractionDigits: 1,
    style: mode === "fatpercent" ? "percent" : "unit",
    unit: mode === "fatpercent" ? undefined : useMetric ? "kilogram" : "pound",
  });
  const differenceFormat = Intl.NumberFormat([], {
    maximumFractionDigits: 1,
    style: mode === "fatpercent" ? "percent" : "unit",
    unit: mode === "fatpercent" ? undefined : useMetric ? "kilogram" : "pound",
    signDisplay: "always",
  });

  const first = dataPoints[0];
  const last = dataPoints[dataPoints.length - 1];
  const difference = last.trend - first.trend;

  return (
    <Stack direction="column" spacing={0}>
      <Box fontWeight={300} fontSize="lg">
        Current {Modes[mode]}
      </Box>
      <Box fontSize={{ base: "4xl", md: "5xl" }} fontWeight="medium">
        {valueFormat.format(last.trend)}
      </Box>
      <Stack direction="row" align="center" fontSize="2xl">
        <Box>{differenceFormat.format(difference)}</Box>
        <Box>{difference < 0 ? <Icon as={ImArrowDown} /> : <Icon as={ImArrowUp} />}</Box>
      </Stack>
      <Box color="gray.600" fontWeight={300} fontStyle="italic" fontSize="sm" pt={2}>
        as of {shortDate(last.date)}
      </Box>
    </Stack>
  );
};

export default Currently;
