import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateUser } from "@taskflow/shared";
import { toast } from "sonner";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateUser) => {
      const { data } = await api.post("/auth/register", values);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Account created");
    },
    onError: () => toast.error("Failed to create account"),
  });
};
