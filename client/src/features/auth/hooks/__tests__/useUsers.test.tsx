import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsers, useDeleteUser, MOCK_USERS } from "../useUsers";

// mock authStore
const mockLogout = vi.fn();
const mockUser: {
  id: string;
  name: string;
  avatar: string;
  password: string | undefined;
} = {
  id: "user-1",
  name: "User 1",
  avatar: "Av-1",
  password: "pass1",
};

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: () => ({
    user: mockUser,
    logout: mockLogout,
  }),
}));

// mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
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

describe("useUsers", () => {
  beforeEach(() => {
    ({ result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    }));
  });
  it("returns 9 users", async () => {
    await waitFor(() => {
      expect(result.current.users).toHaveLength(9);
    });
  });
});

describe("useDeleteUser", () => {
  beforeEach(() => {
    // reset MOCK_USERS
    MOCK_USERS.length = 0;
    MOCK_USERS.push(
      { id: "user-1", name: "User 1", avatar: "Av-1", password: "pass1" },
      { id: "user-2", name: "User 2", avatar: "Av-3", password: undefined },
    );
    mockLogout.mockClear();
  });

  it("deletes user with correct password", async () => {
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("pass1");

    await waitFor(() => {
      expect(MOCK_USERS.find((u) => u.id === "user-1")).toBeUndefined();
      expect(mockLogout).toHaveBeenCalledOnce();
    });
  });

  it("rejects with wrong password", async () => {
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await expect(result.current.mutateAsync("wrongpass")).rejects.toThrow(
      "Invalid password",
    );
    expect(MOCK_USERS.find((u) => u.id === "user-1")).toBeDefined();
  });

  it("deletes user without password when no password provided", async () => {
    mockUser.password = undefined;
    MOCK_USERS[0] = {
      id: "user-1",
      name: "User 1",
      avatar: "Av-1",
      password: undefined,
    };

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync(undefined);

    await waitFor(() => {
      expect(MOCK_USERS.find((u) => u.id === "user-1")).toBeUndefined();
    });

    mockUser.password = "pass1";
  });
});
