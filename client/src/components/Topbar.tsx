import { LogOut, Menu, Settings } from "lucide-react";
import { ThemeToggler } from "./ui/ThemeToggler";

export const Topbar = () => {
  return (
    <header className="w-dvw grid grid-cols-[2fr_1fr] py-(--space-sm) border-b items-center px-(--space-sm)">
      <h1 className="text-center">Task List Manager</h1>
      <div className="flex justify-end">
        <button className="md:hidden">
          <Menu />
        </button>
        <div className="hidden md:flex gap-2 justify-center items-center">
          <button>
            <Settings />
          </button>
          <button>
            <LogOut />
          </button>
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
};
