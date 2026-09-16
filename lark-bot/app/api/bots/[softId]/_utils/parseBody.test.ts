import {describe, expect, it} from "vitest";
import {parseBody} from "@/app/api/bots/[softId]/_utils/parseBody";
import {NextResponse} from "next/server";

describe('parseBody test', () => {
  it('should return parsed body given correct inputs', () => {
    const rawBody = {
      message: ""
    }
    const result = parseBody(rawBody);

    if (result.ok) {
      expect(result.value).toEqual({message: ""});
    } else {
      expect.unreachable("result should be ok")
    }
  });

  it('should ignore redundant properties', () => {
    const rawBody = {
      message: "",
      foo: ""
    }
    const result = parseBody(rawBody);

    if (result.ok) {
      expect(result.value).toEqual({message: ""});
    } else {
      expect.unreachable("result should be ok")
    }
  })

  it ('should return failure given incorrect inputs', () => {
    const rawBody = {
      foo: ""
    }
    const result = parseBody(rawBody);

    if (result.ok) {
      expect.unreachable("result should not be ok")
    } else {
      expect(result.error instanceof NextResponse).toBe(true);
    }
  })
})