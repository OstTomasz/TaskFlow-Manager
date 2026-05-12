import { TodoModel, type ITodo } from "./todos.model";
import { AppError } from "../../utils/appError";
import type { CreateTodoValues, EditTodoValues } from "@taskflow/shared";

/**
 * Resolves completeDate based on status transition:
 * - status → "done": set current timestamp
 * - status → anything else: clear completeDate
 */
const resolveCompleteDate = (
  status: ITodo["status"],
  existing?: Date | null,
): Date | null => {
  if (status === "done") return existing ?? new Date();
  return null;
};

/** Returns all todos belonging to a specific user. */
export const getUserTodos = async (userId: string): Promise<ITodo[]> =>
  TodoModel.find({ userId }).sort({ creationDate: -1 });

/** Returns a single todo — throws if not found or belongs to different user. */
export const getTodoById = async (
  todoId: string,
  userId: string,
): Promise<ITodo> => {
  const todo = await TodoModel.findOne({ _id: todoId, userId });
  if (!todo) throw new AppError("Todo not found", 404);
  return todo;
};

/** Creates a new todo for the authenticated user. */
export const createTodo = async (
  data: CreateTodoValues,
  userId: string,
): Promise<ITodo> => {
  const completeDate = resolveCompleteDate(data.status);
  return TodoModel.create({ ...data, userId, completeDate });
};

/**
 * Updates a todo — ownership verified before update.
 * Handles completeDate transition automatically.
 */
export const updateTodo = async (
  todoId: string,
  userId: string,
  data: EditTodoValues,
): Promise<ITodo> => {
  const existing = await getTodoById(todoId, userId);

  const completeDate = resolveCompleteDate(data.status, existing.completeDate);

  const updated = await TodoModel.findByIdAndUpdate(
    todoId,
    { ...data, completeDate },
    {
      new: true, // return updated document
      runValidators: true, // run Schema validators on update
    },
  );

  if (!updated) throw new AppError("Todo not found", 404);
  return updated;
};

/** Deletes a todo — ownership verified before delete. */
export const deleteTodo = async (
  todoId: string,
  userId: string,
): Promise<void> => {
  const result = await TodoModel.findOneAndDelete({ _id: todoId, userId });
  if (!result) throw new AppError("Todo not found", 404);
};

/** Deletes all todos belonging to a user — used on account deletion. */
export const deleteUserTodos = async (userId: string): Promise<void> => {
  await TodoModel.deleteMany({ userId });
};
