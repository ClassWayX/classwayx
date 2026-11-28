"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { MIN_PASSWORD_LENGTH, signInSchema, signUpSchema } from "@/utils/auth-validation";

type Credentials = z.infer<typeof signUpSchema>;

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: { username: "", password: "" },
  });

  async function submit(credentials: Credentials) {
    const fallback = isSignUp
      ? "暂时无法注册，请稍后重试。"
      : "暂时无法登录，请稍后重试。";

    try {
      const { error } = isSignUp
        ? await authClient.signUp.username(credentials)
        : await authClient.signIn.username(credentials);

      if (!error) {
        window.location.replace("/");
        return;
      }

      if (isSignUp && error.code === "USERNAME_IS_ALREADY_TAKEN") {
        setError("username", { message: "这个用户名已被使用。" }, { shouldFocus: true });
        return;
      }

      if (!isSignUp && error.status === 401) {
        setError("root", { message: "用户名或密码不正确。" });
        return;
      }

      setError("root", {
        message: error.status === 429 ? "尝试次数过多，请稍后重试。" : fallback,
      });
    } catch {
      setError("root", { message: fallback });
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <section aria-labelledby="auth-title" className="flex w-full max-w-sm flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">ClassWayX</p>
          <h1 id="auth-title" className="text-2xl font-semibold">
            {isSignUp ? "创建账号" : "登录"}
          </h1>
        </header>

        <form method="post" onSubmit={handleSubmit(submit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.username}>
              <FieldLabel htmlFor="username">用户名</FieldLabel>
              <Input
                {...register("username")}
                id="username"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? "username-error" : isSignUp ? "username-hint" : undefined
                }
              />
              {errors.username ? (
                <FieldError id="username-error" errors={[errors.username]} />
              ) : isSignUp && (
                <FieldDescription id="username-hint">
                  3–30 个字符，可用英文字母、数字、下划线和点。
                </FieldDescription>
              )}
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">密码</FieldLabel>
              <Input
                {...register("password")}
                id="password"
                type="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : isSignUp ? "password-hint" : undefined
                }
              />
              {errors.password ? (
                <FieldError id="password-error" errors={[errors.password]} />
              ) : isSignUp && (
                <FieldDescription id="password-hint">
                  至少 {MIN_PASSWORD_LENGTH} 个字符。
                </FieldDescription>
              )}
            </Field>

            {errors.root?.message && <FieldError>{errors.root.message}</FieldError>}

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "正在提交…" : isSignUp ? "注册" : "登录"}
            </Button>
          </FieldGroup>
        </form>

        <p className="flex justify-center gap-2 text-sm text-muted-foreground">
          {isSignUp ? "已有账号？" : "还没有账号？"}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-medium text-foreground underline underline-offset-4"
          >
            {isSignUp ? "去登录" : "去注册"}
          </Link>
        </p>
      </section>
    </main>
  );
}
