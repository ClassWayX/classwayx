'use server'

import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export async function deleteClass (classSoftId: number): Promise<void> {
  await prisma.class.update({
    where: {
      class_soft_id: classSoftId,
    },
    data: {
      class_soft_id: null,
      deleted_at: new Date()
    }
  });
  revalidatePath("/dashboard")
}