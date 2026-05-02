import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LogOut, Menu, Settings } from "lucide-react";
import { MobileMenu, ThemeToggler } from "@/components";
import { useLogout } from "@/hooks/useLogout";

export const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const isLogged = pathname !== "/";

  const logout = useLogout();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <header className="w-dvw grid grid-cols-[2fr_1fr] py-(--space-sm) border-b items-center px-(--space-sm)">
      <h1 className="text-center">Task List Manager</h1>
      {isLogged ? (
        <div>
          <div className="flex justify-end">
            <button className="md:hidden" onClick={() => setIsOpen(true)}>
              <Menu />
            </button>
            <div className="hidden md:flex gap-(--space-sm) justify-center items-center">
              <ThemeToggler />
              <button>
                <Settings />
              </button>
              <button onClick={handleLogout}>
                <LogOut />
              </button>
            </div>
          </div>
          <MobileMenu isOpen={isOpen} handleClose={() => setIsOpen(false)} />
        </div>
      ) : (
        <div className="flex justify-end">
          <ThemeToggler />
        </div>
      )}
    </header>
  );
};
