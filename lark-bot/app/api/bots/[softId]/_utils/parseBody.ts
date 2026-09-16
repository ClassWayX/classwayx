import * as z from "zod";
import BotPostBody from "@/types/api/bots/BotPostBody";
import {NextResponse} from "next/server";
import {Err, Ok, Result} from "@/types/result";
import {ZodError} from "zod";

export type ParseBodySuccess = z.infer<typeof BotPostBody>;
export type ParseBodyFailure = NextResponse

/**
 * 解析请求体
 *
 * @param body 请求发来的请求体
 * @return
 * 如果返回值的 `ok` 属性为假，则直接把 `error` 属性返回。
 * `error` 属性是一个包装好的 `NextResponse`，包含了错误信息和状态码。
 */
export function parseBody(body: unknown): Result<ParseBodySuccess, ParseBodyFailure> {
  let parsedBody;
  try {
    parsedBody = BotPostBody.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      return Err(NextResponse.json({
        code: "BAD_REQUEST_BODY",
        message: "请求体格式错误。",
        data: null,
        details: JSON.parse(error.message)
      }, {
        status: 400
      }))
    } else {
      throw error;
    }
  }
  return Ok(parsedBody);
}