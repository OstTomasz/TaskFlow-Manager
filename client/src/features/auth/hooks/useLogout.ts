import { useAuthStore } from "@/features/auth/store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate("/");
    toast.success("Logged out");
  };
};
