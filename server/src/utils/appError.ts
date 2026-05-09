/**
 * Operational error with HTTP status code.
 * Distinguishes known errors from unexpected crashes in errorHandler.
 */
export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
