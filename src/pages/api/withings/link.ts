import jwt from "jsonwebtoken";
import type { NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { NextApiRequestWithAuth, verifyJWT } from "~/lib/api/middleware";
import { OAuthState } from "~/lib/core/interfaces";
import { getCallbackHostname, withingsClient } from "~/lib/data-sources/withings";

const link = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.userId) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }

  if (!process.env.JWT_SIGNING_KEY) {
    throw new ApiError("config/jwt-secret", "JWT secret not defined", 500);
  }

  const state: OAuthState = { uid: req.userId, reason: "link" };

  const hostname = getCallbackHostname(req);
  const authorizationUrl = withingsClient.authorizeURL({
    redirect_uri: `https://${hostname}/api/withings/callback`,
    scope: "user.metrics",
    state: jwt.sign(state, process.env.JWT_SIGNING_KEY, { expiresIn: "1h" }),
  });

  res.status(200).json({ authorizationUrl, state });
};

export default verifyJWT(link);
