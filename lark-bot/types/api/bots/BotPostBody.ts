import * as z  from 'zod';

const BotPostBody = z.object({
  message: z.string(),
})

export default BotPostBody;