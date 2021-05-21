import { LocalDate } from "@js-joda/core";

export type Mode = "weight" | "fatpercent" | "fatmass" | "leanmass";
export type TimeRange = "4w" | "3m" | "6m" | "1y" | "all";

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
