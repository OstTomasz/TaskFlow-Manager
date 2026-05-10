import type { Request, Response } from "express";
import { wrapAsync } from "@/utils/wrapAsync";
import { AppError } from "@/utils/appError";
import { CreateTodoSchema, EditTodoSchema } from "@taskflow/shared";
import {
  getUserTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "./todos.service";

export const getTodos = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const todos = await getUserTodos(req.user.userId);
  res.json({ status: "success", data: todos, message: "Todos fetched" });
});

export const addTodo = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const parsed = CreateTodoSchema.parse(req.body);
  const todo = await createTodo(parsed, req.user.userId);
  res
    .status(201)
    .json({ status: "success", data: todo, message: "Todo created" });
});

export const editTodo = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  const parsed = EditTodoSchema.parse(req.body);
  const todo = await updateTodo(req.params.id, req.user.userId, parsed);
  res.json({ status: "success", data: todo, message: "Todo updated" });
});

export const removeTodo = wrapAsync(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Unauthorized", 401);
  await deleteTodo(req.params.id, req.user.userId);
  res.json({ status: "success", data: null, message: "Todo deleted" });
});
