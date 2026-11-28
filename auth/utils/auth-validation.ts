import { z } from "zod";

export const MIN_PASSWORD_LENGTH = 12;

const usernameSchema = z
  .string()
  .trim()
  .min(3, "用户名至少需要 3 个字符")
  .max(30, "用户名最多可以有 30 个字符")
  .regex(/^[a-zA-Z0-9_.]+$/, "用户名只能包含英文字母、数字、下划线和点");

const passwordSchema = z.string().max(128, "密码最多可以有 128 个字符");

export const signInSchema = z.strictObject({
  username: usernameSchema,
  password: passwordSchema.min(1, "请输入密码"),
});

export const signUpSchema = z.strictObject({
  username: usernameSchema,
  password: passwordSchema.min(
    MIN_PASSWORD_LENGTH,
    `密码至少需要 ${MIN_PASSWORD_LENGTH} 个字符`,
  ),
});
