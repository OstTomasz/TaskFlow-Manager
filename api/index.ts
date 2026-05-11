import { connectDB } from "../server/src/lib/mongoose";
import { app } from "../server/src/app";

/**
 * Vercel serverless handler.
 * connectDB is idempotent — safe to call on every warm/cold start.
 */
export default async function handler(
  req: Parameters<typeof app>[0],
  res: Parameters<typeof app>[1],
) {
  await connectDB();
  app(req, res);
}
