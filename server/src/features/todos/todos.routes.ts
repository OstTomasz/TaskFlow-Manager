import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { getTodos, addTodo, editTodo, removeTodo } from "./todos.controller";

export const todosRouter = Router();

/**
 * All todo routes are protected — authenticate middleware
 * runs before every handler in this router.
 */
todosRouter.use(authenticate);

todosRouter.get("/", getTodos);
todosRouter.post("/", addTodo);
todosRouter.patch("/:id", editTodo);
todosRouter.delete("/:id", removeTodo);
