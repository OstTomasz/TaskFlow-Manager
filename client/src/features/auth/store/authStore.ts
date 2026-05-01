import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@taskflow/shared";

interface AuthState {
  user: User | null;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (u) => set({ user: u }),
      logout: () => set({ user: null }),
    }),
    {
      name: "taskflow-auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
