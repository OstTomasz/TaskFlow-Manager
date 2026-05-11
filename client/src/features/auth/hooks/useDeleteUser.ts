import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (password?: string) => {
      await api.delete("/auth/user", { data: { password } });
    },
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Account deleted");
    },
    onError: () => toast.error("Failed to delete account"),
  });
};
