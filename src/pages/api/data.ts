import { NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { NextApiRequestWithAuth, withMiddleware } from "~/lib/api/middleware";
import { refreshAndGetMeasurementData } from "~/lib/vendors/refresh-data";

const getData = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const uid = req.userId;

  if (!uid) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }

  const data = await refreshAndGetMeasurementData(uid);

  res.status(200).json(data);
};

export default withMiddleware(getData, true);
