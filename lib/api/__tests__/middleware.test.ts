import { NextApiRequest, NextApiResponse } from "next";
import { withMiddleware, NextApiRequestWithAuth } from "../middleware";
import { ApiError } from "../exceptions";
import { auth } from "../../data/firebase/admin";

// Mock Firebase admin auth
jest.mock("../../data/firebase/admin", () => ({
  auth: {
    verifyIdToken: jest.fn(),
  },
}));

describe("API middleware", () => {
  let req: Partial<NextApiRequestWithAuth>;
  let res: Partial<NextApiResponse>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();

    req = {
      headers: {},
    };

    res = {
      json: mockJson,
      status: mockStatus,
    };

    jest.clearAllMocks();
  });

  describe("withMiddleware", () => {
    describe("error handling", () => {
      it("catches and formats ApiError correctly", async () => {
        const handler = jest.fn().mockRejectedValue(new ApiError("test/error", "Test error message", 400));

        const wrapped = withMiddleware(handler, false);
        await wrapped(req as NextApiRequest, res as NextApiResponse);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
          error: {
            code: "test/error",
            message: "Test error message",
            stack: expect.any(String),
          },
        });
      });

      it("handles generic errors with 500 status", async () => {
        const handler = jest.fn().mockRejectedValue(new Error("Generic error"));

        const wrapped = withMiddleware(handler, false);
        await wrapped(req as NextApiRequest, res as NextApiResponse);

        expect(mockStatus).toHaveBeenCalledWith(500);
      });

      it("calls handler successfully when no errors", async () => {
        const handler = jest.fn().mockResolvedValue(undefined);

        const wrapped = withMiddleware(handler, false);
        await wrapped(req as NextApiRequest, res as NextApiResponse);

        expect(handler).toHaveBeenCalledWith(req, res);
        expect(mockStatus).not.toHaveBeenCalled();
      });
    });

    describe("authentication", () => {
      it("requires JWT token when requireAuth is true", async () => {
        const handler = jest.fn();

        const wrapped = withMiddleware(handler, true);
        await wrapped(req as NextApiRequest, res as NextApiResponse);

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          error: {
            code: "auth/missing-token",
            message: "JWT is required",
            stack: expect.any(String),
          },
        });
        expect(handler).not.toHaveBeenCalled();
      });

      it("verifies JWT token and adds userId to request", async () => {
        const mockVerifyIdToken = auth.verifyIdToken as jest.Mock;
        mockVerifyIdToken.mockResolvedValue({ uid: "user123" });

        req.headers = { authorization: "Bearer valid-token" };
        const handler = jest.fn();

        const wrapped = withMiddleware(handler, true);
        await wrapped(req as NextApiRequest, res as NextApiResponse);

        expect(mockVerifyIdToken).toHaveBeenCalledWith("valid-token");
        expect((req as NextApiRequestWithAuth).userId).toBe("user123");
        expect(handler).toHaveBeenCalledWith(req, res);
      });

      it("handles invalid JWT token", async () => {
        const mockVerifyIdToken = auth.verifyIdToken as jest.Mock;
        mockVerifyIdToken.mockRejectedValue({
          code: "auth/invalid-token",
          message: "Invalid token",
        });

        req.headers = { authorization: "Bearer invalid-token" };
        const handler = jest.fn();

        const wrapped = withMiddleware(handler, true);
        await wrapped(req as NextApiRequest, res as NextApiResponse);

        expect(mockStatus).toHaveBeenCalledWith(403);
        expect(mockJson).toHaveBeenCalledWith({
          error: {
            code: "auth/invalid-token",
            message: "Invalid token",
            stack: expect.any(String),
          },
        });
        expect(handler).not.toHaveBeenCalled();
      });
    });
  });
});
