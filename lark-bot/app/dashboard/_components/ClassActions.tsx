"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Ellipsis, Trash, TriangleAlert} from "lucide-react";
import {deleteClass} from "@/app/dashboard/_utils/deleteClass";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {ClassItem} from "@/types/dashboard/fetchClassesResult";
import {useState} from "react";

export default function ClassActions(classItem: ClassItem) {
  const [open, setOpen] = useState(false);

  return <>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant={"ghost"}><Ellipsis /></Button>} />
        <DropdownMenuContent className={"w-40"} align={"start"}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant={"destructive"}
              onClick={() => {
                setOpen(true);
              }}>
              <Trash />
              删除班级
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size={"sm"}>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <TriangleAlert size={40}  />
            </AlertDialogMedia>
            <AlertDialogTitle>
              确定要删除 {classItem.class_name} 吗？
            </AlertDialogTitle>
            <AlertDialogDescription>
              此操作不可逆。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              variant={"destructive"}
              onClick={() => {
                setOpen(false);
                if (classItem.class_soft_id == null) return
                deleteClass(classItem.class_soft_id)
            }}>
              确定
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  </>
}
