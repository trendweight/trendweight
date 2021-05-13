import { NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { NextApiRequestWithAuth, withMiddleware } from "~/lib/api/middleware";
import { processSourceData } from "~/lib/data/analysis";
import { refreshAndGetSourceData } from "~/lib/vendors/refresh-data";

const getData = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const uid = req.userId;

  if (!uid) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }

  const sourceData = await refreshAndGetSourceData(uid);
  const measurements = processSourceData(sourceData);

  res.status(200).json(measurements);
};

export default withMiddleware(getData, true);
