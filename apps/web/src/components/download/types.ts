import { LocalDate } from "@js-joda/core";

export interface ScaleReading {
  date: LocalDate;
  time?: string;
  weight?: number;
  trend?: number;
  fatRatio?: number;
  fatTrend?: number;
  provider?: string;
  weightIsInterpolated?: boolean;
  fatIsInterpolated?: boolean;
}

export type ViewType = "computed" | string;
