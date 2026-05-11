import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useLogin = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      userId,
      password,
    }: {
      userId: string;
      password: string;
    }) => {
      const { data } = await api.post("/auth/login", { userId, password });
      return data.data as {
        user: { id: string; name: string; avatar: string };
        accessToken: string;
      };
    },
    onSuccess: ({ user, accessToken }) => {
      setUser(user, accessToken);
    },
    onError: () => toast.error("Invalid password"),
  });
};
