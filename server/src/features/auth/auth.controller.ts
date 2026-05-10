import type { Request, Response } from "express";
import {
  CreateUserSchema,
  LoginSchema,
  ChangePasswordSchema,
  DeleteUserSchema,
} from "@taskflow/shared";
import {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getAllUsers,
  changePassword,
  deleteUser,
} from "./auth.service";
import { wrapAsync } from "@/utils/wrapAsync";
import { AppError } from "@/utils/appError";
import { verifyRefreshToken } from "@/lib/jwt";

/** Cookie config — httpOnly prevents JS access (XSS protection). */
const REFRESH_COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict" as const,
} as const;

const REFRESH_COOKIE_OPTIONS = {
  ...REFRESH_COOKIE_BASE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in ms
} as const;

export const getUsers = wrapAsync(async (_req: Request, res: Response) => {
  const users = await getAllUsers();
  res.json({ status: "success", data: users, message: "Users fetched" });
});

export const register = wrapAsync(async (req: Request, res: Response) => {
  const parsed = CreateUserSchema.parse(req.body);
  const user = await registerUser({
    name: parsed.name,
    avatar: parsed.avatar,
    password: parsed.passwordProtected ? parsed.password : "",
  });
  res
    .status(201)
    .json({ status: "success", data: user, message: "User created" });
});

export const login = wrapAsync(async (req: Request, res: Response) => {
  const parsed = LoginSchema.parse(req.body);
  const { user, tokens } = await loginUser(parsed.userId, parsed.password);

  /**
   * Refresh token goes into httpOnly cookie — never accessible via JS.
   * Access token goes into response body — client stores in memory only
   * (Zustand store), NOT in localStorage.
   */
  res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({
    status: "success",
    data: { user, accessToken: tokens.accessToken },
    message: "Logged in",
  });
});

export const refresh = wrapAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) throw new AppError("No refresh token", 401);

  const { user, tokens } = await refreshTokens(token);

  res.cookie("refreshToken", tokens.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({
    status: "success",
    data: { user, accessToken: tokens.accessToken },
    message: "Token refreshed",
  });
});

export const logout = wrapAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;

  if (token) {
    /**
     * Best-effort — if user not found we still clear the cookie.
     * Don't throw here: logout should always succeed from client's perspective.
     */
    try {
      const { userId } = verifyRefreshToken(token);
      await logoutUser(userId);
    } catch {
      // token invalid/expired — just clear the cookie
    }
  }

  res.clearCookie("refreshToken", REFRESH_COOKIE_BASE);
  res.json({ status: "success", data: null, message: "Logged out" });
});

export const updatePassword = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const parsed = ChangePasswordSchema.parse(req.body);
  await changePassword(
    req.user.userId,
    parsed.currentPassword,
    parsed.newPassword,
  );
  res.json({ status: "success", data: null, message: "Password updated" });
});

export const removeUser = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const parsed = DeleteUserSchema.parse(req.body);
  await deleteUser(req.user.userId, parsed.password);
  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
  res.json({ status: "success", data: null, message: "User deleted" });
});
