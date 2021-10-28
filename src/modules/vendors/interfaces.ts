import { AccessToken, RawMeasurement } from "../shared/interfaces";

export interface OAuthState {
  uid: string;
  reason: string;
}

export interface GetMeasurementsResult {
  measurements: RawMeasurement[];
  more: boolean;
  offset?: unknown;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VendorService {
  getAuthorizationUrl: (state: string, callbackUrl: string) => string;
  exchangeAuthorizationCode: (code: string, callbackUrl: string) => Promise<AccessToken>;
  refreshToken: (token: AccessToken) => Promise<AccessToken>;
  getMeasurements: (token: AccessToken, metric: boolean, start: unknown, offset?: unknown) => Promise<GetMeasurementsResult>;
}
