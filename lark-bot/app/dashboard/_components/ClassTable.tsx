'use client'

import {ClassItem} from "@/types/dashboard/fetchClassesResult";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {convertDateToChinese} from "@/utils/convertDateToChinese";
import ClassActions from "@/app/dashboard/_components/ClassActions";
import { motion } from "motion/react";


export default function ClassTable(props: { classItems: ClassItem[] }) {
  return <motion.div
    initial={{opacity: 0.5, translateY: 10}}
    animate={{opacity: 1, translateY: 0}}
    transition={{duration: 0.2, ease: 'easeOut'}}>
    <Table className={"w-full flex flex-col items-center"}>
      <TableCaption>
        班级列表
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className={"w-60"}>班级名称</TableHead>
          <TableHead className={"w-40"}>班级 ID</TableHead>
          <TableHead className={"w-60"}>班级创建时间</TableHead>
          <TableHead className={"w-20 text-center"}>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.classItems.map(item => (
          <TableRow key={item.class_soft_id}>
            <TableCell className={"w-60"}>{item.class_name}</TableCell>
            <TableCell className={"w-40"}>{item.class_soft_id}</TableCell>
            <TableCell className={"w-60"}>{convertDateToChinese(item.created_at)}</TableCell>
            <TableCell className={"w-20 text-center"}>
              <ClassActions classItem={item}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </motion.div>

}