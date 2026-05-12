import jwt from "jsonwebtoken";

import { randomUUID } from "crypto";
import { env } from "../env";

/**
 * Shape of the JWT payload for access tokens.
 * Kept minimal — only what's needed to identify the user on each request.
 */
export interface AccessTokenPayload {
  userId: string;
  name: string;
}

/**
 * Shape of the JWT payload for refresh tokens.
 * Only userId — refresh tokens are long-lived, minimal payload = less exposure.
 */
export interface RefreshTokenPayload {
  userId: string;
}

/**
 * Signs a short-lived access token (15m).
 * Sent in response body — client stores in memory (not localStorage).
 */
export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

/**
 * Signs a long-lived refresh token (7d).
 * Sent as httpOnly cookie — JS cannot read it, protects against XSS.
 */
export const signRefreshToken = (payload: RefreshTokenPayload): string =>
  jwt.sign({ ...payload, jti: randomUUID() }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

/**
 * Verifies and decodes an access token.
 * Throws JsonWebTokenError / TokenExpiredError on failure —
 * caught by errorHandler via wrapAsync.
 */
export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;

/**
 * Verifies and decodes a refresh token.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload =>
  jwt.verify(token, env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
