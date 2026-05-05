import { z } from "zod";

export const ToDoSchema = z.object({
  id: z.uuid(),
  title: z
    .string()
    .min(10, "Tell me more about it")
    .max(100, "Describe it below"),
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

export const TodoFormSchema = ToDoSchema.pick({
  title: true,
  description: true,
  priority: true,
  status: true,
  badge: true,
});

export const CreateTodoSchema = TodoFormSchema.omit({ status: true });

export const EditTodoSchema = TodoFormSchema;

export type TodoFormValues = z.infer<typeof TodoFormSchema>;
export type CreateTodoValues = z.infer<typeof CreateTodoSchema>;
export type EditTodoValues = z.infer<typeof EditTodoSchema>;
