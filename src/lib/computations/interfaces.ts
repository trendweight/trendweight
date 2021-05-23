import { LocalDate } from "@js-joda/core";

export const Modes = {
  weight: "Weight",
  fatpercent: "Fat %",
  fatmass: "Fat Mass",
  leanmass: "Lean Mass",
};

export const TimeRanges = {
  "4w": "4 weeks",
  "3m": "3 months",
  "6m": "6 months",
  "1y": "1 year",
  all: "All Time",
};

export type Mode = keyof typeof Modes;
export type TimeRange = keyof typeof TimeRanges;

export interface Measurement {
  date: LocalDate;
  source: string;
  actualWeight: number;
  actualFatMass?: number;
  actualFatPercent?: number;
  actualLeanMass?: number;
  trendWeight: number;
  trendFatMass?: number;
  trendFatPercent?: number;
  trendLeanMass?: number;
  weightIsInterpolated: boolean;
  fatIsInterpolated: boolean;
}

export interface DataPoint {
  date: LocalDate;
  source: string;
  actual: number;
  trend: number;
  isInterpolated: boolean;
}
