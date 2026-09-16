import {fetchClasses} from "@/app/dashboard/_utils/fetchClasses";
import {Card, CardAction, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import RedirectButton from "@/components/RedirectButton";
import RefreshButton from "@/components/RefreshButton";
import {convertDateToChinese} from "@/utils/convertDateToChinese";
import ClassActions from "@/app/dashboard/_components/ClassActions";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const res = await fetchClasses();

  if (res.ok) {
    if (res.value.length == 0) {
      return <>
        <DashboardHeader />
        <Card className={"w-200"}>
          <CardHeader>
            <CardTitle>班级列表空空如也</CardTitle>
            <CardDescription>点击按钮去添加班级</CardDescription>
            <CardAction>
              <RedirectButton url={"/create-class"}>
                添加班级
              </RedirectButton>
            </CardAction>
          </CardHeader>
        </Card>
      </>
    }
    return <>
      <DashboardHeader />
      <Table className={"w-full flex flex-col items-center"}>
        <TableCaption>
          班级列表
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className={"w-60"}>班级名称</TableHead>
            <TableHead className={"w-40"}>班级 ID</TableHead>
            <TableHead className={"w-60"}>班级创建时间</TableHead>
            <TableHead className={"w-20 text-center"}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.value.map(item => (
            <TableRow key={item.class_soft_id}>
              <TableCell className={"w-60"}>{item.class_name}</TableCell>
              <TableCell className={"w-40"}>{item.class_soft_id}</TableCell>
              <TableCell className={"w-60"}>{convertDateToChinese(item.created_at)}</TableCell>
              <TableCell className={"w-20 text-center"}>
                <ClassActions classSoftId={item.class_soft_id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RedirectButton url={"/create-class"}>
        添加班级
      </RedirectButton>
    </>

  } else {
    return <>
      <DashboardHeader />
      <Card className={"w-200"}>
        <CardHeader>
          <CardTitle>数据加载失败</CardTitle>
          <CardDescription>请刷新重试。如果问题持续存在，请联系管理员。</CardDescription>
          <CardAction>
            <RefreshButton>
              重试
            </RefreshButton>
          </CardAction>
        </CardHeader>
      </Card>
    </>
  }
}

function DashboardHeader() { return <h1 className={"text-2xl font-bold"}>管理面板</h1> }
