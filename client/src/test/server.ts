import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import type { Todo, User } from "@taskflow/shared";

/**
 * In-memory stores — shared between handlers.
 * Reset in beforeEach via exported helpers.
 */
export let mockUsers: User[] = [];
export let mockTodos: Todo[] = [];

export const resetUsers = (users: User[]) => {
  mockUsers = [...users];
};
export const resetTodos = (todos: Todo[]) => {
  mockTodos = [...todos];
};

export const handlers = [
  http.get("http://localhost:5001/api/todos", () =>
    HttpResponse.json({
      status: "success",
      data: mockTodos,
      message: "Todos fetched",
    }),
  ),

  http.delete("http://localhost:5001/api/auth/user", () =>
    HttpResponse.json({
      status: "success",
      data: null,
      message: "User deleted",
    }),
  ),

  http.get("http://localhost:5001/api/todos", ({ request }) => {
    const auth = request.headers.get("Authorization");
    if (!auth)
      return HttpResponse.json(
        { status: "error", data: null, message: "Unauthorized" },
        { status: 401 },
      );
    return HttpResponse.json({
      status: "success",
      data: mockTodos,
      message: "Todos fetched",
    });
  }),

  http.post("http://localhost:5001/api/todos", async ({ request }) => {
    const body = (await request.json()) as Partial<Todo>;
    const todo: Todo = {
      id: `todo-${Date.now()}`,
      userId: "user-1",
      creationDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      priority: "medium",
      status: "todo",
      title: "Default title",
      ...body,
    };
    mockTodos = [todo, ...mockTodos];
    return HttpResponse.json(
      { status: "success", data: todo, message: "Todo created" },
      { status: 201 },
    );
  }),

  http.patch(
    "http://localhost:5001/api/todos/:id",
    async ({ params, request }) => {
      const { id } = params;
      const body = (await request.json()) as Partial<Todo>;
      const index = mockTodos.findIndex((t) => t.id === id);
      if (index === -1) {
        return HttpResponse.json(
          { status: "error", data: null, message: "Todo not found" },
          { status: 404 },
        );
      }
      mockTodos[index] = {
        ...mockTodos[index],
        ...body,
        lastModifiedDate: new Date().toISOString(),
      };
      return HttpResponse.json({
        status: "success",
        data: mockTodos[index],
        message: "Todo updated",
      });
    },
  ),

  http.delete("http://localhost:5001/api/todos/:id", ({ params }) => {
    const { id } = params;
    const exists = mockTodos.some((t) => t.id === id);
    if (!exists) {
      return HttpResponse.json(
        { status: "error", data: null, message: "Todo not found" },
        { status: 404 },
      );
    }
    mockTodos = mockTodos.filter((t) => t.id !== id);
    return HttpResponse.json({
      status: "success",
      data: null,
      message: "Todo deleted",
    });
  }),
];

export const server = setupServer(...handlers);
