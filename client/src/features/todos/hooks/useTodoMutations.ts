import type { CreateTodoValues, EditTodoValues, Todo } from "@taskflow/shared";
import { MOCK_TODOS } from "./useTodos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/authStore";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });
  const deleteTodo = useMutation({
    mutationFn: (id: string) => {
      const exists = MOCK_TODOS.some((t) => t.id === id);
      if (!exists) return Promise.reject(new Error("Todo not found"));
      deleteMockTodo(id);
      return Promise.resolve(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", userId] });
    },
  });

  return { createTodo, updateTodo, deleteTodo };
};
