import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "登录 | ClassWayX" };

export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
