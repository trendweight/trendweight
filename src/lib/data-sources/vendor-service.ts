/* eslint-disable @typescript-eslint/no-explicit-any */
export interface VendorService {
  getAuthorizationUrl: (state: string, callbackUrl: string) => string;
  exchangeAuthorizationCode: (code: string, callbackUrl: string) => Promise<any>;
  refreshToken: (token: string) => Promise<string>;
  getMeasurements: (token: string) => void;
}
