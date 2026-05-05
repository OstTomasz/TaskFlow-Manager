import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import { type TodoFiltersProps } from "../utils/todoFilters.utils";
import { TodoFilters } from "./TodoFilters";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const TodoFilterDrawer = ({
  handleClose,
  isOpen,
  ...filterProps
}: TodoFiltersProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm transition duration-300 ease-in-out data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed top-0 right-0 h-full w-full md:w-fit bg-(--bg-primary) border-l-2 border-ink p-(--space-sm) flex justify-center items-center overflow-y-auto overflow-x-hidden transition duration-300 ease-in-out will-change-transform data-closed:translate-x-full"
      >
        <button onClick={handleClose} className="fixed right-2 top-3">
          <X />
        </button>
        <div className="h-100 flex flex-col">
          <TodoFilters {...filterProps} layout={isMobile ? "col" : "row"} />
        </div>
      </DialogPanel>
    </Dialog>
  );
};
