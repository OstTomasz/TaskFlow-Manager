import { create } from "zustand";
import { persist } from "zustand/middleware";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
  ? "dark"
  : "light";

interface ThemeState {
  theme: "light" | "dark";
  setTheme: (theme: ThemeState["theme"]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: systemTheme,
      setTheme: (t) => set({ theme: t }),
    }),
    {
      name: "taskflow-theme",
    },
  ),
);
