import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import { withMiddleware } from "~/lib/api/middleware";
import { Profile } from "~/lib/data/interfaces";

const settings = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id;

  if (Array.isArray(id)) {
    throw new ApiError("params/invalid", "ID parameter must be a single string");
  }

  const sampleProfile: Profile = {
    id,
    firstName: "Erv",
    timezone: "America/Chicago",
    useMetric: false,
    dayStartOffset: 3,
  };

  res.status(200).json(sampleProfile);
};

export default withMiddleware(settings, false);