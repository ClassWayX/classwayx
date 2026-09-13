import prisma from "@/lib/prisma";

export default async function CreateClass() {
  const data = await prisma.class.findMany()
  console.log(data)

  return <>
    <h1>Create class</h1>
    <p>{data.toString()}</p>
  </>;
}