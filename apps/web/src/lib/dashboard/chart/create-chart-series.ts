import type { SeriesHlcOptions, SeriesLineOptions } from "highcharts/highstock"
import type { Mode } from "../../core/interfaces"

const colors = {
  weight: "#8b0000",
  fatpercent: "#660066",
  fatmass: "#336600",
  leanmass: "#000066",
}

export const createTrendSeries = (
  data: [number, number][],
  mode: Mode,
  modeText: string,
  isNarrow: boolean
): SeriesLineOptions => ({
  type: "line",
  id: "trend",
  name: `${modeText} Trend`,
  data,
  color: colors[mode],
  lineWidth: isNarrow ? 1.5 : 2,
  zIndex: 5,
  legendIndex: 1,
  marker: {
    enabled: false,
  },
  events: {
    legendItemClick: () => false,
  },
})

export const createDiamondsSeries = (
  data: [number, number | null][],
  isInterpolated: boolean,
  isNarrow: boolean
): SeriesLineOptions => {
  const series = createLineSeries(data, isInterpolated)
  series.connectNulls = false
  series.zIndex = 6
  series.lineWidth = 0
  series.marker = {
    enabled: true,
    symbol: "diamond",
    lineColor: isInterpolated ? "#e2e2e2" : "#333333",
    fillColor: "#ffffff",
    lineWidth: 1,
    radius: isNarrow ? 3 : 4.5,
  }
  return series
}

export const createDotSeries = (
  data: [number, number | null][],
  isInterpolated: boolean
): SeriesLineOptions => {
  const series = createLineSeries(data, isInterpolated)
  series.connectNulls = false
  series.zIndex = 4
  series.lineWidth = 0
  series.marker = {
    enabled: true,
    symbol: "circle",
    lineColor: isInterpolated ? "#e2e2e2" : "#333333",
    fillColor: isInterpolated ? "#e2e2e2" : "#333333",
    lineWidth: 0,
    radius: 2,
  }
  return series
}

export const createLineSeries = (
  data: [number, number | null][],
  isInterpolated: boolean
): SeriesLineOptions => ({
  type: "line",
  id: isInterpolated ? "estimated" : "actual",
  name: isInterpolated ? "Estimated Reading" : "Scale Reading",
  lineWidth: 1,
  color: "#aaaaaa",
  legendIndex: 0,
  zIndex: 3,
  connectNulls: true,
  showInLegend: !isInterpolated,
  marker: {
    enabled: false,
  },
  data,
  events: {
    legendItemClick: () => false,
  },
})

export const createProjectionSeries = (
  data: [number, number][],
  mode: Mode,
  modeText: string,
  isNarrow: boolean
): SeriesLineOptions => ({
  type: "line",
  id: "projection",
  name: `Projected ${modeText}`,
  data,
  color: colors[mode],
  lineWidth: isNarrow ? 1.5 : 2,
  dashStyle: "ShortDot",
  enableMouseTracking: false,
  zIndex: 5,
  legendIndex: 2,
  events: {
    legendItemClick: () => false,
  },
})

export const createSinkersSeries = (
  data: [number, number | null, number | null, null][],
  isInterpolated: boolean
): SeriesHlcOptions => ({
  type: "hlc",
  id: isInterpolated ? "estimated-sinkers" : "actual-sinkers",
  name: isInterpolated ? "Estimated Sinkers" : "Actual Sinkers",
  showInLegend: false,
  zIndex: 2,
  color: isInterpolated ? "#e2e2e2" : "#999999",
  pointValKey: "high",
  data,
})