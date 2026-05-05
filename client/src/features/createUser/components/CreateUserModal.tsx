import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CreateUserForm } from "./createUserForm";

interface CreateUserModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const CreateUserModal = ({
  isOpen,
  handleClose,
}: CreateUserModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        handleClose();
      }}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm
        transition duration-500 ease-in-out
        data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed w-[min(22rem,90vw)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-(--bg-primary) border-2 border-ink rounded-xl p-(--space-md) shadow-(--shadow-comic) transition duration-300 ease-in-out data-closed:opacity-0 data-closed:scale-95"
      >
        <DialogTitle className="flex justify-center">
          Introduce Yourself
        </DialogTitle>
        <CreateUserForm onSuccess={handleClose} />
      </DialogPanel>
    </Dialog>
  );
};
