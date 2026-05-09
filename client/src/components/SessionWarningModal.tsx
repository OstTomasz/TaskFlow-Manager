import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AlertTriangle } from "lucide-react";

interface SessionWarningModalProps {
  isOpen: boolean;
  secondsLeft: number;
}

export const SessionWarningModal = ({
  isOpen,
  secondsLeft,
}: SessionWarningModalProps) => {
  return (
    <Dialog open={isOpen} onClose={() => {}}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm
      transition duration-300 ease-in-out
      data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-[90%] md:w-100 h-fit flex flex-col gap-2 bg-(--bg-primary) border-2 border-ink rounded-xl 
    p-(--space-md) shadow-(--shadow-comic) 
    transition duration-300 ease-in-out
    data-closed:opacity-0 data-closed:scale-95"
      >
        <DialogTitle className="flex flex-row gap-2 items-center justify-center text-2xl font-bold">
          <AlertTriangle size={50} /> Session will expire in {secondsLeft}{" "}
          seconds.
        </DialogTitle>
      </DialogPanel>
    </Dialog>
  );
};
