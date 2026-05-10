import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "@/app";
import { TodoModel } from "@/features/todos/todos.model";
import { createUser, loginAs } from "@/features/auth/__tests__/helpers";
import { createTodo } from "./helpers";

// GET /api/todos
// ---------------------------------------------------------------------------

describe("GET /api/todos", () => {
  it("returns empty array when user has no todos", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toEqual([]);
  });

  it("returns only todos belonging to authenticated user", async () => {
    const userA = await createUser({ password: "pass1234" });
    const userB = await createUser({ password: "pass1234", name: "UserB" });

    const { accessToken: tokenA } = await loginAs(
      userA._id.toString(),
      "pass1234",
    );
    const { accessToken: tokenB } = await loginAs(
      userB._id.toString(),
      "pass1234",
    );

    await createTodo(tokenA);
    await createTodo(tokenB);

    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].userId).toBe(userA._id.toString());
  });

  it("rejects request without token", async () => {
    const res = await request(app).get("/api/todos");
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// POST /api/todos
// ---------------------------------------------------------------------------

describe("POST /api/todos", () => {
  it("creates a todo with valid payload", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await createTodo(accessToken);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({
      title: "This is a test todo",
      priority: "medium",
      status: "todo",
    });
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("creationDate");
    expect(res.body.data).toHaveProperty("lastModifiedDate");
  });

  it("sets completeDate when created with status done", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await createTodo(accessToken, { status: "done" });

    expect(res.status).toBe(201);
    expect(res.body.data.completeDate).toBeTruthy();
  });

  it("does not set completeDate when status is not done", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await createTodo(accessToken, { status: "todo" });

    expect(res.body.data.completeDate).toBeFalsy();
  });

  it("rejects todo with title too short", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");

    const res = await createTodo(accessToken, { title: "Too short" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("error");
  });

  it("rejects request without token", async () => {
    const res = await request(app).post("/api/todos").send({
      title: "This is a test todo",
      priority: "medium",
      status: "todo",
    });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// PATCH /api/todos/:id
// ---------------------------------------------------------------------------

describe("PATCH /api/todos/:id", () => {
  it("updates todo fields", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");
    const { body: created } = await createTodo(accessToken);
    const todoId = created.data.id;

    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "This is an updated todo",
        priority: "high",
        status: "in_progress",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("This is an updated todo");
    expect(res.body.data.priority).toBe("high");
  });

  it("sets completeDate when status changes to done", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");
    const { body: created } = await createTodo(accessToken, { status: "todo" });
    const todoId = created.data.id;

    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "This is a test todo",
        priority: "medium",
        status: "done",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.completeDate).toBeTruthy();
  });

  it("clears completeDate when status changes from done", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");
    const { body: created } = await createTodo(accessToken, { status: "done" });
    const todoId = created.data.id;

    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "This is a test todo",
        priority: "medium",
        status: "in_progress",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.completeDate).toBeFalsy();
  });

  it("rejects update of todo belonging to different user", async () => {
    const userA = await createUser({ password: "pass1234" });
    const userB = await createUser({ password: "pass1234", name: "UserB" });

    const { accessToken: tokenA } = await loginAs(
      userA._id.toString(),
      "pass1234",
    );
    const { accessToken: tokenB } = await loginAs(
      userB._id.toString(),
      "pass1234",
    );

    const { body: created } = await createTodo(tokenA);
    const todoId = created.data.id;

    const res = await request(app)
      .patch(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        title: "This is a test todo",
        priority: "medium",
        status: "todo",
      });

    expect(res.status).toBe(404);
  });

  it("rejects request without token", async () => {
    const res = await request(app)
      .patch("/api/todos/000000000000000000000000")
      .send({
        title: "This is a test todo",
        priority: "medium",
        status: "todo",
      });
    expect(res.status).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// DELETE /api/todos/:id
// ---------------------------------------------------------------------------

describe("DELETE /api/todos/:id", () => {
  it("deletes todo belonging to authenticated user", async () => {
    const user = await createUser({ password: "pass1234" });
    const { accessToken } = await loginAs(user._id.toString(), "pass1234");
    const { body: created } = await createTodo(accessToken);
    const todoId = created.data.id;

    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    const deleted = await TodoModel.findById(todoId);
    expect(deleted).toBeNull();
  });

  it("rejects deletion of todo belonging to different user", async () => {
    const userA = await createUser({ password: "pass1234" });
    const userB = await createUser({ password: "pass1234", name: "UserB" });

    const { accessToken: tokenA } = await loginAs(
      userA._id.toString(),
      "pass1234",
    );
    const { accessToken: tokenB } = await loginAs(
      userB._id.toString(),
      "pass1234",
    );

    const { body: created } = await createTodo(tokenA);
    const todoId = created.data.id;

    const res = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });

  it("rejects request without token", async () => {
    const res = await request(app).delete(
      "/api/todos/000000000000000000000000",
    );
    expect(res.status).toBe(401);
  });
});
