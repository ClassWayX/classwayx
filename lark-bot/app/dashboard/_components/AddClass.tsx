"use client"

import RedirectButton from "@/components/RedirectButton";
import { motion } from "motion/react";

export default function AddClass() {
  return <motion.div
    initial={{opacity: 0, translateY: 10}}
    animate={{opacity: 1, translateY: 0}}
    transition={{duration: 0.2, ease: 'easeOut', delay: 0.05}}>
    <RedirectButton url={"/create-class"}>
      添加班级
    </RedirectButton>
  </motion.div>
}