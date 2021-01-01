import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "~/lib/firebase-admin";
import { ApiError } from "./exceptions";

export type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export const handleErrors = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      const { code, message, status } = error;
      res.status(status || 500).json({ error: { code, message } });
    }
  };
};

export type AuthenticatedHandler = (req: NextApiRequestWithAuth, res: NextApiResponse) => Promise<void>;
export interface NextApiRequestWithAuth extends NextApiRequest {
  userId?: string;
}

export const verifyJWT = (handler: AuthenticatedHandler) => {
  return handleErrors(async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError("auth/missing-token", "JWT is required", 401);
    }
    try {
      const { uid } = await auth.verifyIdToken(token);
      (req as NextApiRequestWithAuth).userId = uid;
    } catch (error) {
      throw new ApiError(error.code, error.message, 403);
    }
    return await handler(req, res);
  });
};
