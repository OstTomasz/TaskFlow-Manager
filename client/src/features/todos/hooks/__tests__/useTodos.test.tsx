import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MOCK_TODOS, useTodos } from "../useTodos";
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
  typeof renderHook<ReturnType<typeof useTodos>, unknown>
>["result"];

beforeEach(() => {
  MOCK_TODOS.length = 0;
  MOCK_TODOS.push(...MOCK);
  ({ result } = renderHook(() => useTodos(), {
    wrapper: createWrapper(),
  }));
});

describe("useTodos", () => {
  it("returns todos for logged user", async () => {
    await waitFor(() => {
      expect(result.current.todos).toHaveLength(4);
    });

    expect(result.current.todos[0].userId).toBe("user-1");
  });
});
