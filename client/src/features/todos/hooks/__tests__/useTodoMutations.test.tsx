import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTodoMutations } from "../useTodoMutations";
import { MOCK_TODOS } from "../useTodos";
import { MOCK } from "./fixtures/todos";

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: () => ({
    user: { id: "user-1", name: "User 1", avatar: "avatar-1" },
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

let result: ReturnType<
  typeof renderHook<ReturnType<typeof useTodoMutations>, unknown>
>["result"];

beforeEach(() => {
  MOCK_TODOS.length = 0;
  MOCK_TODOS.push(...MOCK);
  ({ result } = renderHook(() => useTodoMutations(), {
    wrapper: createWrapper(),
  }));
});

describe("useTodoMutations", () => {
  it("creates a new todo", async () => {
    await act(async () => {
      result.current.createTodo.mutate({
        title: "Test todo title here",
        priority: "medium",
      });
    });

    expect(MOCK_TODOS).toHaveLength(7);
    expect(MOCK_TODOS.at(-1)?.title).toBe("Test todo title here");
    expect(MOCK_TODOS.at(-1)?.status).toBe("todo");
    expect(MOCK_TODOS.at(-1)?.userId).toBe("user-1");
  });

  it("edit todo", async () => {
    await act(async () => {
      result.current.updateTodo.mutate({
        id: "1a2b3c4d-0000-0000-0000-000000000001",
        title: "Updated todo title here",
        priority: "medium",
        status: "in_progress",
      });
    });

    expect(MOCK_TODOS).toHaveLength(6);
    expect(MOCK_TODOS[0].title).toBe("Updated todo title here");
    expect(MOCK_TODOS[0].priority).toBe("medium");
    expect(MOCK_TODOS[0].status).toBe("in_progress");
  });

  it("fails when updating non-existent todo", async () => {
    await act(async () => {
      result.current.updateTodo.mutate({
        id: "non-existent-id",
        title: "Updated todo title here",
        priority: "medium",
        status: "in_progress",
      });
    });

    await waitFor(() => {
      expect(result.current.updateTodo.isError).toBe(true);
    });
    expect(MOCK_TODOS).toHaveLength(6);
  });

  it("delete todo", async () => {
    await act(async () => {
      result.current.deleteTodo.mutate("1a2b3c4d-0000-0000-0000-000000000001");
    });

    expect(MOCK_TODOS).toHaveLength(5);
    expect(MOCK_TODOS[0].title).toBe("Build authentication flow");
  });

  it("fails when deleting non-existent todo", async () => {
    await act(async () => {
      result.current.deleteTodo.mutate("non-existent-id");
    });

    await waitFor(() => {
      expect(result.current.deleteTodo.isError).toBe(true);
    });
    expect(MOCK_TODOS).toHaveLength(6);
  });
});
