import { z } from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.string().min(1),
  password: z.string().default(""),
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

export const CreateUserSchema = UserSchema.omit({ id: true })
  .extend({
    passwordProtected: z.boolean(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.passwordProtected) {
      if (!data.password || data.password.length < 4) {
        ctx.addIssue({
          code: "custom",
          message: "Password must be at least 4 characters",
          path: ["password"],
        });
      }
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type CreateUser = z.infer<typeof CreateUserSchema>;

export const DeleteUserSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters"),
});
export type DeleteUser = z.infer<typeof DeleteUserSchema>;
