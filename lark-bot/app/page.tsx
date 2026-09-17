'use client'

import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard")
  }, [router]);

  return <h1>正在跳转到控制台……</h1>
}
