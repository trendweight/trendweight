import { LocalDate, LocalDateTime } from "@js-joda/core";

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
  id: string;
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
