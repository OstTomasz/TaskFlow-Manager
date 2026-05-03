import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
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
  id: uuidv4(),
  name: `User ${i + 1}`,
  avatar: AVATAR_IDS[i],
  password: i < 5 ? `pass${i + 1}` : undefined,
}));

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => Promise.resolve(MOCK_USERS),
    staleTime: Infinity,
  });
};
