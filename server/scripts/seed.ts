import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import { env } from "../src/env";
import { UserModel } from "../src/features/auth/auth.model";
import { SALT_ROUNDS } from "../src/config/constants";

const seed = async (): Promise<void> => {
  await mongoose.connect(env.MONGO_URI);
  console.log("[Seed] connected to MongoDB");

  await UserModel.deleteMany({});
  console.log("[Seed] cleared users collection");

  const seedUsers = [
    {
      name: "Alice",
      avatar: "Av-1",
      password: await bcrypt.hash("pass1234", SALT_ROUNDS),
    },
    {
      name: "Bob",
      avatar: "Av-3",
      password: "",
    },
    {
      name: "Carol",
      avatar: "Av-4",
      password: await bcrypt.hash("pass1234", SALT_ROUNDS),
    },
  ];

  const created = await UserModel.insertMany(seedUsers);
  console.log(`[Seed] inserted ${created.length} users:`);
  created.forEach((u) => console.log(`  • ${u.name} (${u._id})`));

  await mongoose.disconnect();
  console.log("[Seed] done");
};

seed().catch((err) => {
  console.error("[Seed] failed:", err);
  throw err;
});
