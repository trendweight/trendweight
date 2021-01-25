import { AccessToken } from "./access-token";

export interface OAuthState {
  uid: string;
  reason: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VendorService {
  getAuthorizationUrl: (state: string, callbackUrl: string) => string;
  exchangeAuthorizationCode: (code: string, callbackUrl: string) => Promise<AccessToken>;
  refreshToken: (token: AccessToken) => Promise<AccessToken>;
  getMeasurements: (token: AccessToken) => void;
}
