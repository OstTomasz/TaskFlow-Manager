import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
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
app.use(limiter);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "success", data: { ok: true }, message: "Server alive" });
});

// TODO: mount feature routers here

app.use(notFound);
app.use(errorHandler);
