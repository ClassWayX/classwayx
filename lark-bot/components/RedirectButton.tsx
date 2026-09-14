'use client'

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

type RedirectButtonProps = {
  children: string;
  url: string;
}

export default function RedirectButton({ url, children }: RedirectButtonProps) {
  const router = useRouter();
  const onClick = (url: string) => {
    router.push(url)
  }

  return <Button onClick={() => onClick(url)}>
    {children}
  </Button>
}