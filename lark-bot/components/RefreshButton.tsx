'use client'

import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

type RefreshButtonProps = {
  children: string;
}

export default function RefreshButton({ children }: RefreshButtonProps) {
  const router = useRouter();
  const onClick = () => {
    router.refresh()
  }

  return <Button onClick={onClick}>
    {children}
  </Button>
}