import type { NextApiRequest, NextApiResponse } from "next";
import { auth, db } from "~/lib/firebase-admin";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Authentication token missing" });
      return;
    }
    const { uid } = await auth.verifyIdToken(token);
    const user = await (await db.collection("users").doc(uid).get()).data();
    res.status(200).json({ user });
  } catch (error) {
    if (error.code.startsWith("auth/")) {
      res.status(403).json({ error });
    } else {
      res.status(500).json({ error });
    }
  }
};
