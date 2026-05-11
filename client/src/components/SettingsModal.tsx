import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { ChangePassForm } from "@/features/auth/components/ChangePassForm";
import { DeleteAccountSection } from "@/features/auth/components/DeleteAccountSection";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

interface SettingsProps {
  isOpen: boolean;
  handleClose: () => void;
}

type ActiveSection = "changePass" | "deleteAcc" | null;

export const SettingsModal = ({ isOpen, handleClose }: SettingsProps) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const { user } = useAuthStore();

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setActiveSection(null);
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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-[90%] md:w-100 h-fit flex flex-col gap-2 bg-(--bg-primary) border-2 border-ink rounded-xl 
    p-(--space-md) shadow-(--shadow-comic) 
    transition duration-300 ease-in-out
    data-closed:opacity-0 data-closed:scale-95"
      >
        <DialogTitle className="text-center text-2xl font-bold">
          Settings
        </DialogTitle>
        {user?.hasPassword ? (
          <>
            {" "}
            <ChangePassForm
              handleClose={handleClose}
              isExpanded={activeSection === "changePass"}
              onToggle={() =>
                setActiveSection((s) =>
                  s === "changePass" ? null : "changePass",
                )
              }
            />
            <hr />
          </>
        ) : null}

        <DeleteAccountSection
          isExpanded={activeSection === "deleteAcc"}
          onToggle={() =>
            setActiveSection((s) => (s === "deleteAcc" ? null : "deleteAcc"))
          }
        />
      </DialogPanel>
    </Dialog>
  );
};
