import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@taskflow/shared";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "taskflow-auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
