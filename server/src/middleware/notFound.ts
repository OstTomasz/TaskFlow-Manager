import type { Request, Response } from "express";

/** Catch-all for unregistered routes. */
export const notFound = (_req: Request, res: Response): void => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    data: null,
  });
};
