import type { NextApiResponse } from "next";
import { ApiError } from "~/lib/exceptions";
import { db } from "~/lib/firebase-admin";
import { NextApiRequestWithAuth, verifyJWT } from "~/lib/middleware";

const whoami = async (req: NextApiRequestWithAuth, res: NextApiResponse) => {
  if (!req.userId) {
    throw new ApiError("auth/unknown-user", "Unknown User");
  }
  const user = await (await db.collection("users").doc(req.userId).get()).data();
  res.status(200).json({ user, timestamp: new Date() });
};

export default verifyJWT(whoami);
