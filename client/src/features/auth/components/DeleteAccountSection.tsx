import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader } from "lucide-react";
import { useDeleteUser } from "../hooks/useUsers";
import { useAuthStore } from "../store/authStore";
import { DeleteUserSchema, type DeleteUser } from "@taskflow/shared";
import { cn } from "@/lib/cn";

interface DeleteAccountSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export const DeleteAccountSection = ({
  isExpanded,
  onToggle,
}: DeleteAccountSectionProps) => {
  const { user } = useAuthStore();
  const deleteUser = useDeleteUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<DeleteUser>({
    resolver: user?.password ? zodResolver(DeleteUserSchema) : undefined,
    mode: "onSubmit",
  });

  if (!user) return null;

  const onSubmit = async (data: DeleteUser) => {
    try {
      await deleteUser.mutateAsync(user?.password ? data.password : undefined);
      reset();
    } catch {
      setError("password", { message: "Invalid password" });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          onToggle();
          reset();
        }}
        className="w-50 comic-btn mx-auto"
      >
        {isExpanded ? (
          <>
            <span>Cancel</span>
            <ChevronUp />
          </>
        ) : (
          <>
            <span>Delete account</span>
            <ChevronDown />
          </>
        )}
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center"
          >
            {user.password ? (
              <label>
                <p>Provide password do confirm</p>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="ener password"
                  className="comic-input"
                ></input>
                <p className="error-message">{errors.password?.message}</p>
              </label>
            ) : (
              <p>Are you sure about this?</p>
            )}
            <button
              type="submit"
              className="comic-btn mx-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" /> <span>Deleting...</span>
                </>
              ) : (
                "Confirm"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
