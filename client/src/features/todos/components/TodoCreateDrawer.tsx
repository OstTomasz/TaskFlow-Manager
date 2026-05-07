import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { TodoCreateForm } from "./TodoCreateForm";

interface TodoCreateDrawerProps {
  handleClose: () => void;
  isOpen: boolean;
}

export const TodoCreateDrawer = ({
  handleClose,
  isOpen,
}: TodoCreateDrawerProps) => {
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm transition duration-300 ease-in-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed top-0 right-0 h-full w-full md:w-120 bg-(--bg-primary) border-l-2 border-ink p-(--space-sm) flex justify-center items-center overflow-y-auto overflow-x-hidden transition duration-300 ease-in-out will-change-transform data-closed:translate-x-full"
      >
        <button onClick={handleClose} className="fixed right-2 top-3">
          <X className="md:w-14 md:h-14" />
        </button>
        <div className="w-full">
          <TodoCreateForm key={String(isOpen)} onClose={handleClose} />
        </div>
      </DialogPanel>
    </Dialog>
  );
};
