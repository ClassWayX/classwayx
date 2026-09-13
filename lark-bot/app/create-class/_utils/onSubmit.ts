'use server'

import * as z from 'zod';
import createClassFormSchema from "@/types/create-class/createClassFormSchema";
import {unpackData} from "@/app/create-class/_utils/unpackData";
import prisma from "@/lib/prisma";
import {PrismaClientKnownRequestError} from "@/app/generated/prisma/internal/prismaNamespace";
import {Err, Ok, Result} from "@/types/result";
import {SubmitError, SubmitOk} from "@/types/create-class/formSubmitResult";

export async function onSubmit(data: z.infer<typeof createClassFormSchema>): Promise<Result<SubmitOk, SubmitError>> {
  const unpackedData = unpackData(data);
  try {
    await prisma.class.create({
      data: {
        class_soft_id: unpackedData.classSoftId,
        class_name: unpackedData.className,
        push_urls: unpackedData.pushUrls,
      }
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code == 'P2002') {
        // 这里只能是 classSoftId 冲突了，所以就不加以额外判断了
        return Err({
          reason: "UNIQUE_CONSTRAINT_FAILED",
          constraint: "classSoftId",
        });
      }
    }
  }
  return Ok("OK");
}