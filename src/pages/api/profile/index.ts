import { NextApiResponse } from "next";
import { ApiError } from "../../../modules/api/exceptions";
import { NextApiRequestWithAuth, withMiddleware } from "../../../modules/api/middleware";
import { getProfileByUserId } from "../../../modules/data/settings";

const getProfile = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  const uid = req.userId;

  if (!uid) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }

  const profile = await getProfileByUserId(uid);

  res.status(200).json(profile);
};

export default withMiddleware(getProfile, true);
