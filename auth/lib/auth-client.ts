import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { usernameSignUp } from "@/utils/username-sign-up";

export const authClient = createAuthClient({
  plugins: [
    usernameClient({ displayUsername: false }),
    {
      id: "username-sign-up",
      $InferServerPlugin: {} as ReturnType<typeof usernameSignUp>,
    },
  ],
});
