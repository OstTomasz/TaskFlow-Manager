import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectDB } from "../server/src/lib/mongoose";
import { app } from "../server/src/app";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();
  return app(req, res);
}
