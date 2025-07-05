import { useContext, useMemo, useState } from "react"
import { dashboardContext, type DashboardData } from "./dashboardContext"
import { useSettings, useMeasurementData } from "../api/queries"
import type { Mode, TimeRange } from "../core/interfaces"
import { usePersistedState } from "../hooks/usePersistedState"
import { computeDataPoints } from "./computations/data-points"
import { computeMeasurements } from "./computations/measurements"
import { computeActiveSlope, computeDeltas, computeWeightSlope } from "./computations/stats"

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
  const { data: apiSourceData } = useMeasurementData()
  
  // Transform API data to match core interfaces
  const sourceData = useMemo(() => 
    apiSourceData?.map(data => ({
      source: data.source as "withings" | "fitbit",
      lastUpdate: data.lastUpdate,
      measurements: data.measurements
    })),
    [apiSourceData]
  )

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