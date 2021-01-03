import type { NextApiRequest, NextApiResponse } from "next";
import { handleErrors } from "~/lib/api/middleware";
import { getCallbackHostname, withingsClient } from "~/lib/data-sources/withings";

const getAuthUrl = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code, state } = req.query;
  const hostname = getCallbackHostname(req);

  const tokenParams = {
    action: "requesttoken",
    code: code.toString(),
    redirect_uri: `https://${hostname}/api/withings/callback`,
  };

  console.log(tokenParams);

  const accessToken = await withingsClient.getToken(tokenParams);

  res.status(200).json({ accessToken });
};

export default handleErrors(getAuthUrl);
