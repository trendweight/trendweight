import type { NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { NextApiRequestWithAuth, verifyJWT } from "~/lib/api/middleware";
import { getCallbackHostname, withingsClient } from "~/lib/data-sources/withings";

const link = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.userId) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }

  const hostname = getCallbackHostname(req);
  const authorizationUrl = withingsClient.authorizeURL({
    redirect_uri: `https://${hostname}/api/withings/callback`,
    scope: "user.metrics",
    state: req.userId,
  });

  res.status(200).json({ authorizationUrl });
};

export default verifyJWT(link);
