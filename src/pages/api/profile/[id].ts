import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "../../../modules/api/exceptions";
import { withMiddleware } from "../../../modules/api/middleware";
import { ProfileData } from "../../../modules/core/interfaces";

const settings = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id;

  if (Array.isArray(id)) {
    throw new ApiError("params/invalid", "ID parameter must be a single string");
  }

  const sampleProfile: ProfileData = {
    firstName: "Erv",
    timezone: "America/Chicago",
    useMetric: false,
    dayStartOffset: 3,
    goalWeight: 100,
    plannedPoundsPerWeek: 0,
    showCalories: true,
  };

  res.status(200).json(sampleProfile);
};

export default withMiddleware(settings, false);
