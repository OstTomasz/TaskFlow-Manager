import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import {
  getUsers,
  register,
  login,
  refresh,
  logout,
  updatePassword,
  removeUser,
} from "./auth.controller";

export const authRouter = Router();

// Public routes
authRouter.get("/users", getUsers);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);

// Protected routes — require valid access token
authRouter.patch("/password", authenticate, updatePassword);
authRouter.delete("/user", authenticate, removeUser);
