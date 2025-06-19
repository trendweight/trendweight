import { ApiError } from "../exceptions";

describe("ApiError", () => {
  it("creates error with code and message", () => {
    const error = new ApiError("test/error", "Test error message");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("test/error");
    expect(error.message).toBe("Test error message");
    expect(error.status).toBeUndefined();
    expect(error.remoteStack).toBeUndefined();
  });

  it("creates error with status code", () => {
    const error = new ApiError("auth/unauthorized", "Unauthorized", 401);

    expect(error.code).toBe("auth/unauthorized");
    expect(error.message).toBe("Unauthorized");
    expect(error.status).toBe(401);
  });

  it("creates error with remote stack trace", () => {
    const remoteStack = "Error at remote:123\n  at function:456";
    const error = new ApiError("remote/error", "Remote error", 500, remoteStack);

    expect(error.code).toBe("remote/error");
    expect(error.message).toBe("Remote error");
    expect(error.status).toBe(500);
    expect(error.remoteStack).toBe(remoteStack);
  });

  it("has proper prototype chain", () => {
    const error = new ApiError("test/error", "Test");

    expect(error instanceof ApiError).toBe(true);
    expect(error instanceof Error).toBe(true);
    expect(error.name).toBe("Error");
  });
});
