'use client'

import RedirectButton from "@/components/RedirectButton";
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {motion} from "motion/react";

export default function ClassNotFound() {
  return <motion.div
    initial={{opacity: 0.5, translateY: 10}}
    animate={{opacity: 1, translateY: 0}}
    transition={{duration: 0.2, ease: 'easeOut'}}>
    <Card className={"w-200"}>
      <CardHeader>
        <CardTitle>班级列表空空如也</CardTitle>
        <CardDescription>点击按钮去添加班级</CardDescription>
        <CardAction>
          <RedirectButton url={"/create-class"}>
            添加班级
          </RedirectButton>
        </CardAction>
      </CardHeader>
    </Card>
  </motion.div>
}