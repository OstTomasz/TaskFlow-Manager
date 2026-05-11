// server/scripts/clear.ts
import mongoose from "mongoose";
import { env } from "../src/env";
import { UserModel } from "../src/features/auth/auth.model";
import { TodoModel } from "../src/features/todos/todos.model";

const clear = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI);
  await UserModel.deleteMany({});
  await TodoModel.deleteMany({});
  console.log("[Clear] done");
  await mongoose.disconnect();
};

clear().catch((err) => {
  console.error("[Clear] failed:", err);
  throw err;
});
