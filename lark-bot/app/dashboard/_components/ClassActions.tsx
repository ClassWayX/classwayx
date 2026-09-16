"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Ellipsis, Trash} from "lucide-react";
import {deleteClass} from "@/app/dashboard/_utils/deleteClass";

export default function ClassActions({classSoftId}: { classSoftId: number | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant={"ghost"}><Ellipsis /></Button>} />
      <DropdownMenuContent className={"w-40"} align={"start"}>
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant={"destructive"}
            onClick={() => {
              if (classSoftId == null) return
              deleteClass(classSoftId)
            }}>
            <Trash />
            删除班级
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
