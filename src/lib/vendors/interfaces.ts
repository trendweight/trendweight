import { AccessToken, SourceMeasurement } from "../data/interfaces";

export interface OAuthState {
  uid: string;
  reason: string;
}

export interface GetMeasurementsResult {
  measurements: SourceMeasurement[];
  more: boolean;
  offset?: unknown;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VendorService {
  getAuthorizationUrl: (state: string, callbackUrl: string) => string;
  exchangeAuthorizationCode: (code: string, callbackUrl: string) => Promise<AccessToken>;
  refreshToken: (token: AccessToken) => Promise<AccessToken>;
  getMeasurements: (token: AccessToken, start: unknown, offset?: unknown) => Promise<GetMeasurementsResult>;
}
