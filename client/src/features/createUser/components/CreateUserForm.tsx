import { zodResolver } from "@hookform/resolvers/zod";

import { Loader } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { cn } from "@/lib/cn";
import { CreateUserSchema, type CreateUser } from "@taskflow/shared";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { avatars, type AvatarId } from "@/constants";
import { AvatarsGallery } from "@/components";

interface CreateUserFormProps {
  onSuccess: (data: CreateUser) => Promise<void> | void;
}

export const CreateUserForm = ({ onSuccess }: CreateUserFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateUser>({
    defaultValues: {
      name: "",
      avatar: avatars[0].id,
      passwordProtected: false,
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(CreateUserSchema),
    mode: "onBlur",
    shouldUnregister: false,
  });

  const isPasswordProtected = useWatch({
    control,
    name: "passwordProtected",
    defaultValue: false,
  });

  const { mutateAsync: registerUser } = useRegister();

  const onSubmit = async (data: CreateUser) => {
    await registerUser(data);
    await onSuccess(data);
    reset();
  };
  const onError = (errors: unknown) => console.log("errors:", errors);
  return (
    <form
      className="mt-2 flex flex-col justify-center"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <Controller
        name="avatar"
        control={control}
        render={({ field }) => (
          <AvatarsGallery
            selected={field.value as AvatarId}
            onSelect={(id) => field.onChange(id)}
          />
        )}
      />
      <input
        {...register("name")}
        type="text"
        placeholder="name"
        className="comic-input"
      />
      <p className="error-message">{errors.name?.message}</p>

      <div className="my-2">
        <label className="comic-checkbox-container flex items-center gap-1 cursor-pointer w-fit">
          <input
            {...register("passwordProtected", {
              onChange: (e) => {
                if (!e.target.checked) {
                  setValue("password", "");
                  setValue("confirmPassword", "");
                  clearErrors(["password", "confirmPassword"]);
                }
              },
            })}
            type="checkbox"
            className="comic-checkbox"
          />
          <span className="font-bold text-sm mt-1">
            Do you want to be protected?
          </span>
        </label>
      </div>

      <input
        {...register("password")}
        type="password"
        placeholder="password"
        className={cn(
          "comic-input",
          !isPasswordProtected ? "opacity-30 cursor-not-allowed" : "",
        )}
        readOnly={!isPasswordProtected}
      />
      <p className="error-message">{errors.password?.message}</p>
      <input
        {...register("confirmPassword")}
        type="password"
        placeholder="confirm password"
        className={cn(
          "comic-input",
          !isPasswordProtected ? "opacity-30 cursor-not-allowed" : "",
        )}
        readOnly={!isPasswordProtected}
      />
      <p className="error-message">{errors.confirmPassword?.message}</p>

      <button
        type="submit"
        className="comic-btn comic-btn-primary mx-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          "Create"
        )}
      </button>
    </form>
  );
};
