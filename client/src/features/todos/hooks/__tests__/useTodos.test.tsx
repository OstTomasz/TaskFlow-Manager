// client/src/features/todos/hooks/__tests__/useTodos.test.tsx
import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Todo } from "@taskflow/shared";
import { useTodos } from "../useTodos";
import { resetTodos } from "@/test/server";

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
    status: "done",
    creationDate: "2025-01-01T10:00:00.000Z",
    lastModifiedDate: "2025-01-02T12:00:00.000Z",
    completeDate: "2025-01-02T12:00:00.000Z",
    userId: "user-1",
  },
  {
    id: "todo-2",
    title: "Build authentication flow",
    priority: "high",
    status: "in_progress",
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

describe("useTodos", () => {
  beforeEach(() => resetTodos(SEED_TODOS));

  it("returns todos from API", async () => {
    const { result } = renderHook(() => useTodos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.todos).toHaveLength(2);
    });

    expect(result.current.todos[0].userId).toBe("user-1");
  });

  it("returns empty array when no todos", async () => {
    resetTodos([]);
    const { result } = renderHook(() => useTodos(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.todos).toHaveLength(0);
  });
});
