import { Dialog, DialogPanel, TransitionChild } from "@headlessui/react";
import { LogOut, Settings, X } from "lucide-react";
import { ThemeToggler } from "./ThemeToggler";
import { useLogout } from "@/hooks/useLogout";

interface MobileMenuProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const MobileMenu = ({ isOpen, handleClose }: MobileMenuProps) => {
  const logout = useLogout();

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <TransitionChild>
        <div
          className="fixed inset-0 bg-ink/30 backdrop-blur-sm
  transition duration-300 ease-in-out
  data-closed:opacity-0"
          aria-hidden="true"
        />
      </TransitionChild>
      <DialogPanel
        transition
        className="fixed top-0 right-0 w-48 rounded-bl-xl
bg-(--bg-primary) border-b-2 border-l-2 border-ink p-(--space-sm)
transition duration-300 ease-in-out
data-closed:-translate-y-full     data-closed:translate-x-full"
      >
        <button onClick={handleClose} className="fixed right-2 top-3">
          <X />
        </button>
        <div className="flex flex-col gap-(--space-md) mt-(--space-xl) ml-(--space-sm) mb-(--space-sm)">
          <button className="flex gap-(--space-sm)">
            <Settings /> Settings
          </button>
          <button className="flex gap-(--space-sm)" onClick={handleLogout}>
            <LogOut /> Logout
          </button>
          <ThemeToggler />
        </div>
      </DialogPanel>
    </Dialog>
  );
};
