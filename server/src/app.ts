import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { authRouter } from "./features/auth/auth.routes";
import morgan from "morgan";
import { todosRouter } from "./features/todos/todos.routes";

export const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true, // required for httpOnly refresh token cookie
  }),
);
app.use(helmet());
if (env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "success", data: { ok: true }, message: "Server alive" });
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todosRouter);

app.use(notFound);
app.use(errorHandler);
