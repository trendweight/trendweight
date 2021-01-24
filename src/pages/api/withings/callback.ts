import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { handleErrors } from "~/lib/api/middleware";
import { OAuthState } from "~/lib/core/interfaces";
import { getCallbackHostname, withingsService } from "~/lib/data-sources/withings";

const getAuthUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;
  const hostname = getCallbackHostname(req);

  if (!process.env.JWT_SIGNING_KEY) {
    throw new ApiError("config/jwt-secret", "JWT signing key not defined", 500);
  }

  let parsed: OAuthState;
  try {
    parsed = jwt.verify(state as string, process.env.JWT_SIGNING_KEY) as OAuthState;
    if (!parsed.uid || !parsed.reason) {
      throw new Error();
    }
  } catch {
    throw new ApiError("auth/invalid-state", "invalid state", 500);
  }

  const accessToken = await withingsService.exchangeAuthorizationCode(
    code as string,
    `https://${hostname}/api/withings/callback`
  );

  res.status(200).json({ accessToken, parsed });
};

export default handleErrors(getAuthUrl);
