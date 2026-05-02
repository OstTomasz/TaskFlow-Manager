import { useThemeStore } from "@/features/theme/store/themeStore";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";
import { cn } from "@/lib/cn";
import { Moon, Sun } from "lucide-react";

export const ThemeToggler = () => {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleChange = (checked: boolean) =>
    setTheme(checked ? "dark" : "light");

  const icon = theme === "light" ? <Sun /> : <Moon />;

  return (
    <Switch
      checked={theme === "dark"}
      onChange={handleChange}
      className={cn(
        "relative inline-flex h-8 w-16 items-center rounded-full border-2 transition-colors",
        theme === "dark" ? "bg-navy-2 border-cream" : "bg-cream border-ink",
      )}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      <span
        className={cn(
          "inline-block h-6 w-6 rounded-full transition-transform duration-300",
          theme === "dark" ? "translate-x-7" : "translate-x-1",
        )}
      >
        {icon}
      </span>
    </Switch>
  );
};
