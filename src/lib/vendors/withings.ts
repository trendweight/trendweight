import axios from "axios";
import { NextApiRequest } from "next";
import qs from "qs";
import { ApiError } from "../api/exceptions";
import { AccessToken } from "./access-token";
import { VendorService } from "./interfaces";

export const getCallbackHostname = (req: NextApiRequest) => {
  let hostname = req.headers.host || "trendweight.io";

  // Withings doesn't allow use of localhost for the callback, so we use dev.trendweight.io
  // which doesn't exist.  That way when Withings redirect, the browser shows an error page and
  // we can edit the URL in the browser to replace dev.trendweight.io with localhost:3000.
  if (hostname.startsWith("localhost")) {
    hostname = "dev.trendweight.io";
  }
  return hostname;
};

interface WithingsResponse {
  status: number;
  body: unknown;
}

class WithingsService implements VendorService {
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  getAuthorizationUrl(state: string, callbackUrl: string) {
    const url = new URL("https://account.withings.com/oauth2_user/authorize2");
    url.searchParams.append("client_id", this.clientId);
    url.searchParams.append("response_type", "code");
    url.searchParams.append("scope", "user.metrics");
    url.searchParams.append("state", state);
    url.searchParams.append("redirect_uri", callbackUrl);
    return url.href;
  }

  async exchangeAuthorizationCode(code: string, callbackUrl: string) {
    const params = {
      action: "requesttoken",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: callbackUrl,
    };

    const result = await axios.post<WithingsResponse>("https://wbsapi.withings.net/v2/oauth2", qs.stringify(params));

    if (result.status !== 200) {
      throw new ApiError("withings/http-error", `${result.status}: ${result.statusText}`);
    }

    if (result.data.status !== 0) {
      throw new ApiError("withings/api-error", `Withings API Error: ${result.data.status}`);
    }

    return new AccessToken(result.data.body);
  }

  async refreshToken(token: AccessToken) {
    return token;
  }

  getMeasurements(_token: AccessToken) {
    return;
  }
}

export const withingsService = new WithingsService(
  process.env.WITHINGS_CLIENT_ID || "",
  process.env.WITHINGS_CLIENT_SECRET || ""
) as VendorService;
