export interface SourceMeasurement {
  id: string;
  timestamp: number;
  weight: number;
  fatRatio?: number;
}

export interface SourceData {
  lastUpdate: string;
  measurements: SourceMeasurement[];
}

export interface MeasurementData {
  withings?: SourceData;
  fitbit?: SourceData;
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
