export class ApiError extends Error {
  code: string;
  status?: number;
  remoteStack?: string;

  constructor(code: string, message: string, status?: number, remoteStack?: string) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);

    this.code = code;
    this.status = status;
    this.remoteStack = remoteStack;
  }
}
