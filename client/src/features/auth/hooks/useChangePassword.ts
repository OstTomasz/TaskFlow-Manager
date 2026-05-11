import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import type { ChangePassword } from "@taskflow/shared";

export const useChangePassword = () =>
  useMutation({
    mutationFn: async (values: ChangePassword) => {
      await api.patch("/auth/password", values);
    },
    onSuccess: () => toast.success("Password changed"),
    throwOnError: false,
  });
