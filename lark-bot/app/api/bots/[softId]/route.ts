import {NextRequest, NextResponse} from "next/server";
import {parseBody} from "@/app/api/bots/[softId]/_utils/parseBody";
import {queryPushUrls} from "@/app/api/bots/[softId]/_utils/queryPushUrls";
import {sendMessageToPushUrl, SendMessageToPushUrlFailure} from "@/app/api/bots/[softId]/_utils/sendMessageToPushUrl";

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

  const parseBodyResult = parseBody(body);
  if (!parseBodyResult.ok) return parseBodyResult.error;

  const databaseQueryResult = await queryPushUrls(Number(softId));
  if (!databaseQueryResult.ok) return databaseQueryResult.error;

  const sendMessageResults = await Promise.all(
    databaseQueryResult.value.push_urls.map(url =>
      sendMessageToPushUrl(url, parseBodyResult.value.message)
    )
  );
  const { failureCount, failureDetails } = sendMessageResults.reduce(
    (acc, curr) => {
      if (!curr.ok) {
        acc.failureCount += 1;
        acc.failureDetails.push(curr.error);
      }
      return acc;
    },
    {
      failureCount: 0,
      failureDetails: [] as SendMessageToPushUrlFailure[],
    }
  );

  return NextResponse.json({
    code: "SUCCESS",
    message: `已向 ${databaseQueryResult.value.push_urls.length} 个 url 推送消息。`,
    data: {
      failureCount,
      failureDetails,
    }
  });
}