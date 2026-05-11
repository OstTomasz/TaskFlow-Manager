import type { CreateTodoValues, EditTodoValues, Todo } from "@taskflow/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useTodoMutations = () => {
  const { user } = useAuthStore();
  const userId = user?.id ?? "";
  const queryClient = useQueryClient();

  const createTodo = useMutation({
    mutationFn: async (values: CreateTodoValues): Promise<Todo> => {
      const { data } = await api.post("/todos", values);
      return data.data;
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
    onError: (_err, _values, context) => {
      queryClient.setQueryData(["todos", userId], context?.previous);
      toast.error("Failed to create task");
    },
    onSettled: (todo) => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      if (todo) toast.success(`"${todo.title}" created`);
    },
  });

  const updateTodo = useMutation({
    mutationFn: async (
      values: { id: string } & EditTodoValues,
    ): Promise<Todo> => {
      const { id, ...rest } = values;
      const { data } = await api.patch(`/todos/${id}`, rest);
      return data.data;
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
    onError: (_err, _values, context) => {
      queryClient.setQueryData(["todos", userId], context?.previous);
      toast.error("Failed to update task");
    },
    onSettled: (todo) => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
      if (todo) toast.success(`"${todo.title}" updated`);
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string): Promise<string> => {
      await api.delete(`/todos/${id}`);
      return id;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["todos", userId] });
      const previous = queryClient.getQueryData<Todo[]>(["todos", userId]);
      queryClient.setQueryData<Todo[]>(
        ["todos", userId],
        (old) => old?.filter((t) => t.id !== id) ?? [],
      );
      return { previous };
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
