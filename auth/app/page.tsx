import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";

import { buttonVariants } from "@/components/ui/button";
import { getAuth } from "@/lib/auth";

/**
 * 渲染 Auth 首页。
 *
 * 读取了 Headers，所以需要在 <Suspense /> 内渲染。
 */
async function HomeSession() {
  const requestHeaders = await headers();
  const session = await getAuth().api.getSession({ headers: requestHeaders });

  if (session) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        已登录为{" "}
        <strong className="text-foreground">
          {session.user.username ?? session.user.name}
        </strong>
      </p>
    );
  }

  return (
    <div className="flex justify-center gap-3">
      <Link className={buttonVariants({ size: "lg" })} href="/sign-in">
        登录
      </Link>
      <Link className={buttonVariants({ size: "lg", variant: "outline" })} href="/sign-up">
        注册
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-5 px-6 py-12">
      <h1 className="text-2xl font-bold w-full text-center">Auth</h1>
      <Suspense fallback={null}>
        <HomeSession />
      </Suspense>
    </main>
  );
}
