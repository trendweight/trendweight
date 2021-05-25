import type { LocalDate, LocalDateTime } from "@js-joda/core";

export interface RawMeasurement {
  timestamp: number;
  weight: number;
  fatRatio?: number;
}

export type Sources = "withings" | "fitbit";

export interface SourceData {
  source: Sources;
  lastUpdate: string;
  measurements?: RawMeasurement[];
}

export interface SourceMeasurement {
  date: LocalDate;
  timestamp: LocalDateTime;
  source: string;
  weight: number;
  fatRatio?: number;
  weightIsInterpolated?: boolean;
  fatRatioIsInterpolated?: boolean;
}

export interface AccessToken {
  userid: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
  expires_at?: string;
}

export interface VendorLink {
  token: AccessToken;
  updateReason: string;
  updateTime: string;
}

export interface Links {
  uid: string;
  withings?: VendorLink;
  fitbit?: VendorLink;
}

export interface Profile {
  firstName: string;
  timezone: string;
  goalStart?: LocalDate;
  goalWeight?: number;
  plannedPoundsPerWeek?: number;
  dayStartOffset?: number;
  useMetric: boolean;
  showCalories?: boolean;
  sharingToken?: string;
}

export interface Settings extends Profile {
  uid: string;
  email: string;
}

export enum Modes {
  weight = "Weight",
  fatpercent = "Fat %",
  fatmass = "Fat Mass",
  leanmass = "Lean Mass",
}

export type Mode = keyof typeof Modes;

export enum TimeRanges {
  "4w" = "4 weeks",
  "3m" = "3 months",
  "6m" = "6 months",
  "1y" = "1 year",
  all = "All Time",
}

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

export interface Delta {
  description: string;
  period: number;
  delta: number;
}
