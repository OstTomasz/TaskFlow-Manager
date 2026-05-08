import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangePasswordSchema, type ChangePassword } from "@taskflow/shared";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import { cn } from "@/lib/cn";

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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePassword>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onBlur",
  });

  const onSubmit = (data: ChangePassword) => {
    console.log(data);
    handleClose();
    reset();
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-1">
      <button
        type="button"
        onClick={() => {
          onToggle();
          reset();
        }}
        className="comic-btn flex flex-row"
      >
        Change Password
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <Loader className="animate-spin" /> Saving...
                </span>
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
