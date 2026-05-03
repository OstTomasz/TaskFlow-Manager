import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { LoginSchema, type Login, type User } from "@taskflow/shared";
import { avatars } from "@/constants";
import { cn } from "@/lib/cn";

export const UserCard = ({ user }: { user: User }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shaking, setShaking] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
  });

  const handleUserClick = () =>
    user.password === undefined ? navigate("/todos") : setIsExpanded(true);

  const handleLogin = (data: Login) => {
    if (data.password !== user.password) {
      setError("password", { message: "Invalid password" });
      setShaking(true);
      return;
    }
    navigate("/todos");
  };

  const avatarIcon = avatars.find((a) => a.id === user.avatar)?.icon;

  return (
    <div
      onClick={handleUserClick}
      className={cn("cursor-pointer comic-card", shaking && "animate-shake")}
      onAnimationEnd={() => setShaking(false)}
    >
      <div>
        <svg className="w-20 h-20" viewBox="0 0 150 150">
          <use href={avatarIcon} />
        </svg>
        <h3 className="text-center text-2xl font-bold mb-(--space-sm)">
          {user.name}
        </h3>
        {isExpanded ? (
          <form
            onSubmit={handleSubmit(handleLogin)}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              {...register("password")}
              autoFocus
              placeholder="enter password"
              type="password"
              className="comic-input"
            ></input>
            <p className="text-sm text-error min-h-[1.2rem]">
              {errors.password?.message}
            </p>
            <button
              type="submit"
              className="comic-btn comic-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <Loader className="animate-spin" /> Logging..
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};
