import { useEffect } from "react";
import { ToggleButton } from "../ui/ToggleButton";
import { ToggleButtonGroup } from "../ui/ToggleButtonGroup";
import { useDashboardData } from "../../lib/dashboard/hooks";
import { useIsMobile } from "../../lib/hooks/useMediaQuery";
import type { Mode, TimeRange } from "../../lib/core/interfaces";

const Buttons = () => {
  const {
    mode: [mode, setMode],
    timeRange: [timeRange, setTimeRange],
  } = useDashboardData();
  const isMobile = useIsMobile();

  // Switch away from explore mode when going to mobile
  useEffect(() => {
    if (isMobile && timeRange === "explore") {
      setTimeRange("4w");
    }
  }, [isMobile, timeRange, setTimeRange]);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <ToggleButtonGroup value={timeRange} onChange={(value) => setTimeRange(value as TimeRange)} defaultValue="4w" aria-label="Time Range">
        <ToggleButton value="4w">4 weeks</ToggleButton>
        <ToggleButton value="3m">3 months</ToggleButton>
        <ToggleButton value="6m">6 months</ToggleButton>
        <ToggleButton value="1y">1 year</ToggleButton>
        <ToggleButton value="all">All</ToggleButton>
        {!isMobile && <ToggleButton value="explore">Explore</ToggleButton>}
      </ToggleButtonGroup>

      <ToggleButtonGroup value={mode} onChange={(value) => setMode(value as Mode)} defaultValue="weight" aria-label="Mode">
        <ToggleButton value="weight">Weight</ToggleButton>
        <ToggleButton value="fatpercent">Fat %</ToggleButton>
        <ToggleButton value="fatmass">Fat Mass</ToggleButton>
        <ToggleButton value="leanmass">Lean Mass</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default Buttons;
