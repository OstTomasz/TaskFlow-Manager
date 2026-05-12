import request from "supertest";
import bcrypt from "bcryptjs";
import { app } from "../../../app";
import { UserModel } from "../auth.model";
import { SALT_ROUNDS } from "../../../config/constants";

//--------------- Auth routes ---------------//
/**
 * Creates a test user directly in DB (bypasses HTTP layer).
 * Keeps tests independent from /register endpoint.
 */
export const createUser = async (
  overrides?: Partial<{
    password: string;
    name: string;
  }>,
) => {
  const plain = overrides?.password ?? "pass1234";
  const hashed = plain ? await bcrypt.hash(plain, SALT_ROUNDS) : "";
  return UserModel.create({
    name: overrides?.name ?? "TestUser",
    avatar: "avatar-1",
    password: hashed,
  });
};

/**
 * Logs in via HTTP and returns { accessToken, cookie }.
 * Reusable across tests that need an authenticated session.
 */
export const loginAs = async (userId: string, password: string) => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ userId, password });

  const cookie = res.headers["set-cookie"]?.[0] ?? "";
  const accessToken = res.body.data?.accessToken ?? "";
  return { accessToken, cookie, body: res.body };
};
