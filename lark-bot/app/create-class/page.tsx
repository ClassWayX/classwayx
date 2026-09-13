'use client'

import {Controller, useForm, useFieldArray, Resolver} from "react-hook-form";
import createClassFormSchema from "@/types/create-class/createClassFormSchema";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {onSubmit} from "@/app/create-class/_utils/onSubmit";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";

type formSchema = z.infer<typeof createClassFormSchema>

export default function CreateClass() {
  const form = useForm<formSchema>({
    resolver: zodResolver(createClassFormSchema) as unknown as Resolver<formSchema>,
    defaultValues: {
      className: "",
      pushUrls: [{url: ''}],
      classSoftId: NaN,
    }
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "pushUrls",
  });

  return <div className={"w-full flex flex-col items-center justify-center p-8 gap-6"}>
    <h1 className={"text-2xl font-bold"}>创建班级</h1>
    <Card className={"w-200 rounded-lg"}>
      <CardHeader>
        <CardTitle>填写班级信息</CardTitle>
        <CardDescription>创建班级后，即可通过飞书接收修为变化提醒。</CardDescription>
      </CardHeader>

      <CardContent>
        <form id={"create-class-form"} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
            name={"className"}
            control={form.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={"create-class-form-class-name"}>
                  班级名称
                </FieldLabel>
                <Input
                  {...field}
                  id={"create-class-form-class-name"}
                  aria-invalid={fieldState.invalid}
                  placeholder={"管理班级时会显示这个名字"}
                  autoComplete={"off"}
                  />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}></FieldError>
                )}
              </Field>
            )}>
            </Controller>

            <Controller
            name={"classSoftId"}
            control={form.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={"create-class-form-class-soft-id"}>
                  班级 ID
                </FieldLabel>
                <Input
                  id={"create-class-form-class-soft-id"}
                  type={"number"}
                  {...field}
                  value={Number.isNaN(field.value) ? '' : field.value}
                  aria-invalid={fieldState.invalid}
                  placeholder={"推送消息时，按照这个 ID 识别目标班级"}
                  autoComplete={"off"}
                  />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]}></FieldError>
                )}
              </Field>
            )}>
            </Controller>

            <Field>
              <FieldLabel>
                飞书消息推送 url
              </FieldLabel>
              {fieldArray.fields.map((field, index) => {
                const errStr = form.formState.errors.pushUrls?.[index]?.url?.message
                const hasError = errStr !== undefined

                return <InputGroup
                  key={field.id}>
                  <InputGroupInput
                    {...form.register(`pushUrls.${index}.url`, {required: true})}
                    aria-invalid={hasError}
                    placeholder={"飞书推送 url"}
                    autoComplete={"off"}
                  >
                  </InputGroupInput>
                  <InputGroupAddon>
                    {index + 1} &nbsp;
                  </InputGroupAddon>
                  {hasError && (
                    <InputGroupAddon align={"inline-end"} className={"text-red-500"}>
                      {errStr}
                    </InputGroupAddon>
                  )}
                  {fieldArray.fields.length > 1 && (
                    <InputGroupAddon align={"inline-end"}>
                      <Button type={"button"} variant={"secondary"}
                              onClick={() => fieldArray.remove(index)}>
                        删除 url
                      </Button>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              })}
              <Field orientation={"horizontal"}>
                <Button type={"button"} variant={"secondary"} onClick={() => fieldArray.append({url: ""})}>
                  添加 url
                </Button>
              </Field>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation={"horizontal"}>
          <Button type="submit" form={"create-class-form"}>
            提交
          </Button>
          <Button type={"reset"} variant={"outline"} onClick={() => form.reset()}>
            重置
          </Button>
        </Field>
      </CardFooter>
    </Card>
  </div>
  ;
}