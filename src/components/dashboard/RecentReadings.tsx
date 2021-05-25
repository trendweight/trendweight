import { Box, Heading } from "@chakra-ui/layout";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import _ from "lodash";
import { useDashboardData } from "~/lib/dashboard/context";
import { Modes } from "~/lib/interfaces";
import { recentDate } from "~/lib/utils/dates";
import { formatMeasurement } from "~/lib/utils/numbers";

const RecentReadings = () => {
  const {
    dataPoints,
    mode: [mode],
    profile: { useMetric },
  } = useDashboardData();

  const readings = _.takeRight(dataPoints, 14).reverse();
  return (
    <Box>
      <Heading>Recent {Modes[mode]} Readings</Heading>
      <Table w={{ base: "full", md: "auto" }} minW={{ md: "280px" }} size="sm">
        <Thead>
          <Tr>
            <Th pl={0}>Date</Th>
            <Th textAlign="right">Actual</Th>
            <Th textAlign="right" pr={0}>
              Trend
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {readings.map((m) => (
            <Tr key={m.date.toEpochDay()}>
              <Td pl={0}>{recentDate(m.date)}</Td>
              <Td color="gray.400" textAlign="right">
                {formatMeasurement(m.actual, { type: mode, metric: useMetric, units: false })}
              </Td>
              <Td textAlign="right" pr={0} fontWeight="semibold">
                {formatMeasurement(m.trend, { type: mode, metric: useMetric, units: false })}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RecentReadings;
