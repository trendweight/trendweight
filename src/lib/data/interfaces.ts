export interface SourceMeasurement {
  timestamp: number;
  weight: number;
  fatRatio?: number;
}

export type Sources = "withings" | "fitbit";

export interface SourceData {
  source: Sources;
  lastUpdate: string;
  measurements?: SourceMeasurement[];
}

export interface Measurement {
  date: string;
  timestamp: string;
  weight: number;
  fatRatio?: number;
  interpolated: boolean;
  source: string;
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
