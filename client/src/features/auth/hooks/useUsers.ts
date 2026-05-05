import { useQuery } from "@tanstack/react-query";
import type { User } from "@taskflow/shared";
import type { AvatarId } from "@/constants";

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

const MOCK_USERS: User[] = Array.from({ length: 9 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  avatar: AVATAR_IDS[i],
  password: i < 5 ? `pass${i + 1}` : undefined,
}));

export const addMockUser = (user: User) => {
  MOCK_USERS.push(user);
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
