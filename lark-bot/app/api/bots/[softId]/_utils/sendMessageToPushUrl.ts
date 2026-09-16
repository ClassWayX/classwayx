import {Err, Ok, Result} from "@/types/result";

export type SendMessageToPushUrlSuccess = undefined
export type SendMessageToPushUrlFailure = {
  failedUrl: string,
  details: object,
}

export async function sendMessageToPushUrl(
  url: string,
  message: string
): Promise<Result<SendMessageToPushUrlSuccess, SendMessageToPushUrlFailure>> {
  const fetchResponse = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      msg_type: "text",
      content: {
        text: message,
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
      return Err({
        failedUrl: url,
        details: responseJson,
      })
    }
  } else {
    return Err({
      failedUrl: url,
      details: responseJson,
    })
  }
  return Ok(undefined);
}