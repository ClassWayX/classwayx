import * as z from "zod"

const createClassFormSchema = z.object({
  classSoftId: z.preprocess(
    (val) => (Number(val)),
    z.number({
      error: "请重新填写班级 ID。"
    })
  ),

  className: z.string()
    .nonempty("班级名称不能为空。")
    .max(10, "班级名称最长 10 个单词。"),
  pushUrls: z.array(z.object({
    url: z.httpUrl("请检查 url 格式"),
  }))
    .nonempty("消息推送列表不能为空。"),
})

export default createClassFormSchema;