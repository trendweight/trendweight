import type { DataPoint, Measurement, Mode } from "../../core/interfaces"

export const computeDataPoints = (mode: Mode, measurements?: Measurement[]): DataPoint[] | undefined => {
  if (!measurements) {
    return undefined
  }

  return measurements
    .filter((m) => {
      switch (mode) {
        case "weight":
          return true
        case "fatpercent":
          return m.actualFatPercent != null
        case "fatmass":
          return m.actualFatMass != null
        case "leanmass":
          return m.actualLeanMass != null
        default:
          return false
      }
    })
    .map((m) => {
      let actual: number
      let trend: number
      let isInterpolated: boolean

      switch (mode) {
        case "weight":
          actual = m.actualWeight
          trend = m.trendWeight
          isInterpolated = m.weightIsInterpolated
          break
        case "fatpercent":
          actual = m.actualFatPercent!
          trend = m.trendFatPercent!
          isInterpolated = m.fatIsInterpolated
          break
        case "fatmass":
          actual = m.actualFatMass!
          trend = m.trendFatMass!
          isInterpolated = m.fatIsInterpolated
          break
        case "leanmass":
          actual = m.actualLeanMass!
          trend = m.trendLeanMass!
          isInterpolated = m.fatIsInterpolated
          break
        default:
          throw new Error(`Unknown mode: ${mode}`)
      }

      return {
        date: m.date,
        source: m.source,
        actual,
        trend,
        isInterpolated,
      }
    })
}