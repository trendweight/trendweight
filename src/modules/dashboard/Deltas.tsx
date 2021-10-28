import { Box, Heading } from "@chakra-ui/react";
import React from "react";
import { Modes } from "../shared/interfaces";
import { formatMeasurement } from "../shared/numbers";
import ChangeArrow from "./ChangeArrow";
import { useDashboardData } from "./context";

const Deltas = () => {
  const {
    deltas,
    mode: [mode],
    dataPoints,
    profile: { plannedPoundsPerWeek, goalWeight },
  } = useDashboardData();

  if (deltas.length === 0) {
    return null;
  }

  const last = dataPoints[dataPoints.length - 1];
  let intendedDirection: number;
  if (mode === "weight") {
    intendedDirection = plannedPoundsPerWeek || (goalWeight ? goalWeight - last.trend : -1);
  } else if (mode === "fatpercent" || mode === "fatmass") {
    intendedDirection = -1;
  } else {
    intendedDirection = 1;
  }

  return (
    <Box>
      <Heading>{Modes[mode]} Changes Over Time</Heading>
      <Box lineHeight={1.6}>
        {deltas.map((d) => {
          return (
            <Box key={d.period}>
              Since {d.description}: <ChangeArrow change={d.delta} intendedDirection={intendedDirection} /> {formatMeasurement(d.delta, { type: mode })}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Deltas;
