import "tsconfig-paths/register";
import { connectDB } from "../server/src/lib/mongoose";
import { app } from "../server/src/app";
import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  await connectDB();
  app(req, res);
}
