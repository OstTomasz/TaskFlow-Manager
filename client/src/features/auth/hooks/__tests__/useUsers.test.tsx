import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsers } from "../useUsers";

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
  typeof renderHook<ReturnType<typeof useUsers>, unknown>
>["result"];

beforeEach(() => {
  ({ result } = renderHook(() => useUsers(), {
    wrapper: createWrapper(),
  }));
});

describe("useUsers", () => {
  it("returns 9 users", async () => {
    await waitFor(() => {
      expect(result.current.users).toHaveLength(9);
    });
  });
});
