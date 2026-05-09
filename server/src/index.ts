import { connectDB } from "./lib/mongoose";
import { app } from "./app";
import { env } from "./env";

const start = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`[Server] running on http://localhost:${env.PORT}`);
  });
};

start();
