import { DayOfWeek, LocalDate } from "@js-joda/core";
import { useMemo } from "react";
import { Modes } from "../../core/interfaces";
import { useIsMobile } from "../../hooks/useMediaQuery";
import type { DashboardData } from "../dashboardContext";
import chartOptionsTemplate from "./chart-options-template";
import { createDiamondsSeries, createDotSeries, createLineSeries, createProjectionSeries, createSinkersSeries, createTrendSeries } from "./create-chart-series";

const toEpoch = (date: LocalDate) => date.toEpochDay() * 86400000;

export const useChartOptions = (data: DashboardData) => {
  const isNarrow = useIsMobile();

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

        case "explore": {
          // Start with 6-month view using dots (180 days)
          options.series = [];
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

          // Reduce bottom spacing in explore mode
          if (options.chart) {
            options.chart.spacingBottom = 10;
          }

          // Hide legend in explore mode
          if (options.legend) {
            options.legend.enabled = false;
          }

          // Calculate initial range (last 6 months)
          const lastDate = lastMeasurement.date;
          const sixMonthsAgo = lastDate.minusMonths(6);
          const initialMin = toEpoch(sixMonthsAgo);
          const initialMax = toEpoch(lastDate.plusDays(6));

          // Set initial visible range to last 6 months
          options.xAxis.min = initialMin;
          options.xAxis.max = initialMax;
          options.xAxis.range = undefined; // Let Highcharts calculate from min/max
          options.xAxis.plotBands = [];

          // Enable navigator for explore mode
          options.navigator = {
            enabled: true,
            height: 30,
            margin: 10,
            series: {
              type: "line",
              color: "#4a5568",
              lineWidth: 1,
              fillOpacity: 0.1,
            },
            xAxis: {
              labels: {
                style: {
                  color: "#718096",
                  fontSize: "11px",
                  textOutline: "none",
                },
              },
            },
            handles: {
              backgroundColor: "#e2e8f0",
              borderColor: "#a0aec0",
            },
            outlineColor: "#cbd5e0",
            outlineWidth: 1,
            maskFill: "rgba(226, 232, 240, 0.3)",
          };

          // Enable live redraw while dragging
          options.scrollbar = {
            liveRedraw: true,
          };

          // Add afterSetExtremes handler to dynamically update series based on visible range
          options.xAxis.events = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            afterSetExtremes: function (this: any, e: any) {
              const chart = this.chart;
              // Use actual axis extremes if event data is missing
              const min = e.min !== undefined ? e.min : this.min;
              const max = e.max !== undefined ? e.max : this.max;
              const rangeDays = (max - min) / 86400000;

              // Clear all series except the trend line (series 0)
              while (chart.series.length > 1) {
                chart.series[chart.series.length - 1].remove(false);
              }

              // Add series based on range
              if (rangeDays <= 90) {
                // 90 days or less - diamonds view
                chart.addSeries(createDiamondsSeries(actualData, false, isNarrow), false);
                chart.addSeries(createDiamondsSeries(interpolatedData, true, isNarrow), false);
                chart.addSeries(createSinkersSeries(actualSinkersData, false), false);
                chart.addSeries(createSinkersSeries(interpolatedSinkersData, true), false);
              } else if (rangeDays <= 190) {
                // 91-190 days - dots view
                if (isNarrow) {
                  chart.addSeries(createLineSeries(actualData, false), false);
                } else {
                  chart.addSeries(createDotSeries(actualData, false), false);
                  chart.addSeries(createDotSeries(interpolatedData, true), false);
                  chart.addSeries(createSinkersSeries(actualSinkersData, false), false);
                  chart.addSeries(createSinkersSeries(interpolatedSinkersData, true), false);
                }
              } else {
                // More than 190 days - line view
                chart.addSeries(createLineSeries(actualData, false), false);
              }

              // Re-add projection series
              chart.addSeries(createProjectionSeries(projectionsData, mode, modeText, isNarrow), false);

              // Redraw once after all series changes
              chart.redraw();
            },
          };
          break;
        }
      }
    }

    // Set minimum y-axis range based on mode and units
    if (options.yAxis && !Array.isArray(options.yAxis)) {
      if (mode === "fatpercent") {
        options.yAxis.minRange = 5;
      } else if (mode === "weight") {
        options.yAxis.minRange = useMetric ? 3 : 5;
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
