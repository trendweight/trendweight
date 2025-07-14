import { DayOfWeek, LocalDate } from "@js-joda/core";
import { useMemo } from "react";
import { Modes } from "../../core/interfaces";
import type { DashboardData } from "../dashboardContext";
import chartOptionsTemplate from "./chart-options-template";
import { createDiamondsSeries, createDotSeries, createLineSeries, createProjectionSeries, createSinkersSeries, createTrendSeries } from "./create-chart-series";

const toEpoch = (date: LocalDate) => date.toEpochDay() * 86400000;

export const useChartOptions = (data: DashboardData) => {
  // TODO: Add media query hook for narrow screens
  const isNarrow = false;

  const {
    dataPoints,
    mode: [mode],
    timeRange: [timeRange],
    activeSlope,
    profile: { useMetric, goalWeight },
  } = data;

  return useMemo(() => {
    const options = chartOptionsTemplate();

    if (isNarrow && options.chart) {
      options.chart.height = "75%";
    }

    const modeText = Modes[mode];
    const lastMeasurement = dataPoints[dataPoints.length - 1];

    // Convert to percentage for fat percent mode
    const multiplier = mode === "fatpercent" ? 100 : 1;

    const actualData: [number, number | null][] = dataPoints.map((m) => [toEpoch(m.date), m.isInterpolated ? null : m.actual ? m.actual * multiplier : null]);
    const interpolatedData: [number, number | null][] = dataPoints.map((m) => [
      toEpoch(m.date),
      m.isInterpolated ? (m.actual ? m.actual * multiplier : null) : null,
    ]);
    const trendData: [number, number][] = dataPoints.map((m) => [toEpoch(m.date), m.trend * multiplier]);
    const projectionsData: [number, number][] = [
      [toEpoch(lastMeasurement.date), lastMeasurement.trend * multiplier],
      [toEpoch(lastMeasurement.date.plusDays(6)), (lastMeasurement.trend + activeSlope * 6) * multiplier],
    ];

    const actualSinkersData: [number, number | null, number | null, null][] = dataPoints.map((m) => [
      toEpoch(m.date),
      m.isInterpolated ? null : m.actual ? m.actual * multiplier : null,
      m.isInterpolated ? null : m.trend * multiplier,
      null,
    ]);
    const interpolatedSinkersData: [number, number | null, number | null, null][] = dataPoints.map((m) => [
      toEpoch(m.date),
      m.isInterpolated ? (m.actual ? m.actual * multiplier : null) : null,
      m.isInterpolated ? m.trend * multiplier : null,
      null,
    ]);

    if (options.series && options.xAxis && !Array.isArray(options.xAxis)) {
      switch (timeRange) {
        case "4w":
          options.series.push(createTrendSeries(trendData, mode, modeText, isNarrow));
          options.series.push(createDiamondsSeries(actualData, false, isNarrow));
          options.series.push(createDiamondsSeries(interpolatedData, true, isNarrow));
          options.series.push(createSinkersSeries(actualSinkersData, false));
          options.series.push(createSinkersSeries(interpolatedSinkersData, true));
          options.series.push(createProjectionSeries(projectionsData, mode, modeText, isNarrow));
          options.xAxis.tickInterval = 86400000 * 7;
          options.xAxis.range = 86400000 * (28 - 1 + 6);
          options.xAxis.plotBands = [];

          {
            // Weekend shading
            const endDate = lastMeasurement.date.plusWeeks(1);
            let saturday = endDate;
            while (saturday.dayOfWeek() !== DayOfWeek.SATURDAY) {
              saturday = saturday.plusDays(-1);
            }
            saturday = saturday.plusWeeks(-8);
            while (saturday.isBefore(endDate)) {
              options.xAxis.plotBands.push({
                from: toEpoch(saturday) - 43200000, // Friday noon
                to: toEpoch(saturday) + 129600000, // Sunday noon
                color: "rgba(220, 220, 220, 0.2)",
                zIndex: 1,
              });
              saturday = saturday.plusWeeks(1);
            }
          }
          break;

        case "3m":
          options.series.push(createTrendSeries(trendData, mode, modeText, isNarrow));
          if (isNarrow) {
            options.series.push(createLineSeries(actualData, false));
          } else {
            options.series.push(createDotSeries(actualData, false));
            options.series.push(createDotSeries(interpolatedData, true));
            options.series.push(createSinkersSeries(actualSinkersData, false));
            options.series.push(createSinkersSeries(interpolatedSinkersData, true));
          }
          options.series.push(createProjectionSeries(projectionsData, mode, modeText, isNarrow));
          options.xAxis.tickInterval = 86400000 * 7;
          options.xAxis.range = 86400000 * (90 - 1 + 6);
          options.xAxis.plotBands = [];
          break;

        case "6m":
        case "1y":
        case "all":
          options.series = [];
          options.series.push(createTrendSeries(trendData, mode, modeText, isNarrow));
          options.series.push(createLineSeries(actualData, false));
          options.series.push(createProjectionSeries(projectionsData, mode, modeText, isNarrow));
          options.xAxis.range = 86400000 * ((timeRange === "6m" ? 180 : timeRange === "1y" ? 365 : trendData.length) - 1 + 6);
          options.xAxis.plotBands = [];
          break;
      }
    }

    // Goal bands for weight mode
    if (mode === "weight" && goalWeight && options.yAxis && !Array.isArray(options.yAxis)) {
      const goalWidth = useMetric ? 1.134 : 2.5;
      options.yAxis.plotBands = [
        {
          from: goalWeight - goalWidth,
          to: goalWeight + goalWidth,
          color: "rgb(244, 255, 244)",
          label: {
            text: "Goal Range",
            align: "right",
            verticalAlign: "top",
            style: {
              color: "rgb(140, 180, 140)",
              fontSize: "10px",
            },
            x: -4,
            y: 14,
          },
          zIndex: 0,
        },
      ];
      options.yAxis.plotLines = [
        {
          value: goalWeight - goalWidth,
          color: "rgb(100, 150, 100)",
          dashStyle: "ShortDash",
          zIndex: 1,
          width: 1,
        },
        {
          value: goalWeight + goalWidth,
          color: "rgb(100, 150, 100)",
          dashStyle: "ShortDash",
          zIndex: 1,
          width: 1,
        },
      ];
    }

    return options;
  }, [dataPoints, activeSlope, goalWeight, isNarrow, mode, timeRange, useMetric]);
};
