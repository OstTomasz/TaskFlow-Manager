import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import { ChangePasswordSchema, type ChangePassword } from "@taskflow/shared";
import { cn } from "@/lib/cn";
import { useChangePassword } from "../hooks/useChangePassword";

interface ChangePassFormProps {
  handleClose: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ChangePassForm = ({
  handleClose,
  isExpanded,
  onToggle,
}: ChangePassFormProps) => {
  const { mutateAsync: changePassword } = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "all",
  });
  const onSubmit = async (data: ChangePassword) => {
    try {
      await changePassword(data);
      handleClose();
      reset();
    } catch {
      setError("currentPassword", { message: "Current password is incorrect" });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-1">
      <button
        type="button"
        onClick={() => {
          onToggle();
          reset();
        }}
        className="comic-btn w-50"
      >
        <span>Change Password</span>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      <div
        className={cn(
          "w-full grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="w-full overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col"
            name="Change Password"
          >
            <input
              {...register("currentPassword")}
              type="password"
              placeholder="Current password"
              className="comic-input"
            />
            <p className="error-message">{errors.currentPassword?.message}</p>

            <input
              {...register("newPassword")}
              type="password"
              placeholder="New password"
              className="comic-input"
            />
            <p className="error-message">{errors.newPassword?.message}</p>

            <input
              {...register("confirmNewPassword")}
              type="password"
              placeholder="Confirm new password"
              className="comic-input"
            />
            <p className="error-message">
              {errors.confirmNewPassword?.message}
            </p>

            <button
              type="submit"
              className="w-fit comic-btn comic-btn-primary mx-auto"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
