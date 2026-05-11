import { connectDB } from "../server/src/lib/mongoose";
import { app } from "../server/src/app";
import type { Request, Response } from "express";

/**
 * Vercel serverless handler.
 * connectDB is idempotent — safe to call on every warm/cold start.
 */
export default async function handler(req: Request, res: Response) {
  await connectDB();
  app(req, res);
}
