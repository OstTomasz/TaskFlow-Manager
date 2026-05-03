import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  avatar: z.string().min(1),
  password: z.string().min(4).optional(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  password: z.string(),
});

export type Login = z.infer<typeof LoginSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(4, "Password must be at least 4 characters"),
    newPassword: z.string().min(4, "Password must be at least 4 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
