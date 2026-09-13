import createClassFormSchema from "@/types/create-class/createClassFormSchema";
import * as z from "zod";

type formSchema = z.infer<typeof createClassFormSchema>

export function unpackData(data: formSchema) {
  return {
    ...data,
    pushUrls: data.pushUrls.map(url => url.url)
  }
}