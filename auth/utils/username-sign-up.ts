import { randomUUID } from "node:crypto";
import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint, dispatchAuthEndpoint, signUpEmail } from "better-auth/api";
import { z } from "zod";
import { signUpSchema } from "@/utils/auth-validation";

const signUpEmailEndpoint = signUpEmail();
const signUpResultSchema = z.object({
  headers: z.instanceof(Headers),
  response: z.object({
    user: z.object({ id: z.string(), name: z.string(), username: z.string() }),
  }),
});

export function usernameSignUp() {
  return {
    id: "username-sign-up",
    endpoints: {
      signUpUsername: createAuthEndpoint(
        "/sign-up/username",
        {
          method: "POST",
          body: signUpSchema,
          metadata: { noStore: true },
        },
        async (ctx) => {
          const { username, password } = ctx.body;
          const result = await dispatchAuthEndpoint(signUpEmailEndpoint, {
            context: ctx.context,
            request: ctx.request,
            headers: ctx.headers,
            asResponse: false,
            returnHeaders: true,
            body: {
              username,
              password,
              name: username,
              email: `${randomUUID()}@users.invalid`,
            },
          });

          const { headers, response } = signUpResultSchema.parse(result);
          for (const cookie of headers.getSetCookie()) {
            ctx.responseHeaders.append("Set-Cookie", cookie);
          }

          return ctx.json({ user: response.user });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
}
