export class ApiError extends Error {
  code: string;
  status?: number;

  constructor(code: string, message: string, status?: number) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.status = status;
  }
}
