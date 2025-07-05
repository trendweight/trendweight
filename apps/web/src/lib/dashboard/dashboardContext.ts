import { createContext } from "react"
import type { DataPoint, Delta, Measurement, Mode, ProfileData, TimeRange } from "../core/interfaces"

export interface DashboardData {
  dataPoints: DataPoint[]
  measurements: Measurement[]
  mode: [Mode, (mode: Mode) => void]
  timeRange: [TimeRange, (timeRange: TimeRange) => void]
  profile: ProfileData
  weightSlope: number
  activeSlope: number
  deltas: Delta[]
}

export const dashboardContext = createContext<DashboardData | undefined>(undefined)