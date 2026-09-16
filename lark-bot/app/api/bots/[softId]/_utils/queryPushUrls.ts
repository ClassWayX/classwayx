import {NextResponse} from "next/server";
import {Err, Ok, Result} from "@/types/result";
import prisma from "@/lib/prisma";

export type queryPushUrlsSuccess = { push_urls: string[] }
export type queryPushUrlsFailure = NextResponse

export async function queryPushUrls(classSoftId: number): Promise<Result<queryPushUrlsSuccess, queryPushUrlsFailure>> {
  const databaseQueryResult = await prisma.class.findUnique({
    where: {
      class_soft_id: classSoftId,
    },
    select: {
      push_urls: true
    }
  });

  if (!databaseQueryResult) {
    return Err(NextResponse.json({
      code: "CLASS_ID_NOT_FOUND",
      message: "班级 id 不存在。",
      data: null,
    }, {
      status: 404
    }))
  }

  return Ok(databaseQueryResult);
}