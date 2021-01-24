import axios from "axios";
import { NextApiRequest } from "next";
import qs from "qs";
import { VendorService } from "./vendor-service";

const _authorizeHost = "https://account.withings.com";
const _authorizePath = "/oauth2_user/authorize2";
const _tokenHost = "https://wbsapi.withings.net";
const _tokenPath = "/v2/oauth2";

export const getCallbackHostname = (req: NextApiRequest) => {
  let hostname = req.headers.host || "trendweight.io";

  // Withings doesn't allow use of localhost for the callback, so we use dev.trendweight.io
  // which doesn't exist.  We then edit the URL in the browser when it fails to resolve.
  if (hostname.startsWith("localhost")) {
    hostname = "dev.trendweight.io";
  }
  return hostname;
};

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
    // const data = new FormData();
    // data.append("grant_type", "authorization_code");
    // data.append("client_id", this.clientId);
    // data.append("client_secret", this.clientSecret);
    // data.append("code", code);
    // data.append("redirect_url", callbackUrl);

    const data = {
      action: "requesttoken",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: callbackUrl,
    };

    console.log(data);

    const result = await axios.post("https://wbsapi.withings.net/v2/oauth2", qs.stringify(data));

    //    console.log(result);

    return result.data;
  }

  async refreshToken(token: string) {
    return token;
  }

  getMeasurements(_token: string) {
    return;
  }
}

export const withingsService = new WithingsService(
  process.env.WITHINGS_CLIENT_ID || "",
  process.env.WITHINGS_CLIENT_SECRET || ""
) as VendorService;
