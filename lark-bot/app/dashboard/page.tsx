import {fetchClasses} from "@/app/dashboard/_utils/fetchClasses";
import ClassNotFound from "@/app/dashboard/_components/ClassNotFound";
import LoadDashboardFailed from "@/app/dashboard/_components/LoadDashboardFailed";
import ClassTable from "@/app/dashboard/_components/ClassTable";
import AddClass from "@/app/dashboard/_components/AddClass";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const res = await fetchClasses();

  if (res.ok) {
    if (res.value.length == 0) {
      return <>
        <DashboardHeader />
        <ClassNotFound/>
      </>
    }
    return <>
      <DashboardHeader />
      <ClassTable classItems={res.value}></ClassTable>
      <AddClass />
    </>

  } else {
    return <>
      <DashboardHeader />
      <LoadDashboardFailed/>
    </>
  }
}

function DashboardHeader() { return <h1 className={"text-2xl font-bold"}>管理面板</h1> }
