import request from "supertest";
import { app } from "../../../app";

/**
 * Creates a todo via HTTP POST — requires valid accessToken.
 * Returns the created todo from response body.
 */
export const createTodo = async (
  accessToken: string,
  overrides?: Partial<{
    title: string;
    description: string;
    priority: string;
    status: string;
  }>,
) => {
  const res = await request(app)
    .post("/api/todos")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      title: "This is a test todo",
      description: "Test description",
      priority: "medium",
      status: "todo",
      ...overrides,
    });
  return res;
};
