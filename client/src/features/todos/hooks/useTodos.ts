import { useAuthStore } from "@/features/auth/store/authStore";
import { useQuery } from "@tanstack/react-query";
import type { Todo } from "@taskflow/shared";
import { api } from "@/lib/axios";

/** Returns todos for the currently authenticated user. */
export const useTodos = () => {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";

  const query = useQuery({
    queryKey: ["todos", userId],
    queryFn: async (): Promise<Todo[]> => {
      const { data } = await api.get("/todos");
      return data.data;
    },
    enabled: !!userId, // don't fetch if not logged in
    staleTime: 0,
  });

  return {
    todos: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};
