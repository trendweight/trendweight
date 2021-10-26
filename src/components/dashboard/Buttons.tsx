import { Stack } from "@chakra-ui/react";
import { useDashboardData } from "~/lib/dashboard/context";
import { ToggleButton } from "../shared/ToggleButton";
import { ToggleButtonGroup } from "../shared/ToggleButtonGroup";

const Buttons = () => {
  const {
    mode: [mode, SetMode],
    timeRange: [timeRange, setTimeRange],
  } = useDashboardData();

  return (
    <Stack direction={{ base: "column-reverse", md: "row" }} spacing={4}>
      <ToggleButtonGroup value={timeRange} onChange={setTimeRange} defaultValue="4w" aria-label="Time Range">
        <ToggleButton value="4w">4 weeks</ToggleButton>
        <ToggleButton value="3m">3 months</ToggleButton>
        <ToggleButton value="6m">6 months</ToggleButton>
        <ToggleButton value="1y">1 year</ToggleButton>
        <ToggleButton value="all">All</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value={mode} onChange={SetMode} defaultValue="weight" aria-label="Mode">
        <ToggleButton value="weight">Weight</ToggleButton>
        <ToggleButton value="fatpercent">Fat %</ToggleButton>
        <ToggleButton value="fatmass">Fat Mass</ToggleButton>
        <ToggleButton value="leanmass">Lean Mass</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
};

export default Buttons;
