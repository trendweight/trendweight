import jwt from "jsonwebtoken";
import type { NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { NextApiRequestWithAuth, withMiddleware } from "~/lib/api/middleware";
import { OAuthState } from "~/lib/vendors/interfaces";
import { getCallbackHostname, withingsService } from "~/lib/vendors/withings";

const link = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.userId) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }

  if (!process.env.JWT_SIGNING_KEY) {
    throw new ApiError("config/jwt-secret", "JWT secret not defined", 500);
  }

  const state: OAuthState = { uid: req.userId, reason: "link" };

  const hostname = getCallbackHostname(req);
  const authorizationUrl = withingsService.getAuthorizationUrl(
    jwt.sign(state, process.env.JWT_SIGNING_KEY, { expiresIn: "1h" }),
    `https://${hostname}/api/withings/callback`
  );
  res.status(200).json({ authorizationUrl, state });
};

export default withMiddleware(link, true);
