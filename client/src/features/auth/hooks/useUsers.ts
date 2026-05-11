import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export const useUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/auth/users");
      return data.data;
    },

    staleTime: 1000 * 60 * 5, // 5min — user list changes rarely
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
