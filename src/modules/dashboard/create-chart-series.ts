import { SeriesHlcOptions, SeriesLineOptions } from "highcharts/highstock";
import { Mode } from "../core/interfaces";

const colors = {
  weight: "#8b0000",
  fatpercent: "#660066",
  fatmass: "#336600",
  leanmass: "#000066",
};

export const createLineSeries = (data: (number | null)[][], interpolated: boolean): SeriesLineOptions => {
  return {
    type: "line",
    id: interpolated ? "estimated" : "actual",
    name: interpolated ? "Estimated Reading" : "Scale Reading",
    lineWidth: 1,
    color: "#aaaaaa",
    legendIndex: 0,
    zIndex: 3,
    connectNulls: true,
    showInLegend: !interpolated,
    marker: {
      enabled: false,
    },
    data: data,
  };
};

export const createDiamondsSeries = (data: (number | null)[][], interpolated: boolean, isMobile: boolean) => {
  const series: SeriesLineOptions = createLineSeries(data, interpolated);
  series.connectNulls = false;
  series.zIndex = 6;
  series.lineWidth = 0;
  series.marker = {
    enabled: true,
    symbol: "diamond",
    lineColor: interpolated ? "#e2e2e2" : "#333333",
    fillColor: "#ffffff",
    lineWidth: 1,
    radius: isMobile ? 3 : 4.5,
  };

  return series;
};

export const createDotSeries = (data: (number | null)[][], interpolated: boolean) => {
  const series: SeriesLineOptions = createLineSeries(data, interpolated);
  series.connectNulls = false;
  series.zIndex = 4;
  series.lineWidth = 0;
  series.marker = {
    enabled: true,
    symbol: "circle",
    lineColor: interpolated ? "#e2e2e2" : "#333333",
    fillColor: interpolated ? "#e2e2e2" : "#333333",
    lineWidth: 0,
    radius: 2,
  };

  return series;
};

export const createSinkersSeries = (data: (number | null)[][], interpolated: boolean) => {
  const series: SeriesHlcOptions = {
    type: "hlc",
    id: interpolated ? "estimated-sinkers" : "actual-sinkers",
    name: interpolated ? "Estimated Sinkers" : "Actual Sinkers",
    showInLegend: false,
    zIndex: 2,
    color: interpolated ? "#e2e2e2" : "#999999",
    pointValKey: "high",
    data: data,
  };
  return series;
};

export const createTrendSeries = (data: number[][], mode: Mode, modeText: string, isMoble: boolean) => {
  const series: SeriesLineOptions = {
    type: "line",
    id: "trend",
    name: `${modeText} Trend`,
    color: colors[mode],
    lineWidth: isMoble ? 1.5 : 2,
    zIndex: 5,
    legendIndex: 1,
    data: data,
  };
  return series;
};

export const createProjectionSeries = (data: number[][], mode: Mode, modeText: string, isMobile: boolean) => {
  const series: SeriesLineOptions = {
    type: "line",
    id: "projection",
    name: `Projected ${modeText}`,
    color: colors[mode],
    lineWidth: isMobile ? 1.5 : 2,
    dashStyle: "ShortDot",
    enableMouseTracking: false,
    zIndex: 5,
    legendIndex: 2,
    data: data,
  };
  return series;
};
