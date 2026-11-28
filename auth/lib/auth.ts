import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins/username";
import { getPrisma } from "@/lib/prisma";
import { MIN_PASSWORD_LENGTH } from "@/utils/auth-validation";
import { usernameSignUp } from "@/utils/username-sign-up";

function createAuth() {
  return betterAuth({
    database: prismaAdapter(getPrisma(), {
      provider: "postgresql",
      transaction: true,
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
    },
    plugins: [username({ displayUsername: false }), usernameSignUp()],
  });
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth() {
  // The container provides database credentials at runtime.
  auth ??= createAuth();
  return auth;
}
