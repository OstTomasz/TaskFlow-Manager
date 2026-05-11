// client/src/features/todos/hooks/__tests__/useTodoMutations.test.tsx
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Todo } from "@taskflow/shared";
import { useTodoMutations } from "../useTodoMutations";
import { resetTodos, mockTodos } from "@/test/server";

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: () => ({
    user: { id: "user-1", name: "User 1", avatar: "Av-1" },
  }),
}));

const SEED_TODOS: Todo[] = [
  {
    id: "todo-1",
    title: "Set up monorepo structure",
    priority: "crucial",
    status: "todo",
    creationDate: "2025-01-01T10:00:00.000Z",
    lastModifiedDate: "2025-01-02T12:00:00.000Z",
    userId: "user-1",
  },
  {
    id: "todo-2",
    title: "Build authentication flow",
    priority: "high",
    status: "todo",
    creationDate: "2025-01-03T09:00:00.000Z",
    lastModifiedDate: "2025-01-04T11:00:00.000Z",
    userId: "user-1",
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useTodoMutations", () => {
  beforeEach(() => resetTodos(SEED_TODOS));

  it("creates a new todo", async () => {
    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.createTodo.mutateAsync({
        title: "This is a brand new todo",
        priority: "medium",
        status: "todo",
      });
    });

    expect(mockTodos).toHaveLength(3);
    expect(mockTodos[0].title).toBe("This is a brand new todo");
  });

  it("updates a todo", async () => {
    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.updateTodo.mutateAsync({
        id: "todo-1",
        title: "Updated todo title here",
        priority: "low",
        status: "in_progress",
      });
    });

    const updated = mockTodos.find((t) => t.id === "todo-1");
    expect(updated?.title).toBe("Updated todo title here");
    expect(updated?.status).toBe("in_progress");
  });

  it("fails when updating non-existent todo", async () => {
    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.updateTodo.mutate({
        id: "non-existent",
        title: "Updated todo title here",
        priority: "medium",
        status: "todo",
      });
    });

    await waitFor(() => {
      expect(result.current.updateTodo.isError).toBe(true);
    });

    expect(mockTodos).toHaveLength(2);
  });

  it("deletes a todo", async () => {
    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.deleteTodo.mutateAsync("todo-1");
    });

    expect(mockTodos).toHaveLength(1);
    expect(mockTodos[0].id).toBe("todo-2");
  });

  it("fails when deleting non-existent todo", async () => {
    const { result } = renderHook(() => useTodoMutations(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.deleteTodo.mutate("non-existent");
    });

    await waitFor(() => {
      expect(result.current.deleteTodo.isError).toBe(true);
    });

    expect(mockTodos).toHaveLength(2);
  });
});
