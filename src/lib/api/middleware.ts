import { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "~/lib/api/exceptions";
import "~/lib/core/time";
import { auth } from "~/lib/firebase/admin";

export type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
export interface NextApiRequestWithAuth extends NextApiRequest {
  userId?: string;
}

export const withMiddleware = (handler: ApiHandler, requireAuth: boolean) => {
  let wrappedHandler = handler;
  if (requireAuth) {
    wrappedHandler = withVerifyJWT(wrappedHandler);
  }
  return withHandleErrors(wrappedHandler);
};

const withHandleErrors = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error: any) {
      const { code, message, status } = error as ApiError;
      let stack;
      if (process.env.NODE_ENV !== "production") {
        stack = error.stack;
      }
      res.status(status || 500).json({ error: { code, message, stack } });
    }
  };
};

const withVerifyJWT = (handler: ApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError("auth/missing-token", "JWT is required", 401);
    }
    try {
      const { uid } = await auth.verifyIdToken(token);
      (req as NextApiRequestWithAuth).userId = uid;
    } catch (error: any) {
      throw new ApiError(error.code, error.message, 403);
    }
    return await handler(req, res);
  };
};
