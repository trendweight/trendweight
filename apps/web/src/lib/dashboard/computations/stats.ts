import type { DataPoint, Delta, Measurement, Mode } from "../../core/interfaces"

export const computeDeltas = (_mode: Mode, dataPoints?: DataPoint[]): Delta[] => {
  if (!dataPoints || dataPoints.length === 0) {
    return []
  }

  const deltas: Delta[] = []
  const points = [...dataPoints].reverse()
  let index: number

  // Find the measurements for various time periods
  const today = points[0].date
  const targetDates = [
    { description: "Since yesterday", period: 1, date: today.minusDays(1) },
    { description: "7-Day", period: 7, date: today.minusDays(7) },
    { description: "30-Day", period: 30, date: today.minusDays(30) },
    { description: "90-Day", period: 90, date: today.minusDays(90) },
  ]

  for (const target of targetDates) {
    index = points.findIndex((m) => m.date.equals(target.date))
    if (index !== -1) {
      deltas.push({
        description: target.description,
        period: target.period,
        delta: points[0].trend - points[index].trend,
      })
    }
  }

  return deltas
}

export const computeWeightSlope = (measurements?: Measurement[]): number => {
  if (!measurements || measurements.length === 0) {
    return 0
  }

  const values = measurements
    .slice(-14)
    .filter((m) => m.trendWeight != null)
    .map((m, index) => ({ x: index, y: m.trendWeight }))

  if (values.length < 2) {
    return 0
  }

  return calculateSlope(values)
}

export const computeActiveSlope = (_mode: Mode, dataPoints?: DataPoint[]): number => {
  if (!dataPoints || dataPoints.length === 0) {
    return 0
  }

  const values = dataPoints
    .slice(-14)
    .map((m, index) => ({ x: index, y: m.trend }))

  if (values.length < 2) {
    return 0
  }

  return calculateSlope(values)
}

// Helper function to calculate slope using least squares regression
function calculateSlope(points: { x: number; y: number }[]): number {
  const n = points.length
  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumX2 = 0

  for (const point of points) {
    sumX += point.x
    sumY += point.y
    sumXY += point.x * point.y
    sumX2 += point.x * point.x
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  return slope
}