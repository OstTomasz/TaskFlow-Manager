import { z } from "zod";

export const ToDoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "crucial"]),
  status: z.enum(["todo", "in_progress", "done"]),
  creationDate: z.iso.datetime(),
  lastModifiedDate: z.iso.datetime(),
  completeDate: z.iso.datetime().optional(),
  badge: z.string().optional(),
  userId: z.string(),
});

export type Todo = z.infer<typeof ToDoSchema>;
