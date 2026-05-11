import mongoose from "mongoose";
import { env } from "../env";

/**
 * Opens Mongoose connection. Safe to call multiple times (Vercel warm starts).
 */
export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(env.MONGO_URI, {
    dbName: "taskflow",
  });

  console.log("[MongoDB] connected");
};
