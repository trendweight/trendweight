import { NextApiRequest } from "next";
import { AuthorizationCode, ModuleOptions } from "simple-oauth2";

const config: ModuleOptions = {
  client: {
    id: process.env.WITHINGS_CLIENT_ID || "",
    secret: process.env.WITHINGS_CLIENT_SECRET || "",
  },
  auth: {
    authorizeHost: "https://account.withings.com",
    authorizePath: "/oauth2_user/authorize2",
    tokenHost: "https://wbsapi.withings.net",
    tokenPath: "/v2/oauth2",
  },
  options: {
    authorizationMethod: "body",
  },
};

export const getCallbackHostname = (req: NextApiRequest) => {
  let hostname = req.headers.host || "trendweight.io";

  // Withings doesn't allow use of localhost for the callback, so we use dev.trendweight.io
  // which doesn't exist.  We then edit the URL in the browser when it fails to resolve.
  if (hostname.startsWith("localhost")) {
    hostname = "dev.trendweight.io";
  }
  return hostname;
};

export const withingsClient = new AuthorizationCode(config);
