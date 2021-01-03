import type { NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { NextApiRequestWithAuth, verifyJWT } from "~/lib/api/middleware";
import { db } from "~/lib/firebase/admin";

const settings = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.userId) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }
  const user = await (await db.collection("users").doc(req.userId).get()).data();
  res.status(200).json({ user, timestamp: new Date() });
};

export default verifyJWT(settings);
