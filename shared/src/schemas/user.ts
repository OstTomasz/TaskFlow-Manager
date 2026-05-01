import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  password: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
