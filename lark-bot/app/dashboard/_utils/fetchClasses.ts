import prisma from "@/lib/prisma";
import {FetchFailure, FetchSuccess} from "@/types/dashboard/fetchClassesResult";
import {Err, Ok, Result} from "@/types/result";

export async function fetchClasses(): Promise<Result<FetchSuccess, FetchFailure>> {
  try {
    const res = await prisma.class.findMany({
      select: {
        class_name: true,
        class_soft_id: true,
        created_at: true,
      },
      where: {
        deleted_at: null
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return Ok(res);
  } catch (e) {
    return Err((e as Error).message);
  }
}