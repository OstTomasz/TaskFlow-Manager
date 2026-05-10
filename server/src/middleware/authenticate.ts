import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { verifyAccessToken, type AccessTokenPayload } from "../lib/jwt";

/**
 * Extends Express Request to carry the authenticated user's payload.
 * Available in all controllers after this middleware runs.
 */
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

/**
 * Protects routes by verifying the Bearer access token.
 * Client sends: Authorization: Bearer <accessToken>
 * On success — attaches payload to req.user and calls next().
 * On failure — throws AppError (caught by errorHandler via wrapAsync).
 */
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401);
  }

  const token = header.slice(7); // strip "Bearer " prefix

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }
};
