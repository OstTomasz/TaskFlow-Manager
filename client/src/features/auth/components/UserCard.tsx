import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { LoginSchema, type Login, type User } from "@taskflow/shared";
import { avatars } from "@/constants";
import { cn } from "@/lib/cn";
import { useAuthStore } from "../store/authStore";

export const UserCard = ({ user }: { user: User }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shaking, setShaking] = useState(false);
  const { setUser } = useAuthStore();
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

  const handleUserClick = () => {
    if (user.password === undefined) {
      setUser(user);
      navigate("/todos");
    } else {
      setIsExpanded(true);
    }
  };

  const handleLogin = (data: Login) => {
    if (data.password !== user.password) {
      setError("password", { message: "Invalid password" });
      setShaking(true);
      return;
    }
    setUser(user);
    navigate("/todos");
  };

  const avatarIcon = avatars.find((a) => a.id === user.avatar)?.icon;

  const passwordRef = useRef<HTMLInputElement>(null);
  const { ref, ...rest } = register("password");

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => passwordRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  return (
    <li
      onClick={handleUserClick}
      className={cn("comic-card", shaking && "animate-shake")}
      onAnimationEnd={() => setShaking(false)}
    >
      <svg
        className={cn(
          "w-30 h-30 transition-all duration-500 shrink-0 mb-(--space-sm)",
          isExpanded
            ? "-translate-y-full opacity-0 -mt-30"
            : "translate-y-0 opacity-100 mt-0",
        )}
        viewBox="0 0 150 150"
      >
        <use href={avatarIcon} />
      </svg>

      <h3
        className={cn(
          "text-center text-3xl font-bold transition-all duration-500",
          isExpanded ? "-translate-y-1.5" : "translate-y-0 my-2",
        )}
      >
        {user.name}
      </h3>

      <form
        onSubmit={handleSubmit(handleLogin)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "flex flex-col w-full px-4 transition-all duration-500",
          isExpanded
            ? "translate-y-5 opacity-100"
            : "translate-y-full opacity-0",
        )}
      >
        <input
          {...rest}
          placeholder="enter password"
          ref={(el) => {
            ref(el);
            passwordRef.current = el;
          }}
          type="password"
          className="comic-input"
        />
        <p className="error-message">{errors.password?.message}</p>
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
    </li>
  );
};
