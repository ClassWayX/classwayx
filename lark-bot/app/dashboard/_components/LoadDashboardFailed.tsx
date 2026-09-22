'use client'

import RefreshButton from "@/components/RefreshButton";
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {motion} from "motion/react";

export default function LoadDashboardFailed() {
  return <motion.div
    initial={{opacity: 0.5, translateY: 10}}
    animate={{opacity: 1, translateY: 0}}
    transition={{duration: 0.2, ease: 'easeOut'}}>
    <Card className={"w-200"}>
      <CardHeader>
        <CardTitle>数据加载失败</CardTitle>
        <CardDescription>请刷新重试。如果问题持续存在，请联系管理员。</CardDescription>
        <CardAction>
          <RefreshButton>
            重试
          </RefreshButton>
        </CardAction>
      </CardHeader>
    </Card>
  </motion.div>
}