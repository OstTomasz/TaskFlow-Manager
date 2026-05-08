import type { CreateTodoValues, EditTodoValues, Todo } from "@taskflow/shared";
import { MOCK_TODOS } from "./useTodos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { toast } from "sonner";

export const addMockTodo = (todo: Todo) => {
  MOCK_TODOS.push(todo);
};
export const updateMockTodo = (updated: Todo) => {
  const index = MOCK_TODOS.findIndex((todo) => todo.id === updated.id);
  if (index !== -1)
    MOCK_TODOS[index] = {
      ...updated,
      lastModifiedDate: new Date().toISOString(),
    };
};
export const deleteMockTodo = (id: string) => {
  const index = MOCK_TODOS.findIndex((todo) => todo.id === id);
  if (index !== -1) MOCK_TODOS.splice(index, 1);
};

export const useTodoMutations = () => {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";
  const queryClient = useQueryClient();

  const createTodo = useMutation({
    mutationFn: (values: CreateTodoValues) => {
      const date = new Date().toISOString();

      const todo: Todo = {
        id: crypto.randomUUID(),
        userId,
        creationDate: date,
        lastModifiedDate: date,
        ...values,
      };
      addMockTodo(todo);
      return Promise.resolve(todo);
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });
      const previous = queryClient.getQueryData<Todo[]>(["todos", userId]);

      const optimisticTodo: Todo = {
        id: `temp-${Date.now()}`,
        userId,
        creationDate: new Date().toISOString(),
        lastModifiedDate: new Date().toISOString(),
        ...values,
      };

      queryClient.setQueryData<Todo[]>(["todos", userId], (old) => [
        optimisticTodo,
        ...(old ?? []),
      ]);

      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos", userId], context?.previous);
      toast.error("Failed to create task");
    },
    onSettled: (todo) => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      if (todo) toast.success(`"${todo.title}" created`);
    },
  });

  const updateTodo = useMutation({
    mutationFn: (values: { id: string } & EditTodoValues) => {
      const existing = MOCK_TODOS.find((t) => t.id === values.id);
      if (!existing) return Promise.reject(new Error("Todo not found"));

      const todo: Todo = {
        ...existing,
        ...values,
        lastModifiedDate: new Date().toISOString(),
      };
      updateMockTodo(todo);
      return Promise.resolve(todo);
    },
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });
      const previous = queryClient.getQueryData<Todo[]>(["todos", userId]);

      queryClient.setQueryData<Todo[]>(
        ["todos", userId],
        (old) =>
          old?.map((t) =>
            t.id === values.id
              ? { ...t, ...values, lastModifiedDate: new Date().toISOString() }
              : t,
          ) ?? [],
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos", userId], context?.previous);
      toast.error("Failed to update task");
    },
    onSettled: (todo) => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      if (todo) toast.success(`"${todo.title}" updated`);
    },
  });
  const deleteTodo = useMutation({
    mutationFn: (id: string) => {
      const exists = MOCK_TODOS.some((t) => t.id === id);
      if (!exists) return Promise.reject(new Error("Todo not found"));
      deleteMockTodo(id);
      return Promise.resolve(id);
    },
    // optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });
      const previous = queryClient.getQueryData<Todo[]>(["todos", userId]);
      queryClient.setQueryData<Todo[]>(
        ["todos", userId],
        (old) => old?.filter((t) => t.id !== id) ?? [],
      );
      return { previous }; // context for onError
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["todos", userId], context?.previous);
      toast.error("Failed to delete task");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      toast.success("Task deleted");
    },
  });

  return { createTodo, updateTodo, deleteTodo };
};
