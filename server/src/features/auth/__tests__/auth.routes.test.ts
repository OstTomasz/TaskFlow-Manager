import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "@/app";
import { UserModel } from "@/features/auth/auth.model";
import { createUser, loginAs } from "./helpers";

// ---------------------------------------------------------------------------
// GET /api/auth/users
// ---------------------------------------------------------------------------

describe("GET /api/auth/users", () => {
  it("returns empty array when no users exist", async () => {
    const res = await request(app).get("/api/auth/users");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual([]);
  });

  it("returns list of users without password and refreshToken", async () => {
    await createUser();
    const res = await request(app).get("/api/auth/users");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);

    const user = res.body.data[0];
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name", "TestUser");
    expect(user).toHaveProperty("avatar", "avatar-1");
    expect(user).not.toHaveProperty("password");
    expect(user).not.toHaveProperty("refreshToken");
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

describe("POST /api/auth/register", () => {
  it("creates a password-protected user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Alice",
      avatar: "avatar-2",
      passwordProtected: true,
      password: "pass1234",
      confirmPassword: "pass1234",
    });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("creates a user without password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Bob",
      avatar: "avatar-3",
      passwordProtected: false,
      password: "",
      confirmPassword: "",
    });

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Bob");
  });

  it("rejects duplicate name", async () => {
    await createUser();
    const res = await request(app).post("/api/auth/register").send({
      name: "TestUser",
      avatar: "avatar-1",
      passwordProtected: false,
      password: "",
      confirmPassword: "",
    });

    expect(res.status).toBe(409);
    expect(res.body.status).toBe("error");
  });

  it("rejects invalid payload (missing name)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      avatar: "avatar-1",
      passwordProtected: false,
      password: "",
      confirmPassword: "",
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

describe("POST /api/auth/login", () => {
  it("logs in with correct password and returns accessToken + cookie", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken, cookie, body } = await loginAs(
      user._id.toString(),
      "pass1234",
    );

    expect(body.status).toBe("success");
    expect(accessToken).toBeTruthy();
    /**
     * httpOnly cookie cannot be read by JS in browser,
     * but supertest exposes it in headers for testing.
     */
    expect(cookie).toContain("refreshToken=");
    expect(cookie).toContain("HttpOnly");
  });

  it("logs in user without password using empty string", async () => {
    const user = await UserModel.create({
      name: "NoPass",
      avatar: "avatar-1",
      password: "",
    });

    const { body } = await loginAs(user._id.toString(), "");
    expect(body.status).toBe("success");
    expect(body.data.accessToken).toBeTruthy();
  });

  it("rejects wrong password", async () => {
    const user = await createUser({ password: "pass1234" });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ userId: user._id.toString(), password: "wrong" });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe("error");
  });

  it("rejects non-existent userId", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ userId: "000000000000000000000000", password: "pass1234" });

    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/refresh
// ---------------------------------------------------------------------------

describe("POST /api/auth/refresh", () => {
  it("issues new accessToken and rotates refresh cookie", async () => {
    const user = await createUser({ password: "pass1234" });
    const { cookie } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();

    /**
     * Rotated cookie must differ from original —
     * proves old token is invalidated.
     */
    const newCookie = res.headers["set-cookie"]?.[0] ?? "";
    expect(newCookie).not.toBe(cookie);
  });

  it("rejects request without cookie", async () => {
    const res = await request(app).post("/api/auth/refresh");
    expect(res.status).toBe(401);
  });

  it("rejects reused refresh token after rotation", async () => {
    const user = await createUser({ password: "pass1234" });
    const { cookie } = await loginAs(user._id.toString(), "pass1234");

    // First refresh — consumes the original token, saves new one to DB
    const firstRefresh = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie);

    expect(firstRefresh.status).toBe(200);

    // Extract rotated cookie — proves first refresh worked
    const rotatedCookie = firstRefresh.headers["set-cookie"]?.[0] ?? "";
    expect(rotatedCookie).toBeTruthy();

    // Second refresh with ORIGINAL cookie — must fail (token reuse detection)
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookie);

    expect(res.status).toBe(401);
    expect(res.body.message).toContain("reuse");
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------

describe("POST /api/auth/logout", () => {
  it("clears refresh cookie", async () => {
    const user = await createUser({ password: "pass1234" });
    const { cookie } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);

    /**
     * Cleared cookie has Max-Age=0 or Expires in the past.
     * supertest returns it in set-cookie header.
     */
    const clearedCookie = res.headers["set-cookie"]?.[0] ?? "";
    expect(clearedCookie).toContain("refreshToken=;");
  });

  it("succeeds even without cookie (already logged out)", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/auth/password
// ---------------------------------------------------------------------------

describe("PATCH /api/auth/password", () => {
  it("changes password with valid token", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "pass1234",
        newPassword: "newpass99",
        confirmNewPassword: "newpass99",
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });

  it("rejects wrong current password", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .patch("/api/auth/password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        currentPassword: "wrong",
        newPassword: "newpass99",
        confirmNewPassword: "newpass99",
      });

    expect(res.status).toBe(401);
  });

  it("rejects request without token", async () => {
    const res = await request(app).patch("/api/auth/password").send({
      currentPassword: "pass1234",
      newPassword: "newpass99",
      confirmNewPassword: "newpass99",
    });

    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/auth/user
// ---------------------------------------------------------------------------

describe("DELETE /api/auth/user", () => {
  it("deletes password-protected user with correct password", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .delete("/api/auth/user")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ password: "pass1234" });

    expect(res.status).toBe(200);
    const deleted = await UserModel.findById(user._id);
    expect(deleted).toBeNull();
  });

  it("deletes user without password (no password field required)", async () => {
    const user = await UserModel.create({
      name: "NoPass",
      avatar: "avatar-1",
      password: "",
    });
    const { accessToken } = await loginAs(user._id.toString(), "");

    const res = await request(app)
      .delete("/api/auth/user")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(res.status).toBe(200);
  });

  it("rejects wrong password", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .delete("/api/auth/user")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("rejects request without token", async () => {
    const res = await request(app)
      .delete("/api/auth/user")
      .send({ password: "pass1234" });

    expect(res.status).toBe(401);
  });
});
