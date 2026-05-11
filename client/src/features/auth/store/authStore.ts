import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@taskflow/shared";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isNavigating: boolean;
  setUser: (user: User | null, accessToken: string) => void;
  setAccessToken: (token: string) => void;
  setIsNavigating: (val: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      isNavigating: false,
      setIsNavigating: (val) => set({ isNavigating: val }),
      logout: () => set({ user: null, accessToken: null, isNavigating: false }),
    }),
    {
      name: "taskflow-auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
