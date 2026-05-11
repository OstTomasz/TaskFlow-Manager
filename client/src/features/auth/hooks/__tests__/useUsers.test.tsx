import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { User } from "@taskflow/shared";
import { useUsers } from "../useUsers";
import { useDeleteUser } from "../useDeleteUser";
import { resetUsers, mockUsers } from "@/test/server";
import { server } from "@/test/server";
import { http, HttpResponse } from "msw";

const mockLogout = vi.fn();

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: () => ({
    user: { id: "user-1", name: "User 1", avatar: "Av-1", hasPassword: true },
    logout: mockLogout,
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

const SEED_USERS: User[] = [
  { id: "user-1", name: "User 1", avatar: "Av-1", hasPassword: true },
  { id: "user-2", name: "User 2", avatar: "Av-3", hasPassword: false },
  { id: "user-3", name: "User 3", avatar: "Av-4", hasPassword: true },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useUsers", () => {
  beforeEach(() => {
    resetUsers(SEED_USERS);
    mockLogout.mockClear();
  });

  it("returns users from API", async () => {
    server.use(
      http.get("http://localhost:5001/api/auth/users", () =>
        HttpResponse.json({
          status: "success",
          data: mockUsers,
          message: "Users fetched",
        }),
      ),
    );

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.users).toHaveLength(3);
    });
  });

  it("returns empty array when no users", async () => {
    resetUsers([]);
    server.use(
      http.get("http://localhost:5001/api/auth/users", () =>
        HttpResponse.json({
          status: "success",
          data: mockUsers,
          message: "Users fetched",
        }),
      ),
    );

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.users).toHaveLength(0);
  });
});

describe("useDeleteUser", () => {
  beforeEach(() => {
    resetUsers(SEED_USERS);
    mockLogout.mockClear();
  });

  it("deletes user and calls logout on success", async () => {
    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync("pass1");

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledOnce();
    });
  });
});
