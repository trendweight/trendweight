import type { NextApiResponse } from "next";
import { ApiError } from "../../modules/api/exceptions";
import { NextApiRequestWithAuth, withMiddleware } from "../../modules/api/middleware";
import { db } from "../../modules/data/firebase/admin";

const settings = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.userId) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }
  const user = await (await db.collection("users").doc(req.userId).get()).data();
  res.status(200).json({ user, timestamp: new Date() });
};

export default withMiddleware(settings, true);
