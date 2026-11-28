import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/lib/auth";

export const { POST, GET } = toNextJsHandler((request) => getAuth().handler(request));
