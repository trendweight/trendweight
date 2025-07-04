import { ToggleButton } from "../shared/ToggleButton"
import { ToggleButtonGroup } from "../shared/ToggleButtonGroup"
import { useDashboardData } from "../../lib/dashboard/context"
import type { Mode, TimeRange } from "../../lib/core/interfaces"

const Buttons = () => {
  const {
    mode: [mode, setMode],
    timeRange: [timeRange, setTimeRange],
  } = useDashboardData()

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      <ToggleButtonGroup 
        value={timeRange} 
        onChange={(value) => setTimeRange(value as TimeRange)} 
        defaultValue="4w" 
        aria-label="Time Range"
      >
        <ToggleButton value="4w">4 weeks</ToggleButton>
        <ToggleButton value="3m">3 months</ToggleButton>
        <ToggleButton value="6m">6 months</ToggleButton>
        <ToggleButton value="1y">1 year</ToggleButton>
        <ToggleButton value="all">All</ToggleButton>
      </ToggleButtonGroup>
      
      <ToggleButtonGroup 
        value={mode} 
        onChange={(value) => setMode(value as Mode)} 
        defaultValue="weight" 
        aria-label="Mode"
      >
        <ToggleButton value="weight">Weight</ToggleButton>
        <ToggleButton value="fatpercent">Fat %</ToggleButton>
        <ToggleButton value="fatmass">Fat Mass</ToggleButton>
        <ToggleButton value="leanmass">Lean Mass</ToggleButton>
      </ToggleButtonGroup>
    </div>
  )
}

export default Buttons