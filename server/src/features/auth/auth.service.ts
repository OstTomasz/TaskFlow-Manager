import bcrypt from "bcryptjs";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import { UserModel, type IUser } from "./auth.model";
import { AppError } from "../../utils/appError";

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password.
 * Empty string (no-password user) is stored as-is — no hash needed.
 */
const hashPassword = async (plain: string): Promise<string> => {
  if (!plain) return "";
  return bcrypt.hash(plain, SALT_ROUNDS);
};

/**
 * Compares plain password against stored hash.
 * If user has no password (empty string) — any empty input passes.
 */
const verifyPassword = async (
  plain: string,
  stored: string,
): Promise<boolean> => {
  if (!stored) return plain === "";
  return bcrypt.compare(plain, stored);
};

/** Generates both tokens for a user. */
const issueTokens = (user: IUser) => ({
  accessToken: signAccessToken({
    userId: user._id.toString(),
    name: user.name,
  }),
  refreshToken: signRefreshToken({ userId: user._id.toString() }),
});

/**
 * Creates a new user.
 * Hashes password before persisting — raw password never touches DB.
 */
export const registerUser = async (data: {
  name: string;
  avatar: string;
  password: string;
}) => {
  const existing = await UserModel.findOne({ name: data.name });
  if (existing) throw new AppError("Name already taken", 409);

  const hashed = await hashPassword(data.password);
  const user = await UserModel.create({ ...data, password: hashed });
  return user;
};

/**
 * Validates credentials and issues token pair.
 * Stores refreshToken in DB — overwrites any previous session.
 */
export const loginUser = async (userId: string, password: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new AppError("Invalid password", 401);

  const tokens = issueTokens(user);

  /**
   * Save refresh token to DB — one active session per user.
   * If the same user logs in from another device, previous refresh token
   * is overwritten and that session can no longer be renewed.
   */
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

/**
 * Rotates refresh token — verifies old, issues new pair, saves to DB.
 * If token doesn't match what's stored → possible token theft → reject.
 */
export const refreshTokens = async (incomingRefreshToken: string) => {
  const payload = verifyRefreshToken(incomingRefreshToken);

  const user = await UserModel.findById(payload.userId);
  if (!user) throw new AppError("User not found", 404);

  /**
   * Token reuse detection:
   * If the incoming token doesn't match what's in DB, it means either:
   * - the token was already rotated (reuse of old token), or
   * - an attacker stole the token.
   * Either way — reject and clear stored token (force re-login).
   */
  if (user.refreshToken !== incomingRefreshToken) {
    user.refreshToken = "";
    await user.save();
    throw new AppError("Refresh token reuse detected", 401);
  }

  const tokens = issueTokens(user);
  user.refreshToken = tokens.refreshToken;
  await user.save();

  return { user, tokens };
};

/** Clears refresh token from DB — invalidates the session server-side. */
export const logoutUser = async (userId: string) => {
  await UserModel.findByIdAndUpdate(userId, { refreshToken: "" });
};

/** Returns all users — passwords and tokens stripped by toJSON. */
export const getAllUsers = async () => UserModel.find();

/** Changes password — verifies current before updating. */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) throw new AppError("Current password is incorrect", 401);

  user.password = await hashPassword(newPassword);
  /**
   * Invalidate all sessions after password change —
   * anyone holding old refresh tokens can no longer renew access.
   */
  user.refreshToken = "";
  await user.save();
};

/** Deletes user — verifies password if account is protected. */
export const deleteUser = async (userId: string, password?: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError("User not found", 404);

  if (user.password) {
    if (!password) throw new AppError("Password required", 400);
    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new AppError("Invalid password", 401);
  }

  await UserModel.findByIdAndDelete(userId);
};
