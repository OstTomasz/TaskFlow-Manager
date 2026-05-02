import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, type ChangePassword } from "@taskflow/shared";

interface SettingsProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const SettingsModal = ({ isOpen, handleClose }: SettingsProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: ChangePassword) => {
    console.log(data);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-ink/30 backdrop-blur-sm
        transition duration-500 ease-in-out
        data-closed:opacity-0"
      />
      <DialogPanel
        transition
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
    w-80 bg-(--bg-primary) border-2 border-ink rounded-xl 
    p-(--space-md) shadow-(--shadow-comic) 
    transition duration-300 ease-in-out
    data-closed:opacity-0 data-closed:scale-95"
      >
        <DialogTitle className="text-center text-2xl font-bold mb-(--space-sm)">
          Settings
        </DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-(--space-sm)"
        >
          <input
            {...register("currentPassword")}
            type="password"
            placeholder="Current password"
            className="comic-input"
          />
          <p className="text-sm text-error min-h-[1.2rem]">
            {errors.currentPassword?.message}
          </p>

          <input
            {...register("newPassword")}
            type="password"
            placeholder="New password"
            className="comic-input"
          />
          <p className="text-sm text-error min-h-[1.2rem]">
            {errors.newPassword?.message}
          </p>

          <input
            {...register("confirmNewPassword")}
            type="password"
            placeholder="Confirm new password"
            className="comic-input"
          />
          <p className="text-sm text-error min-h-[1.2rem]">
            {errors.confirmNewPassword?.message}
          </p>

          <button type="submit" className="comic-btn comic-btn-primary">
            Save
          </button>
        </form>
      </DialogPanel>
    </Dialog>
  );
};
