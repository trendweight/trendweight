import type { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware } from "~/lib/api/middleware";

const ping = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ now: new Date() });
};

export default withMiddleware(ping, false);
