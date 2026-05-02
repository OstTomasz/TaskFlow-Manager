import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { LogOut, Menu, Settings, X } from "lucide-react";
import { ThemeToggler } from "./ui/ThemeToggler";

export const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-dvw grid grid-cols-[2fr_1fr] py-(--space-sm) border-b items-center px-(--space-sm)">
      <h1 className="text-center">Task List Manager</h1>
      <div className="flex justify-end">
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <Menu />
        </button>
        <div className="hidden md:flex gap-(--space-sm) justify-center items-center">
          <button>
            <Settings />
          </button>
          <button>
            <LogOut />
          </button>
          <ThemeToggler />
        </div>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div
          className="fixed inset-0 bg-ink/30 backdrop-blur-sm"
          aria-hidden="true"
        />
        <DialogPanel
          transition
          className="fixed top-0 right-0 w-48 rounded-bl-xl
    bg-(--bg-primary) border-b-2 border-l-2 border-ink p-(--space-sm)
    transition duration-300 ease-in-out
    data-closed:-translate-y-full     data-closed:translate-x-full"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="fixed right-2 top-3"
          >
            <X />
          </button>
          <div className="flex flex-col gap-(--space-md) mt-20 ml-(--space-sm)">
            <button className="w-fit flex gap-(--space-sm)">
              <Settings /> Settings
            </button>
            <button className="w-fit flex gap-(--space-sm)">
              <LogOut /> Logout
            </button>
            <ThemeToggler />
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
