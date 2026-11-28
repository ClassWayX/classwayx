import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "注册 | ClassWayX" };

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}
