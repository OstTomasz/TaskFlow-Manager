import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";

/**
 * Central error handler — must be registered last in Express middleware chain.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      data: err.issues,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      data: null,
    });
    return;
  }

  console.error("[Unhandled]", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    data: null,
  });
};
