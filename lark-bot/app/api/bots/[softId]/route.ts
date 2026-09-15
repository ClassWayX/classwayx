import {NextRequest, NextResponse} from "next/server";
import BotPostBody from "@/types/api/bots/BotPostBody";
import {ZodError} from "zod";
import prisma from "@/lib/prisma";

// FIXME: 代码质量堪忧
export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{
      softId: string
    }>
  }
) {
  const { softId } = await context.params;
  const body = await request.json();

  let parsedBody;
  try {
    parsedBody = BotPostBody.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({
        code: "BAD_REQUEST_BODY",
        message: "请求体格式错误。",
        data: null,
        details: JSON.parse(error.message)
      }, {
        status: 400
      })
    } else {
      throw error;
    }
  }

  const databaseQueryResult = await prisma.class.findUnique({
    where: {
      class_soft_id: Number(softId),
    },
    select: {
      push_urls: true
    }
  });

  if (!databaseQueryResult) {
    return NextResponse.json({
      code: "CLASS_ID_NOT_FOUND",
      message: "班级 id 不存在。",
      data: null,
    }, {
      status: 404
    })
  }

  let failureCount = 0;
  const failureDetails: Array<{
    failedUrl: string,
    details: object,
  }> = [];

  for (const url of databaseQueryResult.push_urls) {
    // FIXME 可以并发
    const fetchResponse = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        msg_type: "text",
        content: {
          text: parsedBody.message,
        },
      }),
    });
    let responseJson;
    try {
      responseJson = await fetchResponse.json();
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      responseJson = {
        message: "该响应体不是预期的 json 格式"
      }
    }
    if (fetchResponse.ok) {
      if (responseJson["code"] !== 0) {
        failureCount += 1;
        failureDetails.push(responseJson);
      }
    } else {
      failureCount += 1;
      failureDetails.push(responseJson);
    }
  }

  return NextResponse.json({
    code: "SUCCESS",
    menubar: `已向 ${databaseQueryResult.push_urls.length} 个 url 推送消息，有 ${failureCount} 个失败。`,
    data: {
      failureCount,
      failureDetails,
    }
  });
}