import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Wraps an async route handler and forwards errors to Express error middleware.
 * Eliminates try/catch boilerplate in every controller.
 */
export const wrapAsync =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
