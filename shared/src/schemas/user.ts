import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  avatar: z.string().min(1),
  password: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
