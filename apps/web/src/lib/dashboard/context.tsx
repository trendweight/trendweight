import { createContext, useContext, useMemo, useState } from "react"
import type { FC, PropsWithChildren } from "react"
import { useSettings, useMeasurementData } from "../api/queries"
import type { DataPoint, Delta, Measurement, Mode, ProfileData, TimeRange } from "../core/interfaces"
import { usePersistedState } from "../hooks/usePersistedState"
import { computeDataPoints } from "./computations/data-points"
import { computeMeasurements } from "./computations/measurements"
import { computeActiveSlope, computeDeltas, computeWeightSlope } from "./computations/stats"

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

const dashboardContext = createContext<DashboardData | undefined>(undefined)

export const DashboardProvider: FC<PropsWithChildren<{ data: DashboardData }>> = ({ data, children }) => (
  <dashboardContext.Provider value={data}>{children}</dashboardContext.Provider>
)

export const useDashboardData = (): DashboardData => {
  const data = useContext(dashboardContext)
  if (!data) {
    throw new Error("Called useDashboardData() when the provider is not present.")
  }
  return data
}

export const useComputeDashboardData = () => {
  const [mode, setMode] = useState<Mode>("weight")
  const [timeRange, setTimeRange] = usePersistedState<TimeRange>("timeRange", "4w")

  // Get profile data from settings endpoint
  const { data: settingsData } = useSettings()
  const profile = useMemo(() => 
    settingsData ? {
      firstName: settingsData.firstName,
      timezone: settingsData.timezone,
      goalStart: settingsData.goalStart,
      goalWeight: settingsData.goalWeight,
      plannedPoundsPerWeek: settingsData.plannedPoundsPerWeek,
      dayStartOffset: settingsData.dayStartOffset,
      useMetric: settingsData.useMetric,
      showCalories: settingsData.showCalories,
      sharingToken: settingsData.sharingToken,
    } : undefined,
    [settingsData]
  )

  // Get measurement data
  const { data: sourceData } = useMeasurementData()

  // Compute derived data
  const measurements = useMemo(() => 
    computeMeasurements(sourceData, profile), 
    [profile, sourceData]
  )
  
  const dataPoints = useMemo(() => 
    computeDataPoints(mode, measurements), 
    [measurements, mode]
  )
  
  const weightSlope = useMemo(() => 
    computeWeightSlope(measurements), 
    [measurements]
  )
  
  const activeSlope = useMemo(() => 
    computeActiveSlope(mode, dataPoints), 
    [mode, dataPoints]
  )
  
  const deltas = useMemo(() => 
    computeDeltas(mode, dataPoints), 
    [mode, dataPoints]
  )

  if (!measurements || !dataPoints || !profile) {
    return undefined
  }

  const data: DashboardData = {
    dataPoints,
    measurements,
    profile,
    mode: [mode, setMode],
    timeRange: [timeRange, setTimeRange],
    weightSlope,
    activeSlope,
    deltas,
  }

  return data
}