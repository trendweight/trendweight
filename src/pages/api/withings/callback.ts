import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { handleErrors } from "~/lib/api/middleware";
import dayjs from "~/lib/core/dayjs";
import { db } from "~/lib/firebase/admin";
import { OAuthState } from "~/lib/vendors/interfaces";
import { getCallbackHostname, withingsService } from "~/lib/vendors/withings";

const getAuthUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;
  const hostname = getCallbackHostname(req);

  if (!process.env.JWT_SIGNING_KEY) {
    throw new ApiError("config/jwt-secret", "JWT signing key not defined", 500);
  }

  let linkDetails: OAuthState;
  try {
    linkDetails = jwt.verify(state as string, process.env.JWT_SIGNING_KEY) as OAuthState;
    if (!linkDetails.uid || !linkDetails.reason) {
      throw new Error();
    }
  } catch {
    throw new ApiError("auth/invalid-state", "invalid state", 500);
  }

  const accessToken = await withingsService.exchangeAuthorizationCode(
    code as string,
    `https://${hostname}/api/withings/callback`
  );

  await db
    .collection("links")
    .doc(linkDetails.uid)
    .set(
      {
        uid: linkDetails.uid,
        withings: {
          updateTime: dayjs().utc().toISOString(),
          updateReason: linkDetails.reason,
          token: accessToken.token,
        },
      },
      { merge: true }
    );

  res.status(200).json({ linkDetails, accessToken });
};

export default handleErrors(getAuthUrl);
