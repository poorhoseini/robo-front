export class ResponseError extends Error {
  data: any = {};
  reason: number = 0;

  constructor(msg: string, data: any, reason?: number) {
    super(msg);

    this.data = data;
    this.reason = reason || 0;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ResponseError.prototype);
  }

  getErrorData() {
    return this.data;
  }

  getErrorReason() {
    return this.reason;
  }

  printError() {
    return this.message;
  }
}
