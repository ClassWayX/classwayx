import * as z from 'zod';
import createClassFormSchema from "@/types/create-class/createClassFormSchema";

export async function onSubmit(data: z.infer<typeof createClassFormSchema>): Promise<void> {
  // todo
  console.log(data);
  return;
}