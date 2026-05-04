import { useState } from "react";
import { useLocation } from "react-router-dom";
import { LogOut, Menu, Settings } from "lucide-react";
import { MobileMenu, ThemeToggler, SettingsModal } from "@/components";
import { useLogout } from "@/features/auth/hooks/useLogout";

export const Topbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { pathname } = useLocation();
  const isLogged = pathname !== "/";

  const logout = useLogout();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleSettingsOpen = () => {
    setIsSettingsModalOpen(true);
  };

  return (
    <header className="w-full grid grid-cols-[2fr_1fr] py-(--space-sm) border-b items-center px-(--space-sm)">
      <h1 className="text-center">Task List Manager</h1>
      {isLogged ? (
        <div>
          <div className="flex justify-end">
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu />
            </button>
            <div className="hidden md:flex gap-(--space-sm) justify-center items-center">
              <ThemeToggler />
              <button onClick={handleSettingsOpen}>
                <Settings />
              </button>
              <button onClick={handleLogout}>
                <LogOut />
              </button>
            </div>
          </div>
          <MobileMenu
            isOpen={isMobileMenuOpen}
            handleClose={() => setIsMobileMenuOpen(false)}
            handleSettingsOpen={handleSettingsOpen}
          />
        </div>
      ) : (
        <div className="flex justify-end">
          <ThemeToggler />
        </div>
      )}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        handleClose={() => setIsSettingsModalOpen(false)}
      />
    </header>
  );
};
