import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@taskflow/shared";
import type { AvatarId } from "@/constants";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

const AVATAR_IDS: AvatarId[] = [
  "Av-1",
  "Av-3",
  "Av-4",
  "Av-5",
  "Av-6",
  "Av-7",
  "Av-8",
  "Av-9",
  "Av-10",
];

export const MOCK_USERS: User[] = Array.from({ length: 9 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  avatar: AVATAR_IDS[i],
  password: i < 5 ? `pass${i + 1}` : undefined,
}));

export const addMockUser = (user: User) => {
  MOCK_USERS.push(user);
};

export const deleteMockUser = (id: string) => {
  const index = MOCK_USERS.findIndex((u) => u.id === id);
  if (index !== -1) MOCK_USERS.splice(index, 1);
};

export const useUsers = () => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => Promise.resolve([...MOCK_USERS]),
    staleTime: 0,
  });

  return {
    users: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
};

export const useDeleteUser = () => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password?: string) => {
      if (!user) return Promise.reject(new Error("Not logged in"));
      if (user.password && user.password !== password)
        return Promise.reject(new Error("Invalid password"));
      deleteMockUser(user.id);
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Account deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
};
